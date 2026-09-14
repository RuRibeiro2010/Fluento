/**
 * FLUENTO LEARNING THREADS - MEMORY DECAY
 * 
 * Computes memory retention decay over time using Spaced Repetition (SRS)
 * stability formulas, calculating decay scores and identifying review needs.
 */

import { ReviewMemoryItem, DecayCalculationResult } from './types';

export class MemoryDecay {
  /**
   * Calculates decay score and review status for a review item based on elapsed time.
   */
  public calculateDecay(item: ReviewMemoryItem, currentDate: Date = new Date()): DecayCalculationResult {
    const lastReviewedDate = new Date(item.lastReviewedIso);
    const elapsedMs = Math.max(0, currentDate.getTime() - lastReviewedDate.getTime());
    const daysElapsed = elapsedMs / (1000 * 60 * 60 * 24);

    // SRS exponential decay formula: Retention = e^(-t / stability)
    // Decay Score = (1 - Retention) * 100
    const stabilityDays = Math.max(0.5, item.stability || 1.0);
    const retentionRatio = Math.exp(-daysElapsed / stabilityDays);
    const rawDecayScore = Math.round((1 - retentionRatio) * 100);

    const newDecayScore = Math.min(100, Math.max(0, rawDecayScore));
    const isDueForReview = newDecayScore >= 50 || currentDate >= new Date(item.nextReviewIso);

    return {
      itemId: item.id,
      previousDecayScore: item.decayScore,
      newDecayScore,
      daysElapsed: Math.round(daysElapsed * 10) / 10,
      isDueForReview
    };
  }

  /**
   * Updates review item stability and schedules next review after a review attempt.
   */
  public updatePostReview(
    item: ReviewMemoryItem,
    success: boolean,
    currentDate: Date = new Date()
  ): ReviewMemoryItem {
    let newStability = item.stability || 1;
    let newDifficulty = item.difficulty || 5;
    let consecutiveSuccesses = item.consecutiveSuccesses || 0;

    if (success) {
      consecutiveSuccesses += 1;
      // Expand stability interval exponentially: 1 -> 3 -> 7 -> 16 -> 35 days
      newStability = Math.round(newStability * (1.8 + consecutiveSuccesses * 0.2));
      newDifficulty = Math.max(1, newDifficulty - 0.5);
    } else {
      consecutiveSuccesses = 0;
      // Reset stability on failure
      newStability = Math.max(1, Math.round(newStability * 0.5));
      newDifficulty = Math.min(10, newDifficulty + 1.0);
    }

    const nextReviewDate = new Date(currentDate.getTime() + newStability * 24 * 60 * 60 * 1000);

    return {
      ...item,
      stability: newStability,
      difficulty: newDifficulty,
      consecutiveSuccesses,
      lastReviewedIso: currentDate.toISOString(),
      nextReviewIso: nextReviewDate.toISOString(),
      decayScore: 0
    };
  }
}

export const memoryDecay = new MemoryDecay();
