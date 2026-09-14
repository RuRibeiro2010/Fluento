/**
 * Student Digital Twin - Data Model & Types (Sprint 4)
 * Comprehensive, probabilistic internal representation of the student's
 * linguistic knowledge, cognitive profile, emotional mindset, evolving preferences,
 * habits, personal context, memory graph, prediction capabilities, and teacher adaptation parameters.
 */

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface SkillLinguisticBreakdown {
  speaking: number; // 0-100
  listening: number;
  reading: number;
  writing: number;
  grammar: number;
  vocabulary: number;
  pronunciation: number;
  fluency: number;
  confidence: number;
}

export interface LinguisticProfile {
  overallCEFR: CEFRLevel;
  skillCEFR: Record<keyof SkillLinguisticBreakdown, CEFRLevel>;
  skillScores: SkillLinguisticBreakdown;
  activeVocabularyCount: number;
  passiveVocabularyCount: number;
  masteredGrammarConceptsCount: number;
  strugglingGrammarConcepts: string[];
  phoneticFlaws: string[];
}

export interface CognitiveProfile {
  learningSpeed: 'slow' | 'steady' | 'fast' | 'accelerated';
  forgettingRate: 'low' | 'moderate' | 'rapid';
  concentrationSpanMinutes: number;
  idealCognitiveLoad: 'light' | 'balanced' | 'intense';
  idealSessionDurationMinutes: number;
  idealPacing: 'micro' | 'standard' | 'deep';
  averageResponseTimeSeconds: number;
}

export interface EmotionalProfile {
  confidenceScore: number; // 0-100
  anxietyScore: number; // 0-100 (never judged, used solely to adapt)
  motivationScore: number; // 0-100
  persistenceScore: number; // 0-100
  frustrationIndex: number; // 0-100
}

export interface EvolvingPreferences {
  examplesWeight: number; // 0.0 to 1.0
  analogiesWeight: number;
  visualsWeight: number;
  guidedDiscoveryWeight: number;
  repetitionWeight: number;
  conversationWeight: number;
  challengesWeight: number;
  lastUpdatedIso: string;
}

export interface LearningHabits {
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  sessionLengthPreference: 'short' | 'medium' | 'long';
  consecutiveDaysActive: number;
  spacedReviewAdherenceScore: number; // 0-100
  frequentStudyDays: string[];
}

export interface PersonalContext {
  profession: string;
  hobbies: string[];
  goals: string[];
  upcomingEvents: string[]; // e.g. "Trip to Madrid in 2 months", "Job Interview"
  specificInterests: string[];
  ageGroup?: string;
  nativeLanguage: string;
}

export interface LearningDNATendencies {
  primaryChannel: 'speaking_first' | 'listening_first' | 'reading_first' | 'grammar_structured';
  grammarReviewNeed: 'high' | 'moderate' | 'low';
  vocabularyRetentionEase: 'easy' | 'moderate' | 'challenging';
  realWorldExampleAffinity: 'high' | 'moderate' | 'low';
  tendencyDescriptions: string[]; // Strictly internal personal trends
}

export interface ConfidenceRecoveryState {
  isInRecoveryMode: boolean;
  consecutiveDifficultSessions: number;
  recoverySessionsRemaining: number;
  recommendedDifficultyAdjustment: number; // e.g. -0.25 difficulty offset
  encouragementBoostLevel: 'standard' | 'high' | 'maximum';
  quickWinsFocusArea: string;
  lastTriggerReason?: string;
}

export interface MemoryGraphNode {
  id: string;
  label: string;
  category: 'grammar_rule' | 'vocabulary' | 'pronunciation_sound' | 'communicative_function' | 'competency' | 'goal';
  masteryScore: number; // 0-100
  forgettingRiskPercent: number; // 0-100
  lastPracticedIso: string;
}

export interface MemoryGraphEdge {
  sourceId: string;
  targetId: string;
  relationship: 'prerequisite_of' | 'reinforces' | 'part_of_goal' | 'common_error_pair';
  strengthWeight: number; // 0.1 to 1.0
}

export interface MemoryGraphData {
  nodes: MemoryGraphNode[];
  edges: MemoryGraphEdge[];
}

export interface TwinPredictionResult {
  predictedForgettingItems: { nodeId: string; label: string; daysRemaining: number }[];
  readyForAdvancementItems: string[];
  urgentReviewItems: string[];
  potentialBlockers: string[];
  recommendedNextChallengeTimeMinutes: number;
}

export interface TeacherAdaptationParams {
  tone: 'encouraging' | 'analytical' | 'empathetic' | 'energetic' | 'demanding';
  speechSpeedRatio: number; // 0.8 to 1.15
  exampleCategory: 'corporate' | 'conversational' | 'cultural' | 'analogy_driven';
  correctionDensity: 'minimal' | 'selective' | 'thorough';
  pauseDurationSeconds: number;
  reviewPromptFrequency: 'high' | 'balanced' | 'low';
  challengeScale: number; // 0.1 to 1.0
}

export interface TwinExplainabilityEntry {
  id: string;
  timestampIso: string;
  triggerEvent: string;
  observation: string;
  systemAction: string;
  impactAssessment: string;
}

export interface StudentDigitalTwinState {
  userId: string;
  version: string;
  lastUpdatedIso: string;

  linguistic: LinguisticProfile;
  cognitive: CognitiveProfile;
  emotional: EmotionalProfile;
  preferences: EvolvingPreferences;
  habits: LearningHabits;
  context: PersonalContext;
  learningDna: LearningDNATendencies;
  recoveryState: ConfidenceRecoveryState;
  memoryGraph: MemoryGraphData;
  adaptationParams: TeacherAdaptationParams;
  explainabilityLog: TwinExplainabilityEntry[];
}
