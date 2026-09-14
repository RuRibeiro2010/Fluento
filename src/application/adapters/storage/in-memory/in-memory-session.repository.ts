import { SessionEntity } from '../../../../domain/session/entities/session.entity';
import { SessionId } from '../../../../domain/session/value-objects/session-id.vo';
import { ISessionRepository } from '../../../../domain/session/repositories/session-repository.interface';

/**
 * IN-MEMORY SESSION REPOSITORY
 *
 * Default production implementation of `ISessionRepository`. See
 * `in-memory-student.repository.ts` for the rationale and Sprint
 * 16A.4.1 relocation notes. Behavior is unchanged from the previous
 * implementation in `src/application/__tests__/fixtures.ts`.
 */
export class InMemorySessionRepository implements ISessionRepository {
  private sessions = new Map<string, SessionEntity>();

  public async findById(id: SessionId): Promise<SessionEntity | null> {
    return this.sessions.get(id.value) || null;
  }

  public async findByStudentId(studentId: string): Promise<SessionEntity[]> {
    return Array.from(this.sessions.values()).filter((s) => s.studentId === studentId);
  }

  public async save(session: SessionEntity): Promise<void> {
    this.sessions.set(session.id, session);
  }
}
