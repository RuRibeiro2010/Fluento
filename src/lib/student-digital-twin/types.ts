/**
 * FLUENTO STUDENT DIGITAL TWIN - TYPES & INTERFACES
 * 
 * Defines the comprehensive, strongly-typed data model for the Student Digital Twin,
 * representing the single source of truth for student identity, language competence,
 * emotional parameters, behavioral patterns, goals, memory, and recommendations.
 */

import { CEFRLevel } from '@/types/brain';
import { StudentLearningState, MemoryThreadsContext, ReviewItem } from '@/src/lib/learning-engine';

export interface IdentityProfile {
  studentId: string;
  name: string;
  email: string;
  nativeLanguage: string; // e.g., 'pt-PT'
  targetLanguage: string; // e.g., 'en-US'
  timezone: string;
  createdAtIso: string;
  lastActiveIso: string;
  avatarUrl?: string;
}

export interface LearningProfile {
  learningStyle: 'auditory' | 'visual' | 'interactive' | 'reflective';
  preferredPace: 'slow' | 'moderate' | 'accelerated';
  sessionFrequency: 'daily' | 'thrice_weekly' | 'weekly';
  focusAreas: ('speaking_fluency' | 'pronunciation' | 'business_vocabulary' | 'grammar_precision')[];
  cognitiveLoadTolerance: 'low' | 'medium' | 'high';
}

export interface LanguageProfile {
  currentCefr: CEFRLevel;
  targetCefr: CEFRLevel;
  estimatedVocabularySize: number; // e.g. 1500
  grammarMasteryScore: number; // 0 - 100
  pronunciationScore: number; // 0 - 100
  listeningComprehensionScore: number; // 0 - 100
  fluencyScore: number; // 0 - 100
  knownL1InterferencePatterns: string[]; // e.g. ['false_friends_pt', 'missing_do_does_auxiliary']
}

export interface EmotionalProfile {
  baselineAnxietyLevel: number; // 0 - 100
  affectiveFilterSensitivity: 'low' | 'moderate' | 'high' | 'extreme';
  confidenceScores: {
    speaking: number;
    listening: number;
    vocabulary: number;
    grammar: number;
    pronunciation: number;
    overall: number;
  };
  knownStressTriggers: string[]; // e.g. ['public_speaking', 'time_pressure', 'rapid_questions']
  primaryMotivationDrivers: string[]; // e.g. ['career_advancement', 'travel_confidence', 'social_connection']
}

export interface BehaviourProfile {
  avgTalkTimeRatio: number; // 0.0 - 1.0 (e.g. 0.65 = 65% student talk time)
  turnCadenceSeconds: number; // average response delay
  pauseFrequency: 'rare' | 'moderate' | 'frequent';
  helpSeekingTendency: 'independent' | 'balanced' | 'frequent_scaffold_needed';
  dropoffRiskScore: number; // 0 - 100
  completedSessionsCount: number;
  totalSpeakingTimeSeconds: number;
}

export interface GoalProfile {
  targetCefrGoal: CEFRLevel;
  deadlineIso?: string;
  primaryMotivation: string; // e.g., 'Job Interview at Tech Corp'
  professionalDomain?: string; // e.g., 'Software Engineering'
  weeklyMinutesGoal: number; // e.g., 60
  completedMinutesThisWeek: number;
}

export interface MemoryProfile {
  ephemeralSessionNotes: string[];
  permanentSuccessMemories: string[];
  permanentTraumaOrBlocks: string[];
  reviewItems: ReviewItem[];
  activeThreadsCount: number;
}

export interface RecommendationProfile {
  recommendedSessionDurationMinutes: number; // e.g., 10 or 15
  suggestedScaffoldingLevel: 'high' | 'moderate' | 'minimal' | 'none';
  nextFocusSkills: string[];
  optimalPracticeTimeOfDay: 'morning' | 'afternoon' | 'evening';
}

export interface StudentDigitalTwinState {
  identity: IdentityProfile;
  learning: LearningProfile;
  language: LanguageProfile;
  emotional: EmotionalProfile;
  behaviour: BehaviourProfile;
  goal: GoalProfile;
  memory: MemoryProfile;
  recommendation: RecommendationProfile;
  revision: number;
  lastUpdatedIso: string;
}

export type PartialStudentDigitalTwinState = {
  identity?: Partial<IdentityProfile>;
  learning?: Partial<LearningProfile>;
  language?: Partial<LanguageProfile>;
  emotional?: Partial<EmotionalProfile> & { confidenceScores?: Partial<EmotionalProfile['confidenceScores']> };
  behaviour?: Partial<BehaviourProfile>;
  goal?: Partial<GoalProfile>;
  memory?: Partial<MemoryProfile>;
  recommendation?: Partial<RecommendationProfile>;
};

export interface TwinMutationEvent {
  eventId: string;
  studentId: string;
  timestampIso: string;
  mutatedFields: string[];
  previousRevision: number;
  newRevision: number;
}

export interface ProfileValidationResult {
  isValid: boolean;
  issues: string[];
}
