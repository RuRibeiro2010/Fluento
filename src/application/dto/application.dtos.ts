export interface StudentDTO {
  readonly id: string;
  readonly email: string;
  readonly nativeLanguage: string;
  readonly targetLanguages: string[];
  readonly currentLevel: string;
  readonly currentFocus: string;
  readonly motivation: string;
  readonly active: boolean;
  readonly skillMatrix: {
    readonly speaking: number;
    readonly listening: number;
    readonly reading: number;
    readonly writing: number;
    readonly grammar: number;
    readonly vocabulary: number;
  };
  readonly preferences: {
    readonly dailyGoalMinutes: number;
    readonly preferredTeacherPersona: string;
    readonly correctionStrictness: string;
  };
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface TeacherDTO {
  readonly id: string;
  readonly name: string;
  readonly bio: string;
  readonly accentRegion: string;
  readonly personaStyle: string;
  readonly isAiPersona: boolean;
  readonly active: boolean;
  readonly specialities: string[];
}

export interface LessonDTO {
  readonly id: string;
  readonly title: string;
  readonly targetLevel: string;
  readonly status: string;
  readonly teacherId: string;
  readonly estimatedMinutes: number;
  readonly primaryCompetency: string;
  readonly objectives: string[];
}

export interface SessionDTO {
  readonly id: string;
  readonly lessonId: string;
  readonly studentId: string;
  readonly teacherId: string;
  readonly active: boolean;
  readonly startTime: string;
  readonly endTime?: string;
  readonly turnCount: number;
  readonly totalUtterances: number;
  readonly metrics: {
    readonly wordsSpokenCount: number;
    readonly averageFluencyScore: number;
    readonly grammarAccuracyPercent: number;
    readonly pronunciationScore: number;
  };
}

export interface DashboardDTO {
  readonly student: StudentDTO;
  readonly activePlan?: StudyPlanDTO;
  readonly analytics: AnalyticsDTO;
  readonly subscription: SubscriptionDTO;
  readonly dueVocabularyCount: number;
  readonly recommendedLessons: LessonDTO[];
}

export interface AnalyticsDTO {
  readonly studentId: string;
  readonly weeklySessions: number;
  readonly weeklyMinutes: number;
  readonly monthlySessions: number;
  readonly monthlyMinutes: number;
  readonly wordsLearnedCount: number;
  readonly grammarRulesMastered: number;
  readonly averageAccuracyPercent: number;
  readonly fluencyIndex: {
    readonly overallScore: number;
    readonly confidenceScore: number;
    readonly spontaneityScore: number;
  };
  readonly learningVelocity: 'alta' | 'moderada' | 'revisar_metas';
}

export interface StudyPlanDTO {
  readonly id: string;
  readonly studentId: string;
  readonly primaryObjective: string;
  readonly estimatedEvolutionMonths: number;
  readonly progressPercentage: number;
  readonly keyCompetencies: string[];
  readonly missions: Array<{
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly isCompleted: boolean;
    readonly competencyId: string;
  }>;
}

export interface PromptDTO {
  readonly contextId: string;
  readonly teacherName: string;
  readonly studentLevel: string;
  readonly fullSystemPrompt: string;
  readonly modelAlias: string;
  readonly temperature: number;
}

export interface SubscriptionDTO {
  readonly studentId: string;
  readonly planTier: string;
  readonly monthlyPriceEur: number;
  readonly status: string;
  readonly sessionsUsedThisMonth: number;
  readonly monthlyLimit: number;
  readonly remainingSessions: number;
  readonly cycleInterval: string;
  readonly periodEnd: string;
}

export interface ReviewItemDTO {
  readonly id: string;
  readonly word: string;
  readonly translation: string;
  readonly state: string;
  readonly intervalDays: number;
  readonly repetitions: number;
  readonly easeFactor: number;
  readonly nextReviewDate: string;
  readonly timesUsedCorrectly: number;
  readonly errorCount: number;
}
