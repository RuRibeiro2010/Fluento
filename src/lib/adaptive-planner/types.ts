/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - TYPES & INTERFACES
 * 
 * Defines the strongly-typed data structures for automatic, personalized session planning.
 * Maps student state, pedagogical memory, and analytics into an optimal, actionable
 * AdaptiveLearningPlan for each session.
 * 
 * MANDATES:
 * - NO raw user text generation for prompt templates.
 * - NO direct LLM/AI model coupling.
 * - NO direct UI coupling.
 */

import { CEFRLevel } from '@/types/brain';
import { ReviewMemoryItem } from '@/src/lib/learning-threads';

export type ScaffoldingLevel = 'high' | 'moderate' | 'minimal' | 'none';
export type DifficultySetting = 'comfortable' | 'optimal_challenge' | 'stretch';
export type LessonMode = 'spontaneous_roleplay' | 'vocabulary_reinforcement' | 'grammar_clinic' | 'fluency_sprint' | 'confidence_builder';

export interface ConversationScenarioConfig {
  scenarioId: string;
  title: string;
  roleplayRole: string;
  contextDescription: string;
  professionalDomain?: string;
  suggestedCefr: CEFRLevel;
}

export interface TutorStyleConfig {
  pace: 'slow' | 'moderate' | 'brisk';
  tone: 'supportive' | 'direct' | 'socratic' | 'encouraging';
  correctionStrategy: 'immediate' | 'delayed_summary' | 'gentle_implicit';
}

export interface MotivationStrategyConfig {
  driver: string;
  focusMessage: string;
  praiseTarget?: string;
}

export interface AdaptiveLearningPlan {
  planId: string;
  studentId: string;
  generatedAtIso: string;
  recommendedDurationMinutes: number; // e.g. 10, 15, 20
  targetCefr: CEFRLevel;
  primaryObjective: string;
  secondaryFocusAreas: string[];
  lessonMode: LessonMode;
  scaffoldingLevel: ScaffoldingLevel;
  difficultySetting: DifficultySetting;
  reviewItemsToCover: ReviewMemoryItem[];
  conversationScenario: ConversationScenarioConfig;
  tutorStyle: TutorStyleConfig;
  motivationStrategy: MotivationStrategyConfig;
  recommendations: string[];
  revision: number;
}

export interface PlannerTelemetryEvent {
  eventId: string;
  studentId: string;
  timestampIso: string;
  planId: string;
  recommendedDurationMinutes: number;
  lessonMode: LessonMode;
  difficultySetting: DifficultySetting;
}

export interface PlanValidationResult {
  isValid: boolean;
  issues: string[];
}
