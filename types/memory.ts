// ==========================================
// AI Memory Engine - Modular Architecture Types
// ==========================================

export interface ProfileMemory {
  userId: string;
  nativeLanguage: string;
  targetLanguages: string[];
  uiLanguage: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  createdDate: string;
  updatedDate: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  contextSentence?: string;
  masteryScore: number; // 0 to 100
  timesSeen: number;
  timesCorrect: number;
  lastPracticedDate: string;
  nextReviewDate: string; // Spaced repetition queue
  isWeakSpot: boolean;
  categoryTag?: string;
}

export interface VocabularyMemory {
  userId: string;
  targetLanguage: string;
  items: VocabularyItem[];
  totalMasteredWords: number;
  totalWeakWords: number;
}

export interface GrammarRuleItem {
  id: string;
  conceptName: string;
  category: 'tenses' | 'pronouns' | 'prepositions' | 'syntax' | 'articles' | 'moods';
  errorRate: number; // 0.0 to 1.0
  timesEncountered: number;
  lastReviewedDate: string;
  masteryStatus: 'learning' | 'review_needed' | 'mastered';
  notes?: string;
}

export interface GrammarMemory {
  userId: string;
  targetLanguage: string;
  rules: GrammarRuleItem[];
  overallGrammarScore: number;
}

export interface ConversationSessionLog {
  id: string;
  characterName: string;
  mode: 'free_conversation' | 'scenario';
  date: string;
  durationMinutes: number;
  totalUserTurns: number;
  fluencyScore: number;
  pronunciationScore: number;
  topicsDiscussed: string[];
  keyFeedbackSummary: string;
}

export interface ConversationMemory {
  userId: string;
  targetLanguage: string;
  history: ConversationSessionLog[];
  favoriteCharacters: string[];
  frequentTopics: string[];
  totalConversationTimeMinutes: number;
}

export interface PerformanceSnapshot {
  date: string;
  fluencyScore: number;
  grammarScore: number;
  vocabularyScore: number;
  pronunciationScore: number;
  listeningScore: number;
  speakingScore: number;
  overallConfidence: number;
}

export interface PerformanceMemory {
  userId: string;
  targetLanguage: string;
  history: PerformanceSnapshot[];
  currentConfidenceScore: number;
  learningVelocity: 'accelerating' | 'steady' | 'needs_reinforcement';
  averageSessionDurationMinutes: number;
}

export interface MotivationMemory {
  userId: string;
  primaryMotivation: string;
  dailyCommitmentMinutes: number;
  currentStreakDays: number;
  longestStreakDays: number;
  coachPersonalityPreference: string;
  lastActiveDate: string;
  milestonesUnlocked: string[];
}

export interface LearningDNA {
  userId: string;
  primaryLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing';
  preferredCorrectionMode: 'relaxed' | 'balanced' | 'strict';
  peakStudyTimeOfDay: 'morning' | 'afternoon' | 'evening';
  errorRecoverySpeed: 'fast' | 'moderate' | 'methodical';
  preferredPace: 'micro' | 'standard' | 'intensive';
  cognitiveStrengths: string[];
}

export interface UserFullMemory {
  profile: ProfileMemory;
  vocabulary: VocabularyMemory;
  grammar: GrammarMemory;
  conversation: ConversationMemory;
  performance: PerformanceMemory;
  motivation: MotivationMemory;
  learningDna: LearningDNA;
}

export interface MemoryContextSummary {
  userId: string;
  targetLanguage: string;
  coachBrief: string;
  teacherBrief: string;
  urgentReviewWords: string[];
  urgentGrammarConcepts: string[];
  recommendedFocusArea: string;
  confidenceScore: number;
  streakDays: number;
}
