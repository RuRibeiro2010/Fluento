import { SessionEntity } from '../entities/session.entity';
import { SessionId } from '../value-objects/session-id.vo';

export interface ISessionRepository {
  findById(id: SessionId): Promise<SessionEntity | null>;
  findByStudentId(studentId: string, limit?: number): Promise<SessionEntity[]>;
  save(session: SessionEntity): Promise<void>;
}
