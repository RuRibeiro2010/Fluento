import { BaseDomainEvent } from '../../shared/domain-event';

export class SessionStartedEvent extends BaseDomainEvent {
  constructor(sessionId: string, studentId: string, lessonId: string) {
    super('SessionStarted', sessionId, {
      sessionId,
      studentId,
      lessonId,
    });
  }
}

export class TurnProcessedEvent extends BaseDomainEvent {
  constructor(sessionId: string, turnId: string, turnIndex: number, score: number) {
    super('TurnProcessed', sessionId, {
      sessionId,
      turnId,
      turnIndex,
      score,
    });
  }
}

export class SessionEndedEvent extends BaseDomainEvent {
  constructor(sessionId: string, studentId: string, totalTurns: number, overallScore: number, durationSeconds: number) {
    super('SessionEnded', sessionId, {
      sessionId,
      studentId,
      totalTurns,
      overallScore,
      durationSeconds,
    });
  }
}
