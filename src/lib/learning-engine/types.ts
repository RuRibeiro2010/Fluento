/**
 * FLUENTO LEARNING ENGINE - TYPES & INTERFACES
 * 
 * Comprehensive type definitions for Fluento's core Learning Engine,
 * aligning with FLUENTO_INTELLIGENCE_ARCHITECTURE.md, FLUENTO_PLAYBOOK.md,
 * and LEARNING_PRINCIPLES.md.
 */

import { CEFRLevel } from '@/types/brain';
import { ProficiencyFramework, FrameworkLevelMapping } from '@/types/pedagogy';

/**
 * Student's affective and cognitive state for a session.
 */
export interface StudentLearningState {
  studentId: string;
  currentCefr: CEFRLevel;
  targetCefr: CEFRLevel;
  framework: ProficiencyFramework;
  frameworkLevel: FrameworkLevelMapping;
  energyLevel: number; // 0 - 10 (0 = exhausted, 10 = peak energy)
  motivationLevel: number; // 0 - 10
  speakingAnxietyLevel: number; // 0 - 100 (0 = completely calm, 100 = severe panic)
  confidenceScores: {
    speaking: number; // 0 - 100
    listening: number; // 0 - 100
    vocabulary: number; // 0 - 100
    grammar: number; // 0 - 100
    pronunciation: number; // 0 - 100
    overall: number; // 0 - 100
  };
  fatigueScore: number; // 0 - 100
  availableMinutes: number; // e.g. 5, 10, 15, 30, 45
  daysSinceLastSession: number;
  primaryGoal: string; // e.g. "Job Interview", "Travel", "Casual Fluency"
  preferredContext?: string; // e.g. "Software Engineering", "Medical", "Business"
}

/**
 * Memory threads snapshot passed to the decision pipeline.
 */
export interface MemoryThreadsContext {
  permanentSuccessMemories: string[]; // Key past victories/achievements
  permanentTraumaOrBlocks: string[]; // Trigger areas / high anxiety topics
  intermediateDecayingItemsCount: number; // Total items due for review
  intermediateReviewItems: ReviewItem[];
  ephemeralSessionNotes?: string[];
}

/**
 * Complete decision context supplied to the Decision Pipeline.
 */
export interface DecisionContext {
  studentState: StudentLearningState;
  memoryThreads: MemoryThreadsContext;
  sessionGoal?: string;
  userRequestedMode?: 'conversation' | 'grammar' | 'vocabulary' | 'pronunciation' | 'review' | 'auto';
}

/**
 * Teaching strategy selected by the strategy engine.
 */
export interface TeachingStrategy {
  id: string;
  name: string;
  description: string;
  scaffoldingLevel: 'high' | 'medium' | 'low' | 'minimal';
  recastingMode: 'involuntary_continuous' | 'selective_end_of_turn' | 'none_free_flow';
  immersionTargetPercent: number; // e.g. 80% target language, 20% native language
  targetStudentTalkTimeRatio: number; // Minimum % (e.g. 65%)
  waitTimeSeconds: number; // e.g. 3 to 5 seconds
  errorTolerance: 'high' | 'medium' | 'strict';
  tone: 'warm_supportive' | 'calm_professional' | 'energetic_encouraging' | 'gentle_recovery';
  forbiddenBehaviours: string[];
}

/**
 * Granular difficulty tuning parameters.
 */
export interface DifficultyParameters {
  currentCefr: CEFRLevel;
  difficultyDelta: 'increase' | 'maintain' | 'lower';
  lexicalDensity: number; // 0 - 100
  sentenceComplexity: number; // 0 - 100
  speechRateMultiplier: number; // 0.75 - 1.25
  scaffoldingPromptRatio: number; // 0 - 100
  allowNativeHints: boolean;
}

/**
 * Spaced repetition review item.
 */
export interface ReviewItem {
  id: string;
  conceptOrWord: string;
  category: 'vocabulary' | 'grammar_structure' | 'idiom' | 'phrasal_verb' | 'pronunciation_pattern';
  cefrLevel: CEFRLevel;
  stability: number; // SRS stability score (days)
  difficulty: number; // 0 - 10
  lastReviewedIso: string;
  nextReviewIso: string;
  decayScore: number; // 0 - 100 (100 = completely forgotten, needs urgent review)
  consecutiveSuccesses: number;
}

/**
 * Flow State and Cognitive Load metrics during or after a session.
 */
export interface FlowMetrics {
  cognitiveLoadScore: number; // 0 - 100 (Sweller's Cognitive Load)
  challengeSkillBalance: number; // 0 - 100 (100 = perfect equilibrium)
  flowStateIndex: number; // 0 - 100 (Csikszentmihalyi Flow)
  boredomRisk: boolean;
  overwhelmRisk: boolean;
  recommendedAdjustment: 'increase_challenge' | 'maintain' | 'lower_challenge' | 'take_break';
}

/**
 * Real Learning ROI evaluation.
 */
export interface LearningRoiMetrics {
  confidenceDelta: number; // -100 to +100 shift
  communicativeAutonomyScore: number; // 0 - 100
  retentionEfficiencyPercent: number; // 0 - 100%
  realWorldReadinessScore: number; // 0 - 100
  willingnessToCommunicate: number; // 0 - 100 (WTC)
  overallLearningRoi: number; // 0 - 100
  qualitativeSummary: string;
}

/**
 * High-level pedagogical decision resulting from the Decision Pipeline.
 */
export interface PedagogicalDecision {
  decisionId: string;
  timestampIso: string;
  primaryFocus: 'conversation' | 'grammar' | 'vocabulary' | 'pronunciation' | 'review' | 'recovery';
  whatToTeach: string;
  pedagogicalRationale: string;
  decisionPyramidPriorityApplied: string; // e.g. "1. Psychological Safety (High Anxiety Override)"
  strategy: TeachingStrategy;
  difficulty: DifficultyParameters;
  scheduledReviewItems: ReviewItem[];
  recommendedDurationMinutes: number;
  targetSkills: string[];
}

/**
 * Individual module within a lesson blueprint.
 */
export interface BlueprintModule {
  moduleId: string;
  title: string;
  moduleType: 'warmup_connection' | 'core_practice' | 'recasting_consolidation' | 'real_world_application' | 'cool_down';
  durationMinutes: number;
  objective: string;
  instructionsForTeacher: string;
  scaffoldingPrompts?: string[];
  targetExercises?: {
    prompt: string;
    expectedOutcome: string;
    hints?: string[];
  }[];
}

/**
 * Complete structured blueprint for a lesson.
 */
export interface LessonBlueprint {
  blueprintId: string;
  studentId: string;
  timestampIso: string;
  decision: PedagogicalDecision;
  totalDurationMinutes: number;
  modules: BlueprintModule[];
  immersionRatio: {
    targetPercent: number;
    nativePercent: number;
  };
  teacherRules: string[];
  successCriteria: string[];
}
