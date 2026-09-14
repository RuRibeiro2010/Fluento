export type CoachPersonality = 'encouraging' | 'strict' | 'casual' | 'socratic' | 'academic' | string;
export type HumorStyle = 'witty' | 'light' | 'sarcastic' | 'none' | string;
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing' | string;
export type DifficultyPreference = 'gentle' | 'balanced' | 'challenging' | string;

export type VocabularyState = 'recognizes' | 'understands' | 'uses_with_help' | 'uses_naturally';

export interface SkillMatrix {
  grammar: number;
  vocabulary: number;
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
  pronunciation: number;
  fluency?: number;
  confidence?: number;
}

export interface LearningProfileDiagnostic {
  strengths: string[];
  weaknesses: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing' | string;
  idealPace: 'relaxed' | 'moderate' | 'intensive' | string;
  reviewNeeds: string[];
  prioritySkills: string[];
  qualitativeSummary: string;
}

export interface DiagnosticInitialPlan {
  primaryObjective: string;
  firstKeyCompetencies: string[];
  estimatedEvolutionMonths: number;
  firstMission: {
    id: string;
    title: string;
    description: string;
    targetSkill: string;
  };
}

export interface LearningPreferences {
  topics?: string[];
  pace?: 'relaxed' | 'moderate' | 'intensive' | string;
  feedback_frequency?: 'immediate' | 'end_of_lesson' | 'daily_summary' | string;
  correction_style?: 'gentle' | 'strict' | string;
}

export interface LastAssessment {
  date: string;
  level: string;
  score: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
}

export interface CommonErrorItem {
  id: string;
  concept: string;
  category: 'grammar' | 'vocabulary' | 'pronunciation' | 'syntax' | 'style';
  frequency: number;
  lastOccurred: string;
  examples: string[];
}

export interface TrackedWord {
  id: string;
  word: string;
  translation: string;
  state: VocabularyState;
  errorCount: number;
  timesUsedCorrectly: number;
  lastUsedDate: string;
  confidenceScore: number;
  categoryTag?: string;
}

export interface PeriodStatistics {
  sessionsCompleted: number;
  totalMinutesPracticed: number;
  wordsLearnedCount: number;
  grammarRulesMasteredCount: number;
  averageAccuracyPercent: number;
}

export interface UserProfile {
  id: string;
  email?: string;
  native_language: string;
  target_languages: string[];
  learning_preferences: LearningPreferences;
  coach_personality: CoachPersonality;
  humor_style: HumorStyle;
  weekly_goal: number;
  minutes_per_day: number;
  confidence_score: number;
  skill_matrix: SkillMatrix;
  current_focus: string;
  learning_style: LearningStyle;
  motivation: string;
  difficulty_preference: DifficultyPreference;
  preferred_topics: string[];
  last_assessment?: LastAssessment;
  created_at?: string;
  updated_at?: string;

  // Longitudinal Memory & Advanced Mastery Tracking
  learning_history?: any[];
  grammar_mastery?: number;
  vocabulary_mastery?: number;
  speaking_mastery?: number;
  listening_mastery?: number;
  reading_mastery?: number;
  writing_mastery?: number;
  common_errors?: CommonErrorItem[];
  mastered_topics?: string[];
  weak_topics?: string[];
  learned_words?: TrackedWord[];
  forgotten_words?: TrackedWord[];
  average_response_time?: number;
  motivation_score?: number;
  burnout_score?: number;
  preferred_session_length?: number;
  best_learning_time?: 'morning' | 'afternoon' | 'evening' | 'night' | string;
  weekly_statistics?: PeriodStatistics;
  monthly_statistics?: PeriodStatistics;
  last_activity?: string;

  // Personalization Metadata
  hobbies?: string[];
  interests?: string[];
  profession?: string;
  age?: number;
  reasons_to_learn?: string[];
}

