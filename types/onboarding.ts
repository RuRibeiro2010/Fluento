export interface QuizOption {
  label: string;
  value: string;
  description?: string;
  icon?: string;
  badge?: string;
}

export type CategoryType =
  | 'ui_language'
  | 'native_language'
  | 'target_language'
  | 'goal'
  | 'time'
  | 'level'
  | 'learning_style'
  | 'coach_personality'
  | 'interests';

export interface QuizQuestion {
  id: string;
  category: CategoryType;
  question: Record<string, string>; // Localized strings keyed by UI language code (en, pt, es, fr, de)
  subtitle?: Record<string, string>;
  allowMultiple?: boolean;
  options: QuizOption[];
}

export interface PlacementTestQuestion {
  id: number;
  levelTarget: 'A1' | 'A2' | 'B1' | 'B2';
  questionText: string;
  context?: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

export interface PlacementTestResult {
  assignedLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  score: number;
  totalQuestions: number;
  strengths: string[];
  recommendedFocus: string;
}

export interface OnboardingData {
  uiLanguage: string;
  nativeLanguage: string;
  targetLanguages: string[];
  primaryGoal: string;
  dailyCommitmentMinutes: number;
  currentLevel: string;
  learningStyle: string;
  coachStyle: string;
  interests: string[];
  placementResult?: PlacementTestResult;
  answers: Record<string, any>;
}
