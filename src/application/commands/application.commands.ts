export interface StartLessonCommand {
  readonly lessonId: string;
  readonly studentId: string;
}

export interface FinishLessonCommand {
  readonly lessonId: string;
  readonly studentId: string;
  readonly finalScore: number;
}

export interface UpdateStudentCommand {
  readonly studentId: string;
  readonly currentFocus?: string;
  readonly dailyGoalMinutes?: number;
  readonly correctionStrictness?: 'gentle' | 'balanced' | 'strict';
}

export interface StartSessionCommand {
  readonly lessonId: string;
  readonly studentId: string;
}

export interface FinishSessionCommand {
  readonly sessionId: string;
}

export interface UpgradeSubscriptionCommand {
  readonly studentId: string;
  readonly targetPlanTier: 'free' | 'pro' | 'executive';
}

export interface ReviewWordCommand {
  readonly studentId: string;
  readonly wordId: string;
  readonly qualityScore: number; // SM-2 score 0 to 5
}

export interface CreateStudyPlanCommand {
  readonly studentId: string;
  readonly primaryObjective: string;
}

export interface PlacementAssessmentCommand {
  readonly studentId: string;
  readonly assessmentAnswers: Array<{ questionId: string; answerText: string }>;
}

export interface TeacherResponseCommand {
  readonly sessionId: string;
  readonly userUtteranceText: string;
}
