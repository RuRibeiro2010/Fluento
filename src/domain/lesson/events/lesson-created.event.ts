import { BaseDomainEvent } from '../../shared/domain-event';

export class LessonCreatedEvent extends BaseDomainEvent {
  constructor(lessonId: string, title: string, cefrLevel: string) {
    super('LessonCreated', lessonId, {
      lessonId,
      title,
      cefrLevel,
    });
  }
}

export class LessonCompletedEvent extends BaseDomainEvent {
  constructor(lessonId: string, studentId: string, score: number, durationSeconds: number) {
    super('LessonCompleted', lessonId, {
      lessonId,
      studentId,
      score,
      durationSeconds,
    });
  }
}
