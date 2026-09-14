/**
 * Live Experience Engine Hub
 * Located at lib/live/
 *
 * Powers real-time, human-like virtual teacher conversation sessions:
 * Lesson Director, Conversation Session, Correction Budget, Freeze Detection,
 * Intervention Engine, Subtitle Engine, Lesson Modes, Mission Engine,
 * Teacher Presence, and Adaptive Flow.
 */

export * from './lesson-director';
export * from './lesson-modes';
export * from './conversation-session';
export * from './correction-budget';
export * from './freeze-detection';
export * from './intervention-engine';
export * from './subtitle-engine';
export * from './mission-engine';
export * from './teacher-presence';
export * from './adaptive-flow';

import { planLiveSession } from './lesson-director';
import { getLessonModeDefinition } from './lesson-modes';
import { createLiveConversationSession, recordLiveTurn } from './conversation-session';
import { initializeCorrectionBudget, canDeliverCorrection } from './correction-budget';
import { analyzeStudentFreeze } from './freeze-detection';
import { evaluateLiveIntervention } from './intervention-engine';
import { createSubtitleFrame, getRenderableSubtitleContent } from './subtitle-engine';
import { initializeMission, evaluateMissionUtterance } from './mission-engine';
import { getDefaultTeacherPersona, generatePedagogicalHelpExplanation } from './teacher-presence';
import { computeAdaptiveFlowAdjustment } from './adaptive-flow';

export const LiveExperienceEngine = {
  planLiveSession,
  getLessonModeDefinition,
  createLiveConversationSession,
  recordLiveTurn,
  initializeCorrectionBudget,
  canDeliverCorrection,
  analyzeStudentFreeze,
  evaluateLiveIntervention,
  createSubtitleFrame,
  getRenderableSubtitleContent,
  initializeMission,
  evaluateMissionUtterance,
  getDefaultTeacherPersona,
  generatePedagogicalHelpExplanation,
  computeAdaptiveFlowAdjustment,
};
