import { 
  SmartLessonIntroduction, 
  SmartLessonEnding, 
  PedagogicalDecision, 
  IntelligentHomework 
} from '../src/domain/lesson/types';

export type { 
  SmartLessonIntroduction, 
  SmartLessonEnding, 
  PedagogicalDecision, 
  IntelligentHomework 
};

export type LessonDifficulty = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'beginner' | 'intermediate' | 'advanced' | string;
export type LessonType = 'grammar' | 'vocabulary' | 'conversation' | 'pronunciation' | 'culture' | 'reading' | 'listening' | string;

export interface ExerciseOption {
  id: string;
  text: string;
}

export interface LessonExercise {
  id: string;
  type: 'multiple_choice' | 'fill_in' | 'translation' | 'speaking' | string;
  prompt: string;
  options?: ExerciseOption[];
  correctAnswer?: string;
  explanation?: string;
}

export interface VocabularyWord {
  word: string;
  translation: string;
  phonetic?: string;
  example?: string;
  exampleTranslation?: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  translation?: string;
}

export interface ExplainBetterContent {
  concept: string;
  simpleExplanation: string;
  analogy: string;
  nativeLanguageBridge: string;
}

export interface LessonContent {
  vocabulary?: VocabularyWord[];
  grammarNotes?: string[];
  dialogue?: DialogueLine[];
  exercises?: LessonExercise[];
  explainBetter?: ExplainBetterContent;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  targetLanguage: string;
  nativeLanguage: string;
  difficulty: LessonDifficulty;
  type: LessonType;
  estimatedMinutes: number;
  content?: LessonContent;
  smartIntroduction?: SmartLessonIntroduction;
  smartEnding?: SmartLessonEnding;
  pedagogicalDecision?: PedagogicalDecision;
  intelligentHomework?: IntelligentHomework;
  completed?: boolean;
  score?: number;
  createdAt?: string;
}
