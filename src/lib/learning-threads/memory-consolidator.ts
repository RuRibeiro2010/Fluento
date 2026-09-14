/**
 * FLUENTO LEARNING THREADS - MEMORY CONSOLIDATOR
 * 
 * Performs periodic memory consolidation: deduplicates items, resolves difficulties
 * when mastery is demonstrated by success memories, purges stale ephemeral notes,
 * and updates decay scores.
 */

import { ThreadSnapshot, ConsolidationReport } from './types';
import { memoryDecay } from './memory-decay';

export class MemoryConsolidator {
  /**
   * Consolidates a ThreadSnapshot immutably.
   */
  public consolidateSnapshot(snapshot: ThreadSnapshot, currentDate: Date = new Date()): {
    consolidatedSnapshot: ThreadSnapshot;
    report: ConsolidationReport;
  } {
    let duplicateItemsRemoved = 0;
    let difficultiesResolved = 0;
    let ephemeralNotesCleaned = 0;
    let decayUpdatedItemsCount = 0;

    // 1. Update Decay for all Review Items
    const updatedReviewItems = snapshot.reviewItems.map(item => {
      const decayRes = memoryDecay.calculateDecay(item, currentDate);
      if (decayRes.newDecayScore !== item.decayScore) {
        decayUpdatedItemsCount += 1;
      }
      return {
        ...item,
        decayScore: decayRes.newDecayScore
      };
    });

    // 2. Deduplicate Review Items by conceptOrWord
    const uniqueReviewMap = new Map<string, typeof updatedReviewItems[0]>();
    for (const item of updatedReviewItems) {
      const key = item.conceptOrWord.trim().toLowerCase();
      if (uniqueReviewMap.has(key)) {
        duplicateItemsRemoved += 1;
        const existing = uniqueReviewMap.get(key)!;
        // Keep the one with highest stability or most recent review
        if (item.stability > existing.stability) {
          uniqueReviewMap.set(key, item);
        }
      } else {
        uniqueReviewMap.set(key, item);
      }
    }
    const deduplicatedReviewItems = Array.from(uniqueReviewMap.values());

    // 3. Resolve Difficulties if corresponding Success Memory exists
    const updatedDifficulties = snapshot.difficulties.map(diff => {
      if (diff.isResolved) return diff;

      const diffTitleLower = diff.title.toLowerCase();
      const matchingSuccess = snapshot.successes.find(succ =>
        succ.title.toLowerCase().includes(diffTitleLower) ||
        succ.description.toLowerCase().includes(diffTitleLower)
      );

      if (matchingSuccess) {
        difficultiesResolved += 1;
        return {
          ...diff,
          isResolved: true,
          resolutionTimestampIso: currentDate.toISOString()
        };
      }
      return diff;
    });

    // 4. Clean Stale Ephemeral Notes (keep only last 10 notes or notes < 14 days old)
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
    const initialNotesCount = snapshot.ephemeralNotes.length;
    const cleanedNotes = snapshot.ephemeralNotes.filter(note => {
      const ageMs = currentDate.getTime() - new Date(note.timestampIso).getTime();
      return ageMs < fourteenDaysMs;
    }).slice(-10); // cap at 10 most recent

    ephemeralNotesCleaned = initialNotesCount - cleanedNotes.length;

    const consolidatedSnapshot: ThreadSnapshot = {
      ...snapshot,
      reviewItems: deduplicatedReviewItems,
      difficulties: updatedDifficulties,
      ephemeralNotes: cleanedNotes,
      lastConsolidatedIso: currentDate.toISOString(),
      revision: snapshot.revision + 1
    };

    const report: ConsolidationReport = {
      timestampIso: currentDate.toISOString(),
      studentId: snapshot.studentId,
      duplicateItemsRemoved,
      difficultiesResolved,
      ephemeralNotesCleaned,
      decayUpdatedItemsCount,
      summaryNote: `Consolidação concluída: ${difficultiesResolved} dificuldades resolvidas, ${duplicateItemsRemoved} duplicados removidos.`
    };

    return {
      consolidatedSnapshot,
      report
    };
  }
}

export const memoryConsolidator = new MemoryConsolidator();
