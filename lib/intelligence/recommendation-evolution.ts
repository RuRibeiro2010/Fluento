/**
 * Recommendation Evolution Module (Fluento Intelligence 1.0 - Phase 16)
 * Handles gradual, safe, and reversible tuning of recommendation weights
 * for lesson suggestions, daily missions, and teacher selection.
 */

export interface RecommendationWeights {
  interestWeight: number;
  professionWeight: number;
  weaknessReviewWeight: number;
  streakMaintenanceWeight: number;
}

export function evolveRecommendationWeights(
  currentWeights: RecommendationWeights,
  recentUserFeedbackRating: number // 1 to 5
): RecommendationWeights {
  if (recentUserFeedbackRating >= 4) {
    // Keep or subtly reinforce current balance
    return currentWeights;
  }

  // If user rating is low, boost weakness review weight slightly to reinforce fundamentals
  return {
    ...currentWeights,
    weaknessReviewWeight: Math.min(0.5, currentWeights.weaknessReviewWeight + 0.05),
    interestWeight: Math.max(0.1, currentWeights.interestWeight - 0.02),
  };
}
