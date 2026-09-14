import { StudentEntity } from '../../../../domain/student/entities/student.entity';
import { StudentId } from '../../../../domain/student/value-objects/student-id.vo';
import { IStudentRepository } from '../../../../domain/student/repositories/student-repository.interface';

/**
 * IN-MEMORY STUDENT REPOSITORY
 *
 * Default production implementation of `IStudentRepository` used by the
 * client-side Application Container while no remote persistence backend
 * (e.g. Supabase) is wired in. Data lives only for the lifetime of the
 * page/session and is NOT persisted across reloads.
 *
 * Relocated from `src/application/__tests__/fixtures.ts` during
 * Sprint 16A.4.1 (Architecture Hardening) so that production code no
 * longer imports from a test directory. Behavior is unchanged.
 */
export class InMemoryStudentRepository implements IStudentRepository {
  private students = new Map<string, StudentEntity>();

  public async findById(id: StudentId): Promise<StudentEntity | null> {
    return this.students.get(id.value) || null;
  }

  public async findByEmail(email: string): Promise<StudentEntity | null> {
    for (const student of this.students.values()) {
      if (student.email === email) return student;
    }
    return null;
  }

  public async save(student: StudentEntity): Promise<void> {
    this.students.set(student.id, student);
  }

  public async delete(id: StudentId): Promise<void> {
    this.students.delete(id.value);
  }
}
