import { VocabularyState, CommonErrorItem, TrackedWord, PeriodStatistics } from './profile';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LessonSessionHistoryLog {
  sessionId: string;
  theme: string;
  level: CEFRLevel;
  durationMinutes: number;
  overallScore: number;
  wordsLearned: TrackedWord[];
  forgottenWords: TrackedWord[];
  grammarUsed: string[];
  errors: CommonErrorItem[];
  pronunciationScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  expressionsLearned: string[];
  aiFeedback: string;
  averageResponseTimeSeconds: number;
  confidenceScore: number; // 0-100
  motivationScore: number; // 0-100
  timestamp: string;
}

export interface StudentModel {
  userId: string;
  currentCefr: CEFRLevel;
  nativeLanguage: string;
  targetLanguage: string;

  // Independent Skill Competencies (%)
  grammarMasteryPercent: number;
  vocabularyMasteryPercent: number;
  listeningMasteryPercent: number;
  speakingMasteryPercent: number;
  readingMasteryPercent: number;
  writingMasteryPercent: number;

  // Longitudinal Mindset Metrics
  confidenceScore: number; // 0-100
  learningSpeed: 'methodical' | 'steady' | 'accelerated';
  motivationScore: number; // 0-100
  consistencyScore: number; // 0-100
  burnoutIndex: number; // 0-100

  // Preferences & Context
  preferredTopics: string[];
  learningStyle: string;
  teacherPersonality: string;
  preferredSessionLengthMinutes: number;
  currentFocusArea: string;
  weakTopics: string[];
  strongTopics: string[];

  // Deep Personalization
  objectives: string[];
  hobbies: string[];
  interests: string[];
  profession: string;
  age?: number;
  reasonsToLearn: string[];
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  humorStyle: string;

  // Vocabulary Inventory
  vocabularyInventory: TrackedWord[];

  // Common Errors Inventory
  commonErrorsList: CommonErrorItem[];

  lastActivityTimestamp: string;
}

export interface WeaknessAnalysis {
  verbTenseStruggles: string[];
  difficultVocabulary: TrackedWord[];
  phoneticSoundFlaws: string[];
  problematicGrammarRules: string[];
  forgottenWords: TrackedWord[];
  repeatedErrors: CommonErrorItem[];
  overallWeaknessScore: number; // 0-100 (higher = needs more focus)
}

export interface ReviewItem {
  id: string;
  contentType: 'word' | 'grammar' | 'expression' | 'scenario';
  title: string;
  translationOrExplanation: string;
  intervalDays: number;
  easeFactor: number; // SM-2 parameter (default 2.5)
  repetitionsCount: number;
  nextDueDate: string;
  reasonToReview: string;
  forgettingProbabilityPercent: number;
}

export interface BrainRecommendation {
  id: string;
  title: string;
  category: 'review' | 'practice' | 'milestone' | 'mindset';
  urgency: 'high' | 'medium' | 'low';
  explanation: string;
  targetActivity: 'lesson' | 'scenario' | 'review_quiz' | 'listening_drill' | 'coaching_chat';
  estimatedMinutes: number;
  createdAt: string;
}

export interface AdaptationConfig {
  difficultyMultiplier: number; // e.g. 0.8 (gentle) to 1.2 (challenging)
  speechRate: number; // 0.8x to 1.1x
  exerciseCount: number;
  exerciseTypes: ('multiple_choice' | 'fill_in_blank' | 'open_speech' | 'roleplay' | 'audio_matching')[];
  explanationDepth: 'concise' | 'balanced' | 'socratic_detailed';
  exampleContextStyle: 'business' | 'daily_casual' | 'travel' | 'hobbies_tailored';
  recommendedTeacherPersonaId: string;
  hintLevel: 'generous' | 'moderate' | 'minimal';
  reviewRatio: number; // e.g. 0.3 = 30% review, 70% new material
}

export interface FutureIntegrationsState {
  realtimeVoiceEnabled: boolean;
  geminiLiveSupported: boolean;
  openAiRealtimeSupported: boolean;
  videoCallCapable: boolean;
  multiDeviceSyncStatus: 'synced' | 'pending' | 'offline';
  offlineModeAvailable: boolean;
}
