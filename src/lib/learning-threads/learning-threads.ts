/**
 * FLUENTO LEARNING THREADS - MAIN FACADE
 * 
 * Central coordinator for long-term pedagogical memory.
 * Integrates memory classification, promotion, decay calculation, consolidation,
 * query search, telemetry, and seamless Student Digital Twin synchronization.
 * 
 * STRICT MANDATES:
 * - NEVER store raw full conversation chat histories.
 * - STORE ONLY structured, actionable pedagogical knowledge.
 * - PRESERVE single source of truth without state duplication in Student Digital Twin.
 */

import { MemoryThreadsContext } from '@/src/lib/learning-engine';
import { studentDigitalTwin } from '@/src/lib/student-digital-twin';
import {
  ThreadSnapshot,
  EphemeralNote,
  SuccessMemory,
  DifficultyMemory,
  ReviewMemoryItem,
  ConsolidationReport,
  ThreadSearchFilter,
  PromotionRuleResult
} from './types';

import { threadManager } from './thread-manager';
import { memoryClassifier } from './memory-classifier';
import { memoryPromoter } from './memory-promoter';
import { memoryDecay } from './memory-decay';
import { memoryConsolidator } from './memory-consolidator';
import { successMemoryManager } from './success-memory';
import { difficultyMemoryManager } from './difficulty-memory';
import { reviewMemoryManager } from './review-memory';
import { threadSearch } from './thread-search';
import { threadTelemetry } from './telemetry';

export class LearningThreadsRuntime {
  /**
   * Retrieves current thread snapshot for a student.
   */
  public getSnapshot(studentId: string): ThreadSnapshot {
    return threadManager.getOrCreateSnapshot(studentId);
  }

  /**
   * Ingests a raw pedagogical note, classifies it, stores it, and checks for auto-promotion.
   */
  public ingestNote(
    studentId: string,
    sessionId: string,
    content: string,
    categoryTag = 'session_observation'
  ): {
    note: EphemeralNote;
    promotionResult: PromotionRuleResult;
    updatedSnapshot: ThreadSnapshot;
  } {
    const snapshot = this.getSnapshot(studentId);
    const classification = memoryClassifier.classifyNote(content);

    const note: EphemeralNote = {
      id: `eph_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      sessionId,
      timestampIso: new Date().toISOString(),
      content,
      categoryTag
    };

    let updatedSnapshot: ThreadSnapshot = {
      ...snapshot,
      ephemeralNotes: [note, ...snapshot.ephemeralNotes],
      revision: snapshot.revision + 1
    };

    // Check for memory promotion
    const promotionResult = memoryPromoter.evaluatePromotion(note, updatedSnapshot);

    if (promotionResult.promoted && promotionResult.newItem) {
      if (promotionResult.promotedItemType === 'success') {
        updatedSnapshot.successes = [promotionResult.newItem as SuccessMemory, ...updatedSnapshot.successes];
      } else if (promotionResult.promotedItemType === 'difficulty') {
        updatedSnapshot.difficulties = [promotionResult.newItem as DifficultyMemory, ...updatedSnapshot.difficulties];
      }
      updatedSnapshot.totalPromotionsCount += 1;

      threadTelemetry.recordEvent({
        eventId: `evt_prom_${Date.now()}`,
        studentId,
        timestampIso: new Date().toISOString(),
        action: 'promoted',
        itemCategory: promotionResult.promotedItemType === 'success' ? 'success_breakthrough' : 'persistent_difficulty',
        itemId: promotionResult.newItem.id,
        details: promotionResult.reason || 'Auto-promoted from ephemeral note'
      });
    }

    threadManager.saveSnapshot(updatedSnapshot);

    // Sync to Student Digital Twin
    this.syncToDigitalTwin(studentId, updatedSnapshot);

    return { note, promotionResult, updatedSnapshot };
  }

  /**
   * Manually adds a Success Memory.
   */
  public addSuccessMemory(
    studentId: string,
    title: string,
    description: string
  ): { updatedSnapshot: ThreadSnapshot; newSuccess: SuccessMemory } {
    const current = this.getSnapshot(studentId);
    const { updatedSnapshot, newSuccess } = successMemoryManager.addSuccess(current, { title, description });

    threadManager.saveSnapshot(updatedSnapshot);
    this.syncToDigitalTwin(studentId, updatedSnapshot);

    threadTelemetry.recordEvent({
      eventId: `evt_add_succ_${Date.now()}`,
      studentId,
      timestampIso: new Date().toISOString(),
      action: 'added',
      itemCategory: 'success_breakthrough',
      itemId: newSuccess.id,
      details: `Success memory added: ${title}`
    });

    return { updatedSnapshot, newSuccess };
  }

  /**
   * Manually adds or updates a Difficulty Memory.
   */
  public recordDifficultyMemory(
    studentId: string,
    title: string,
    description: string
  ): { updatedSnapshot: ThreadSnapshot; difficulty: DifficultyMemory } {
    const current = this.getSnapshot(studentId);
    const { updatedSnapshot, difficulty } = difficultyMemoryManager.recordDifficulty(current, { title, description });

    threadManager.saveSnapshot(updatedSnapshot);
    this.syncToDigitalTwin(studentId, updatedSnapshot);

    threadTelemetry.recordEvent({
      eventId: `evt_add_diff_${Date.now()}`,
      studentId,
      timestampIso: new Date().toISOString(),
      action: 'added',
      itemCategory: 'persistent_difficulty',
      itemId: difficulty.id,
      details: `Difficulty recorded: ${title}`
    });

    return { updatedSnapshot, difficulty };
  }

  /**
   * Adds or updates an SRS Review Item.
   */
  public addReviewItem(
    studentId: string,
    conceptOrWord: string,
    category: 'vocabulary' | 'grammar_structure' | 'idiom' | 'phrasal_verb' | 'pronunciation_pattern'
  ): { updatedSnapshot: ThreadSnapshot; reviewItem: ReviewMemoryItem } {
    const current = this.getSnapshot(studentId);
    const { updatedSnapshot, reviewItem } = reviewMemoryManager.addOrUpdateReviewItem(current, {
      conceptOrWord,
      category
    });

    threadManager.saveSnapshot(updatedSnapshot);
    this.syncToDigitalTwin(studentId, updatedSnapshot);

    return { updatedSnapshot, reviewItem };
  }

  /**
   * Records the result of an SRS review attempt and updates stability & decay.
   */
  public recordReviewAttempt(
    studentId: string,
    reviewItemId: string,
    success: boolean
  ): ThreadSnapshot {
    const snapshot = this.getSnapshot(studentId);
    const itemIndex = snapshot.reviewItems.findIndex(r => r.id === reviewItemId);

    if (itemIndex === -1) {
      throw new Error(`Review item ${reviewItemId} not found`);
    }

    const item = snapshot.reviewItems[itemIndex];
    const updatedItem = memoryDecay.updatePostReview(item, success);

    const updatedReviewItems = [...snapshot.reviewItems];
    updatedReviewItems[itemIndex] = updatedItem;

    const updatedSnapshot: ThreadSnapshot = {
      ...snapshot,
      reviewItems: updatedReviewItems,
      revision: snapshot.revision + 1
    };

    threadManager.saveSnapshot(updatedSnapshot);
    this.syncToDigitalTwin(studentId, updatedSnapshot);

    return updatedSnapshot;
  }

  /**
   * Runs memory consolidation (decay recalculation, deduplication, difficulty resolution, stale note cleanup).
   */
  public consolidate(studentId: string): {
    consolidatedSnapshot: ThreadSnapshot;
    report: ConsolidationReport;
  } {
    const snapshot = this.getSnapshot(studentId);
    const { consolidatedSnapshot, report } = memoryConsolidator.consolidateSnapshot(snapshot);

    threadManager.saveSnapshot(consolidatedSnapshot);
    this.syncToDigitalTwin(studentId, consolidatedSnapshot);

    threadTelemetry.recordEvent({
      eventId: `evt_cons_${Date.now()}`,
      studentId,
      timestampIso: new Date().toISOString(),
      action: 'consolidated',
      itemCategory: 'ephemeral_session_note',
      itemId: studentId,
      details: report.summaryNote
    });

    return { consolidatedSnapshot, report };
  }

  /**
   * Queries and searches across thread memory.
   */
  public search(studentId: string, filter: ThreadSearchFilter) {
    const snapshot = this.getSnapshot(studentId);
    return threadSearch.searchThreads(snapshot, filter);
  }

  /**
   * Exports thread snapshot as a `MemoryThreadsContext` for the Decision Pipeline & Prompt Builder.
   */
  public exportToMemoryThreadsContext(studentId: string): MemoryThreadsContext {
    const snapshot = this.getSnapshot(studentId);

    const activeSuccesses = snapshot.successes.map(s => `${s.title}: ${s.description}`);
    const activeDifficulties = snapshot.difficulties
      .filter(d => !d.isResolved)
      .map(d => `${d.title}: ${d.description}`);

    const dueReviewItems = reviewMemoryManager.getDueReviewItems(snapshot);

    return {
      permanentSuccessMemories: activeSuccesses,
      permanentTraumaOrBlocks: activeDifficulties,
      intermediateDecayingItemsCount: dueReviewItems.length,
      intermediateReviewItems: snapshot.reviewItems,
      ephemeralSessionNotes: snapshot.ephemeralNotes.map(n => n.content)
    };
  }

  /**
   * Synchronizes ThreadSnapshot memory to Student Digital Twin without state duplication.
   */
  public syncToDigitalTwin(studentId: string, snapshot: ThreadSnapshot): void {
    const memoryThreads = this.exportToMemoryThreadsContext(studentId);
    const twin = studentDigitalTwin.getOrCreateTwin(studentId);

    studentDigitalTwin.updateTwin(studentId, {
      memory: {
        ...twin.memory,
        permanentSuccessMemories: memoryThreads.permanentSuccessMemories,
        permanentTraumaOrBlocks: memoryThreads.permanentTraumaOrBlocks,
        reviewItems: snapshot.reviewItems,
        ephemeralSessionNotes: snapshot.ephemeralNotes.map(n => n.content),
        activeThreadsCount: snapshot.successes.length + snapshot.difficulties.length
      }
    });
  }

  /**
   * Imports initial state from Student Digital Twin into Learning Threads Runtime.
   */
  public syncFromDigitalTwin(studentId: string): ThreadSnapshot {
    const twin = studentDigitalTwin.getOrCreateTwin(studentId);
    const snapshot = threadManager.getOrCreateSnapshot(studentId);

    // Merge Digital Twin success strings into SuccessMemories if not already present
    const updatedSuccesses = [...snapshot.successes];
    twin.memory.permanentSuccessMemories.forEach(succStr => {
      if (!updatedSuccesses.some(s => s.description === succStr || s.title === succStr)) {
        updatedSuccesses.push({
          id: `succ_dt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          studentId,
          timestampIso: new Date().toISOString(),
          title: succStr.split(':')[0] || 'Conquista Importada',
          description: succStr,
          cefrLevel: 'A2',
          skillCategory: 'speaking',
          confidenceBoostScore: 10,
          permanenceLevel: 'permanent',
          occurrenceCount: 1
        });
      }
    });

    const updatedSnapshot: ThreadSnapshot = {
      ...snapshot,
      successes: updatedSuccesses,
      revision: snapshot.revision + 1
    };

    threadManager.saveSnapshot(updatedSnapshot);
    return updatedSnapshot;
  }
}

export const learningThreadsRuntime = new LearningThreadsRuntime();
