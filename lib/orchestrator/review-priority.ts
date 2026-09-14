/**
 * Review Priority Module (AI Teaching Orchestrator - Phase 15)
 * Calculates forgetting curve priorities to ensure no critical concepts are forgotten.
 */

export interface ReviewCandidate {
  id: string;
  conceptName: string;
  daysSinceLastReviewed: number;
  historicalErrorRate: number; // 0 to 1
  cefrLevel: string;
}

export interface CalculatedReviewPriority {
  candidate: ReviewCandidate;
  urgencyScore: number; // 0 to 100
  isUrgent: boolean;
}

export function calculateReviewPriorities(
  candidates: ReviewCandidate[]
): CalculatedReviewPriority[] {
  return candidates
    .map((candidate) => {
      // Ebbinghaus forgetting estimate score
      const daysFactor = Math.min(30, candidate.daysSinceLastReviewed) * 2.5;
      const errorFactor = candidate.historicalErrorRate * 45;
      const urgencyScore = Math.min(100, Math.round(daysFactor + errorFactor));

      return {
        candidate,
        urgencyScore,
        isUrgent: urgencyScore > 65,
      };
    })
    .sort((a, b) => b.urgencyScore - a.urgencyScore);
}
