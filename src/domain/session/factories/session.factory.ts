import { SessionEntity } from '../entities/session.entity';
import { SessionId } from '../value-objects/session-id.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';
import { SessionStartedEvent } from '../events/session-started.event';

export class SessionFactory {
  public static createNewSession(
    sessionId: string,
    studentId: string,
    lessonId: string,
    teacherId: string
  ): SessionEntity {
    const session = SessionEntity.create(SessionId.create(sessionId), {
      studentId,
      lessonId,
      teacherId,
      state: 'active',
      turns: [],
      startedAt: TimeStamp.now(),
    });

    session['addDomainEvent'](new SessionStartedEvent(sessionId, studentId, lessonId));
    return session;
  }
}
