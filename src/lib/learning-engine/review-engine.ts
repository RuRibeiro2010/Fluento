/**
 * FLUENTO LEARNING ENGINE - REVIEW ENGINE
 * 
 * Spaced Repetition System (SRS) and memory decay manager based on the
 * Ebbinghaus forgetting curve. Selects items for review from the Intermediate
 * Learning Thread without overwhelming the student's cognitive budget.
 */

import { ReviewItem, StudentLearningState } from './types';

export class ReviewEngine {
  /**
   * Evaluates a list of candidate review items and returns items due for review in the current session.
   */
  public selectReviewItems(
    candidateItems: ReviewItem[],
    studentState: StudentLearningState
  ): ReviewItem[] {
    const { availableMinutes, energyLevel, fatigueScore, speakingAnxietyLevel } = studentState;

    // Determine max quota of review items based on session constraints
    let maxQuota = 3;
    if (availableMinutes <= 5 || fatigueScore >= 70 || energyLevel <= 3) {
      maxQuota = 1; // Minimal review budget when tired or constrained
    } else if (availableMinutes >= 20 && energyLevel >= 7) {
      maxQuota = 5;
    } else if (availableMinutes >= 10) {
      maxQuota = 3;
    }

    if (candidateItems.length === 0 || maxQuota === 0) {
      return [];
    }

    // Sort candidate items by decay score descending (most forgotten first)
    const sorted = [...candidateItems].sort((a, b) => b.decayScore - a.decayScore);

    // Filter out items that are too difficult if anxiety is very high
    const filtered = sorted.filter((item) => {
      if (speakingAnxietyLevel >= 70 && item.difficulty >= 8) {
        return false; // Exclude high difficulty items during high anxiety
      }
      return true;
    });

    return filtered.slice(0, maxQuota);
  }

  /**
   * Calculates the updated decay score (0-100) for a memory item based on days passed and stability.
   * Based on Ebbinghaus model: R = e^(-t/S)
   */
  public calculateDecayScore(daysSinceLastReview: number, stabilityDays: number): number {
    if (stabilityDays <= 0) return 100;
    const retention = Math.exp(-daysSinceLastReview / stabilityDays);
    const decay = Math.round((1 - retention) * 100);
    return Math.min(100, Math.max(0, decay));
  }

  /**
   * Updates an item's stability and next review date following a review attempt.
   */
  public updateItemAfterReview(
    item: ReviewItem,
    wasSuccessful: boolean
  ): ReviewItem {
    const nowIso = new Date().toISOString();
    let newStability = item.stability;
    let newConsecutive = item.consecutiveSuccesses;

    if (wasSuccessful) {
      newConsecutive += 1;
      // Exponential increase in stability on success
      newStability = Math.round(item.stability * (1.5 + newConsecutive * 0.2));
    } else {
      newConsecutive = 0;
      // Reset or halve stability on failure
      newStability = Math.max(1, Math.round(item.stability * 0.5));
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newStability);

    return {
      ...item,
      stability: newStability,
      consecutiveSuccesses: newConsecutive,
      lastReviewedIso: nowIso,
      nextReviewIso: nextReviewDate.toISOString(),
      decayScore: 0 // Freshly reviewed
    };
  }
}

export const reviewEngine = new ReviewEngine();
