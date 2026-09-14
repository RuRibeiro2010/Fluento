export interface GetDashboardQuery {
  readonly studentId: string;
}

export interface GetAnalyticsQuery {
  readonly studentId: string;
}

export interface GetStudentProfileQuery {
  readonly studentId: string;
}

export interface GetLessonHistoryQuery {
  readonly studentId: string;
  readonly limit?: number;
}

export interface GetStudyPlanQuery {
  readonly studentId: string;
}

export interface GetSubscriptionQuery {
  readonly studentId: string;
}

export interface GetDueVocabularyQuery {
  readonly studentId: string;
  readonly limit?: number;
}
