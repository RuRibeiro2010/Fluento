/**
 * Human Learning Experience (HLX) Engine Hub
 * Located at lib/hlx/
 *
 * Coordinates AI Brain, Pedagogical Engine, Live Engine, Teacher Presence, and Memory
 * into a natural, empathetic, human-tutor experience.
 */

export * from './emotional-memory';
export * from './relationship-engine';
export * from './conversation-style';
export * from './cultural-engine';
export * from './micro-moments';
export * from './goal-engine';
export * from './monthly-roadmap';
export * from './humanization-engine';
export * from './experience-orchestrator';

import {
  createInitialEmotionalState,
  recordEmotionalMilestone,
} from './emotional-memory';

import {
  initializeTeacherRapport,
  advanceRapportSession,
  generateSpontaneousRapportCallback,
} from './relationship-engine';

import {
  createInitialStyleConfig,
  generateVariedPraise,
} from './conversation-style';

import { selectRelevantCulturalInsight } from './cultural-engine';
import { triggerMicroMoment } from './micro-moments';
import { createInvisibleGoalsForSession, evaluateInvisibleGoalProgress } from './goal-engine';
import { generateMonthlyRoadmap } from './monthly-roadmap';
import { computeHumanSpeechRhythm, filterOutRoboticPhrases } from './humanization-engine';
import {
  initializeHLXSession,
  processHLXTeacherTurn,
  finalizeHLXSession,
} from './experience-orchestrator';

export const HumanLearningExperience = {
  createInitialEmotionalState,
  recordEmotionalMilestone,
  initializeTeacherRapport,
  advanceRapportSession,
  generateSpontaneousRapportCallback,
  createInitialStyleConfig,
  generateVariedPraise,
  selectRelevantCulturalInsight,
  triggerMicroMoment,
  createInvisibleGoalsForSession,
  evaluateInvisibleGoalProgress,
  generateMonthlyRoadmap,
  computeHumanSpeechRhythm,
  filterOutRoboticPhrases,
  initializeHLXSession,
  processHLXTeacherTurn,
  finalizeHLXSession,
};
