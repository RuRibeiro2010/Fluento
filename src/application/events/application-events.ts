export interface ApplicationEvent<TPayload = unknown> {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly payload: TPayload;
}

export class LessonStartedEvent implements ApplicationEvent<{ lessonId: string; studentId: string; teacherId: string }> {
  readonly eventName = 'Application.LessonStarted';
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly payload: { lessonId: string; studentId: string; teacherId: string }) {}
}

export class LessonFinishedEvent implements ApplicationEvent<{ lessonId: string; studentId: string; score: number }> {
  readonly eventName = 'Application.LessonFinished';
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly payload: { lessonId: string; studentId: string; score: number }) {}
}

export class StudentUpdatedEvent implements ApplicationEvent<{ studentId: string; updatedFields: string[] }> {
  readonly eventName = 'Application.StudentUpdated';
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly payload: { studentId: string; updatedFields: string[] }) {}
}

export class SessionCompletedEvent implements ApplicationEvent<{ sessionId: string; studentId: string; durationMinutes: number }> {
  readonly eventName = 'Application.SessionCompleted';
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly payload: { sessionId: string; studentId: string; durationMinutes: number }) {}
}

export class SubscriptionUpgradedEvent implements ApplicationEvent<{ studentId: string; newPlanTier: string }> {
  readonly eventName = 'Application.SubscriptionUpgraded';
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly payload: { studentId: string; newPlanTier: string }) {}
}

export class ReviewCompletedEvent implements ApplicationEvent<{ studentId: string; wordsReviewedCount: number }> {
  readonly eventName = 'Application.ReviewCompleted';
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly payload: { studentId: string; wordsReviewedCount: number }) {}
}

export class AnalyticsGeneratedEvent implements ApplicationEvent<{ studentId: string; fluencyScore: number }> {
  readonly eventName = 'Application.AnalyticsGenerated';
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly payload: { studentId: string; fluencyScore: number }) {}
}
