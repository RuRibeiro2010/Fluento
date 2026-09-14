/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - REVIEW PLANNER
 * 
 * Selects SRS items due for active recall review from Learning Threads Runtime.
 */

import { ThreadSnapshot, ReviewMemoryItem } from '@/src/lib/learning-threads';

export class ReviewPlanner {
  public selectReviewItems(
    threads: ThreadSnapshot,
    maxItems: number = 5
  ): ReviewMemoryItem[] {
    const items = threads.reviewItems || [];

    // Prioritize items with highest decay score or lowest consecutive successes
    const sorted = [...items].sort((a, b) => {
      if (b.decayScore !== a.decayScore) {
        return b.decayScore - a.decayScore;
      }
      return a.consecutiveSuccesses - b.consecutiveSuccesses;
    });

    return sorted.slice(0, maxItems);
  }
}

export const reviewPlanner = new ReviewPlanner();
