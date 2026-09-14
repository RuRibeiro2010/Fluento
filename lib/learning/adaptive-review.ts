/**
 * Módulo 11: Adaptive Review Engine
 * Never reviews indiscriminately. Selects only items on the verge of being forgotten
 * or items required as prerequisite unlocks for upcoming topics.
 */

import { ItemMemoryState, evaluateItemForgettingProbability } from './spaced-repetition';

export interface CandidateReviewItem extends ItemMemoryState {
  isPrerequisiteForUpcomingTopic?: boolean;
}

export function filterItemsForAdaptiveReview(
  candidates: CandidateReviewItem[]
): CandidateReviewItem[] {
  return candidates.filter((item) => {
    const evaluation = evaluateItemForgettingProbability(item);

    // Rule 1: Item is on the verge of being forgotten (Probability > 18%)
    const isVergeOfForgetting = evaluation.currentForgettingProbability >= 0.18;

    // Rule 2: Item unlocks an upcoming topic
    const isUnlockingPrerequisite = !!item.isPrerequisiteForUpcomingTopic;

    return isVergeOfForgetting || isUnlockingPrerequisite;
  });
}
