import { CEFRLevel } from './brain';

export type ProficiencyFramework =
  | 'CEFR'
  | 'JLPT'
  | 'HSK'
  | 'TOPIK'
  | 'Goethe'
  | 'DELE'
  | 'DELF'
  | 'CELPE_Bras';

export interface FrameworkLevelMapping {
  framework: ProficiencyFramework;
  levelCode: string; // e.g. 'B1', 'N3', 'HSK3', 'TOPIK3'
  equivalentCefr: CEFRLevel;
  title: string;
  description: string;
}

export interface SkillBalanceDistribution {
  conversationWeight: number; // 0 - 100
  grammarWeight: number;
  vocabularyWeight: number;
  pronunciationWeight: number;
  listeningWeight: number;
  readingWeight: number;
  writingWeight: number;
  timeAllocationMinutes: {
    conversation: number;
    grammar: number;
    vocabulary: number;
    pronunciation: number;
    listening: number;
    reading: number;
    writing: number;
    review: number;
  };
}

export interface PedagogicalDecision {
  whatToTeach: string;
  pedagogicalRationale: string;
  targetSkills: string[];
  recommendedDurationMinutes: number;
  difficultyAction: 'increase' | 'maintain' | 'lower';
  focusType: 'conversation' | 'grammar' | 'vocabulary' | 'pronunciation' | 'balanced' | 'review_decay';
  frameworkLevel: FrameworkLevelMapping;
  skillBalance: SkillBalanceDistribution;
  reviewItemsCount: number;
}

export interface PedagogicalModulePlan {
  id: string;
  moduleType: 'conversation' | 'grammar' | 'vocabulary' | 'pronunciation' | 'listening' | 'reading' | 'writing' | 'review';
  title: string;
  targetLanguage: string;
  nativeLanguage: string;
  durationMinutes: number;
  pedagogicalGoal: string;
  instructions: string;
  exercises?: {
    prompt: string;
    targetResponse?: string;
    hints?: string[];
  }[];
}

export interface FullPedagogicalLessonPlan {
  planId: string;
  studentId: string;
  targetLanguage: string;
  nativeLanguage: string;
  proficiencyFramework: ProficiencyFramework;
  frameworkLevel: FrameworkLevelMapping;
  decision: PedagogicalDecision;
  modules: PedagogicalModulePlan[];
  totalDurationMinutes: number;
  immersionRatio: {
    targetPercent: number;
    nativePercent: number;
  };
  createdTimestamp: string;
}
