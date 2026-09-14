import { CEFRLevel, StudentModel } from './brain';

export interface ImmersionModeState {
  isFullImmersionActive: boolean;
  targetLanguage: string;
  nativeLanguage: string;
  cefrLevel: CEFRLevel;
  targetUiLabels: Record<string, string>;
  nativeUiLabels: Record<string, string>;
}

export interface FlowStateStatus {
  currentState: 'flow' | 'frustration' | 'boredom';
  skillLevelRatio: number; // 0.0 - 2.0 (1.0 is optimal balance)
  recommendedAdjustment: 'increase_challenge' | 'maintain' | 'reduce_challenge' | 'add_scaffolding';
  rationale: string;
}

export interface AdultAchievement {
  id: string;
  title: string;
  description: string;
  category: 'consistency' | 'pronunciation' | 'confidence' | 'fluency' | 'vocabulary' | 'goals';
  unlockedAt?: string;
  isUnlocked: boolean;
  metricCriteria: string;
  professionalBadgeTitle: string;
}

export interface MicroBreakRecommendation {
  shouldTakeBreak: boolean;
  sessionDurationMinutes: number;
  fatigueScore: number; // 0 - 100
  suggestedAction: 'continue' | 'micro_break_60s' | 'wrap_up_session' | 'reduce_intensity';
  message: string;
}

export interface ContextualEncouragement {
  message: string;
  tone: 'professional_warm' | 'analytical_praise' | 'reassuring_coach';
  focusArea: string;
  confidenceDelta: number;
}

export interface ExperienceNotification {
  id: string;
  title: string;
  body: string;
  category: 'streak_reminder' | 'review_due' | 'milestone_unlocked' | 'coach_tip';
  timestamp: string;
  actionUrl?: string;
  isRead: boolean;
}

export interface SessionSummary {
  sessionId: string;
  sessionDurationMinutes: number;
  totalXpEarned: number;
  newVocabularyMastered: string[];
  keyErrorsObserved: string[];
  startingConfidence: number;
  endingConfidence: number;
  flowStateRatio: number;
  coachRecommendation: string;
  nextSessionObjective: string;
  completedAt: string;
}
