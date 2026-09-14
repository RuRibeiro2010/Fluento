import { CEFRLevel } from './brain';

export type LessonBlockType =
  | 'introduction'
  | 'conversation'
  | 'grammar'
  | 'vocabulary'
  | 'listening'
  | 'speaking'
  | 'mini_challenge'
  | 'quiz'
  | 'summary';

export interface LessonBlock {
  id: string;
  type: LessonBlockType;
  title: string;
  durationMinutes: number;
  contentPromptOrText: string;
  targetVocabulary: string[];
  targetGrammar: string[];
  characterRole?: string;
  interactiveExercises?: {
    question: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
  }[];
}

export interface ModularLesson {
  id: string;
  title: string;
  theme: string;
  targetLanguage: string;
  cefrLevel: CEFRLevel;
  blocks: LessonBlock[];
  totalDurationMinutes: number;
  adaptedForUserId: string;
  sourceLessonId?: string;
  generatedAt: string;
  aiProviderUsed: string;
  contextCustomizations: {
    professionContext?: string;
    hobbyContext?: string;
    adaptedExamplesCount: number;
  };
}

export interface LessonRecord {
  id: string;
  originalUserId: string;
  theme: string;
  objective: string;
  cefrLevel: CEFRLevel;
  targetLanguage: string;
  workedSkills: string[];
  vocabulary: string[];
  grammar: string[];
  scenarioTitle?: string;
  averageTimeMinutes: number;
  
  // Quality Score Component Metrics (0 to 100)
  completionRate: number;
  retentionScore: number;
  improvementScore: number;
  userSatisfaction: number;
  coachConfidence: number;
  
  qualityScore: number; // Calculated total (0 to 100)
  commonErrorsObserved: string[];
  feedbackNotes: string;
  
  timesReused: number;
  lastUsedDate: string;
  isPremiumLibraryMember: boolean; // true if qualityScore >= 90
}

export interface StudentSimilarityProfile {
  userId: string;
  targetLanguage: string;
  cefrLevel: CEFRLevel;
  objectives: string[];
  interests: string[];
  weaknesses: string[];
  learningStyle: string;
  timeAvailableMinutes: number;
}

export interface AIProviderAdapter {
  providerName: 'gemini' | 'openai' | 'claude' | 'deepseek' | 'local';
  modelName: string;
  generateText(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<string>;
}
