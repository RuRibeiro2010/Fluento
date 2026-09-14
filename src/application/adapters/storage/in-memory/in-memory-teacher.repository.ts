import { TeacherEntity } from '../../../../domain/teacher/entities/teacher.entity';
import { TeacherId } from '../../../../domain/teacher/value-objects/teacher-id.vo';
import { LanguageCode } from '../../../../domain/shared/value-objects/language-code.vo';
import { ITeacherRepository } from '../../../../domain/teacher/repositories/teacher-repository.interface';

/**
 * IN-MEMORY TEACHER REPOSITORY
 *
 * Default production implementation of `ITeacherRepository`. See
 * `in-memory-student.repository.ts` for the rationale and Sprint
 * 16A.4.1 relocation notes. Behavior is unchanged from the previous
 * implementation in `src/application/__tests__/fixtures.ts`.
 */
export class InMemoryTeacherRepository implements ITeacherRepository {
  private teachers = new Map<string, TeacherEntity>();

  public async findById(id: TeacherId): Promise<TeacherEntity | null> {
    return this.teachers.get(id.value) || null;
  }

  public async findAllActive(): Promise<TeacherEntity[]> {
    return Array.from(this.teachers.values()).filter((t) => t.isActive);
  }

  public async findByLanguage(language: LanguageCode): Promise<TeacherEntity[]> {
    return Array.from(this.teachers.values()).filter((t) => t.targetLanguage.code === language.code);
  }

  public async save(teacher: TeacherEntity): Promise<void> {
    this.teachers.set(teacher.id, teacher);
  }
}
