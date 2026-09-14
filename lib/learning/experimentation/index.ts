/**
 * Dedicated Experimentation & Personalization Engine Hub
 * Located at lib/learning/experimentation/
 * Fully decoupled from UI layout and architecture.
 *
 * Combines Teaching Strategy Comparison, Personal Learning Profile Tracking,
 * Automatic Session Optimization, Adaptive Lesson Structuring, Session Duration Discovery,
 * Time of Day Discovery, Personal Motivation Engine, and Goldilocks Challenge Level Tuning.
 */

export * from './strategy-types';
export * from './personal-learning-profile';
export * from './config';
export * from './teaching-strategy-engine';
export * from './session-analysis';
export * from './adaptive-structure';
export * from './motivation-engine';
export * from './challenge-engine';

import {
  createDefaultPersonalLearningProfile,
  PersonalLearningProfile,
} from './personal-learning-profile';
import { selectOptimalStrategy, SelectedLessonStrategy } from './teaching-strategy-engine';
import { analyzeSessionAndUpdateProfile, SessionAnalysisInput } from './session-analysis';
import { buildAdaptiveLessonStructure, AdaptiveLessonPlan } from './adaptive-structure';
import { generateUniqueMotivationalMessage, MotivationalMessage } from './motivation-engine';
import { computeOptimalChallengeParameters, AdjustedChallengeParameters } from './challenge-engine';

export const PersonalLearningOptimizer = {
  createDefaultProfile: createDefaultPersonalLearningProfile,
  selectOptimalStrategy,
  analyzeSessionAndUpdateProfile,
  buildAdaptiveLessonStructure,
  generateUniqueMotivationalMessage,
  computeOptimalChallengeParameters,
};
