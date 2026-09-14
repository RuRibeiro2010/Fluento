/**
 * Human Teaching Engine Hub
 * Located at lib/teacher/teaching/
 *
 * Fully decoupled architecture powering human-like virtual teacher behaviors:
 * Guided Discovery, Learning Moments, Conversation Flow, Confidence Adaptation,
 * Continuous Story Engine, NPC Memory, Curiosity Engine, Progressive Hint Engine,
 * Teacher Decisions, and Emotion-Safe Learning.
 */

export * from './guided-discovery';
export * from './learning-moments';
export * from './conversation-flow';
export * from './confidence-adaptation';
export * from './story-engine';
export * from './npc-memory';
export * from './curiosity-engine';
export * from './hint-engine';
export * from './teacher-decisions';
export * from './emotion-safe-learning';
export * from './ai-reflection';
export * from './long-term-growth';

import {
  initializeDiscoveryState,
  evaluateDiscoveryAttempt,
  DiscoveryState,
} from './guided-discovery';
import { reframeErrorAsDiscovery, ErrorReframing } from './learning-moments';
import { createInitialFlowState, processDialogueTurn, ConversationFlowState } from './conversation-flow';
import { calculateTeacherAdaptation, TeacherAdaptationSettings } from './confidence-adaptation';
import { initializeStoryProgress, getNextStoryEpisode, StoryProgress } from './story-engine';
import { createInitialNPCRelationship, addNPCMemory, NPCRelationshipState } from './npc-memory';
import { evaluateCuriosityTrigger, CuriosityNugget } from './curiosity-engine';
import { generateProgressiveHintSequence, HintTier } from './hint-engine';
import { evaluateTeacherDecision, InterventionDecision } from './teacher-decisions';
import { generateGrowthMindsetFeedback, assessEmotionalSafety } from './emotion-safe-learning';

export const HumanTeachingEngine = {
  initializeDiscoveryState,
  evaluateDiscoveryAttempt,
  reframeErrorAsDiscovery,
  createInitialFlowState,
  processDialogueTurn,
  calculateTeacherAdaptation,
  initializeStoryProgress,
  getNextStoryEpisode,
  createInitialNPCRelationship,
  addNPCMemory,
  evaluateCuriosityTrigger,
  generateProgressiveHintSequence,
  evaluateTeacherDecision,
  generateGrowthMindsetFeedback,
  assessEmotionalSafety,
};
