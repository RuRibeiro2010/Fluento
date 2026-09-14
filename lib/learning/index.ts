/**
 * Unified Learning Science Engine Hub
 * Evidence-based cognitive science framework incorporating Active Recall,
 * Retrieval Practice, Dynamic Spaced Repetition, Interleaving, Cognitive Load Management,
 * Confidence-Based Learning, Transfer Learning, Metacognition, Deliberate Practice,
 * Learning Efficiency Scoring (LES), Adaptive Review, Mastery Learning, and Multi-Strategy Explanations.
 */

export * from './science-config';
export * from './active-recall';
export * from './retrieval-practice';
export * from './spaced-repetition';
export * from './interleaving-engine';
export * from './cognitive-load';
export * from './confidence-learning';
export * from './transfer-learning';
export * from './metacognition';
export * from './deliberate-practice';
export * from './efficiency-score';
export * from './adaptive-review';
export * from './mastery-learning';
export * from './explain-engine';
export * from './confidence';
export * from './plan-utils';
export * from './scoring';
export * from './experimentation';

import { getLearningScienceConfig, updateLearningScienceConfig } from './science-config';
import { convertToActiveRecall, evaluateActiveRecallAttempt } from './active-recall';
import { selectUnannouncedRetrievalItems } from './retrieval-practice';
import { evaluateItemForgettingProbability } from './spaced-repetition';
import { interleaveLessonActivities } from './interleaving-engine';
import { evaluateCognitiveLoad } from './cognitive-load';
import { evaluateConfidenceBasedMastery } from './confidence-learning';
import { registerContextApplication } from './transfer-learning';
import { generateMetacognitivePrompts, processMetacognitiveFeedback } from './metacognition';
import { generateDeliberatePracticeSet } from './deliberate-practice';
import { calculateLearningEfficiencyScore } from './efficiency-score';
import { filterItemsForAdaptiveReview } from './adaptive-review';
import { evaluateConceptMastery } from './mastery-learning';
import { generateMultiStrategyExplanation } from './explain-engine';

export const LearningScienceEngine = {
  getConfig: getLearningScienceConfig,
  updateConfig: updateLearningScienceConfig,
  convertToActiveRecall,
  evaluateActiveRecallAttempt,
  selectUnannouncedRetrievalItems,
  evaluateItemForgettingProbability,
  interleaveLessonActivities,
  evaluateCognitiveLoad,
  evaluateConfidenceBasedMastery,
  registerContextApplication,
  generateMetacognitivePrompts,
  processMetacognitiveFeedback,
  generateDeliberatePracticeSet,
  calculateLearningEfficiencyScore,
  filterItemsForAdaptiveReview,
  evaluateConceptMastery,
  generateMultiStrategyExplanation,
};
