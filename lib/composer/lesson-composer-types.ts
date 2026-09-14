/**
 * Intelligent Lesson Composer - Types & Interfaces (Sprint 5)
 * Comprehensive data model for dynamic lesson composition, memory threads,
 * learning momentum, micro goals, internal reflection, quality scores, and Lesson DNA.
 */

export type LessonBlockType =
  | 'welcome'
  | 'smart_review'
  | 'conversation'
  | 'new_content'
  | 'practice'
  | 'listening'
  | 'roleplay'
  | 'pronunciation'
  | 'shadowing'
  | 'vocabulary'
  | 'mission'
  | 'reflection'
  | 'summary'
  | 'future_planning';

export interface DynamicLessonBlock {
  id: string;
  type: LessonBlockType;
  title: string;
  purpose: string;
  estimatedDurationMinutes: number;
  cognitiveLoad: 'low' | 'moderate' | 'high';
  targetSkill: string;
  interactivePrompt?: string;
  contentItems?: Array<{
    termOrConcept: string;
    context: string;
    exampleSentence?: string;
    translation?: string;
  }>;
  isCompleted?: boolean;
}

export type MemoryThreadContext =
  | 'conversation'
  | 'email'
  | 'hotel'
  | 'business'
  | 'interview'
  | 'podcast'
  | 'roleplay'
  | 'review';

export interface MemoryThreadNode {
  id: string;
  concept: string;
  currentDepthScore: number; // 0-100
  contextsConnected: MemoryThreadContext[];
  lastContextUsed: MemoryThreadContext;
  nextRecommendedContext: MemoryThreadContext;
  lastPracticedIso: string;
}

export interface LearningMomentumState {
  score: number; // 0-100
  emotionalZone: 'flow_state' | 'high_motivation' | 'steady_progress' | 'mentally_tired' | 'frustrated';
  recommendedPacing: 'micro' | 'standard' | 'deep_immersion';
  recommendedDurationMinutes: number;
  recommendedDifficultyOffset: number; // -0.3 to +0.3
  recommendedCorrectionDensity: 'minimal' | 'selective' | 'thorough';
  primaryActivityFocus: string;
}

export interface MicroGoal {
  id: string;
  primaryObjective: string;
  targetStructureOrTopic: string;
  successCriteria: string;
  isAchieved?: boolean;
}

export interface InternalLessonReflection {
  wasObjectiveAchieved: boolean;
  studentTalkTimeRatio: number; // 0-100 (percentage of time student produced target language)
  mostEffectiveBlockId: string;
  blockToModifyInFuture: string;
  frictionPoints: string[];
  keyTakeawayForNextSession: string;
}

export interface FuturePlanningOutput {
  nextLessonTopic: string;
  nextScheduledReviewItems: string[];
  nextRealWorldMission: string;
  nextSuggestedChallenge: string;
}

export interface LessonQualityScore {
  learningScore: number; // 0-100
  retentionScore: number; // 0-100
  confidenceScore: number; // 0-100
  motivationScore: number; // 0-100
  naturalnessScore: number; // 0-100
  studentTalkTimeScore: number; // 0-100
  objectiveMetScore: number; // 0-100
  flowStateIndex: number; // 0-100
  overallQualityScore: number; // 0-100 (Weighted internal composite)
  evaluationRationale: string;
}

export interface LessonDNA {
  studentId: string;
  speakingDensityWeight: number; // 0.0 to 1.0
  listeningDensityWeight: number;
  roleplayAffinityWeight: number;
  realExamplesAffinityWeight: number;
  challengeLevelPreference: number;
  humorLightnessWeight: number;
  pausePacingPreference: number;
  discoveredInsights: string[];
  lastUpdatedIso: string;
}

export interface LessonJustification {
  whyThisLessonExists: string;
  whyToday: string;
  whyBetterThanAlternatives: string;
  howItApproachesGoal: string;
  howItEndingBoostsMotivation: string;
}

export interface ComposedLesson {
  lessonId: string;
  studentId: string;
  timestampIso: string;
  microGoal: MicroGoal;
  momentum: LearningMomentumState;
  blocks: DynamicLessonBlock[];
  totalEstimatedMinutes: number;
  memoryThreads: MemoryThreadNode[];
  justification: LessonJustification;
  appliedLessonDna: LessonDNA;
  qualityScore?: LessonQualityScore;
  reflection?: InternalLessonReflection;
  futurePlan?: FuturePlanningOutput;
}

export interface ComposerInput {
  userId: string;
  profession?: string;
  userInterest?: string;
  targetCEFR?: string;
  currentCEFR?: string;
  availableMinutes: number;
  fatigueScore: number; // 0-10
  confidenceRating: number; // 1-10
  recentAccuracyPercentage: number; // 0-100
  streakDays: number;
  unreviewedItemsCount: number;
  completedLessonIds?: string[];
  nativeLanguage?: string;
  customTopicFocus?: string;
}
