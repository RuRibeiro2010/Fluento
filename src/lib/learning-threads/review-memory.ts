/**
 * FLUENTO LEARNING THREADS - REVIEW MEMORY MANAGER
 * 
 * Manages Spaced Repetition System (SRS) vocabulary, idiom, and grammar review items.
 */

import { ReviewMemoryItem, ThreadSnapshot } from './types';
import { CEFRLevel } from '@/types/brain';

export class ReviewMemoryManager {
  /**
   * Adds or updates an SRS ReviewItem in a ThreadSnapshot.
   */
  public addOrUpdateReviewItem(
    snapshot: ThreadSnapshot,
    params: {
      conceptOrWord: string;
      category: 'vocabulary' | 'grammar_structure' | 'idiom' | 'phrasal_verb' | 'pronunciation_pattern';
      cefrLevel?: CEFRLevel;
      initialStabilityDays?: number;
      difficulty?: number;
    }
  ): { updatedSnapshot: ThreadSnapshot; reviewItem: ReviewMemoryItem } {
    const existingIndex = snapshot.reviewItems.findIndex(
      r => r.conceptOrWord.toLowerCase() === params.conceptOrWord.toLowerCase()
    );

    let updatedReviewItems = [...snapshot.reviewItems];
    let targetItem: ReviewMemoryItem;

    const nowIso = new Date().toISOString();
    const stability = params.initialStabilityDays || 1;
    const nextReviewDate = new Date(Date.now() + stability * 24 * 60 * 60 * 1000).toISOString();

    if (existingIndex >= 0) {
      const existing = updatedReviewItems[existingIndex];
      targetItem = {
        ...existing,
        lastReviewedIso: nowIso,
        nextReviewIso: nextReviewDate,
        decayScore: 0
      };
      updatedReviewItems[existingIndex] = targetItem;
    } else {
      targetItem = {
        id: `srs_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        studentId: snapshot.studentId,
        createdIso: nowIso,
        conceptOrWord: params.conceptOrWord,
        category: params.category,
        cefrLevel: params.cefrLevel || 'A2',
        stability,
        difficulty: params.difficulty || 5,
        lastReviewedIso: nowIso,
        nextReviewIso: nextReviewDate,
        decayScore: 0,
        consecutiveSuccesses: 0
      };
      updatedReviewItems = [targetItem, ...updatedReviewItems];
    }

    const updatedSnapshot: ThreadSnapshot = {
      ...snapshot,
      reviewItems: updatedReviewItems,
      revision: snapshot.revision + 1
    };

    return { updatedSnapshot, reviewItem: targetItem };
  }

  /**
   * Returns items due for review (decayScore >= 50 or past nextReviewIso).
   */
  public getDueReviewItems(snapshot: ThreadSnapshot): ReviewMemoryItem[] {
    const now = new Date();
    return snapshot.reviewItems.filter(
      r => r.decayScore >= 50 || new Date(r.nextReviewIso) <= now
    );
  }
}

export const reviewMemoryManager = new ReviewMemoryManager();
