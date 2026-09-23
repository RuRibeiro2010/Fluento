export interface CoachMessageDTO {
  readonly id: string;
  readonly text: string;
  readonly teacherName: string;
  readonly teacherPersona: string;
  readonly type: 'greeting' | 'encouragement' | 'warning' | 'tip';
  readonly actionLabel?: string;
  readonly actionId?: string;
  readonly timestampIso: string;
}

export interface WeeklyReviewDTO {
  readonly weekId: string;
  readonly studentId: string;
  readonly startDateIso: string;
  readonly endDateIso: string;
  readonly overallAccuracy: number;
  readonly totalMinutes: number;
  readonly sessionsCount: number;
  readonly wordsLearned: number;
  readonly topStrength: string;
  readonly topWeakness: string;
  readonly recommendation: string;
  readonly coachFeedback: string;
}

export interface MonthlyEvolutionDataDTO {
  readonly userId: string;
  readonly firstLessonDate: string;
  readonly initialLevel: string;
  readonly currentLevel: string;
  readonly wordsLearnedCount: number;
  readonly grammarRulesMastered: number;
  readonly pronunciationScore: number;
  readonly fluencyScore: number;
  readonly totalTimeStudiedMinutes: number;
  readonly consecutiveStreakDays: number;
  readonly biggestAchievements: string[];
  readonly milestonesTimeline: Array<{
    readonly id: string;
    readonly date: string;
    readonly title: string;
    readonly category: string;
    readonly description: string;
    readonly badgeIcon?: string;
  }>;
}
