import { LessonEntity } from '../../../../domain/lesson/entities/lesson.entity';
import { LessonId } from '../../../../domain/lesson/value-objects/lesson-id.vo';
import { CEFRLevel } from '../../../../domain/shared/value-objects/cefr-level.vo';
import { ILessonRepository } from '../../../../domain/lesson/repositories/lesson-repository.interface';

/**
 * IN-MEMORY LESSON REPOSITORY
 *
 * Default production implementation of `ILessonRepository`. See
 * `in-memory-student.repository.ts` for the rationale and Sprint
 * 16A.4.1 relocation notes. Behavior is unchanged from the previous
 * implementation in `src/application/__tests__/fixtures.ts`.
 */
export class InMemoryLessonRepository implements ILessonRepository {
  private lessons = new Map<string, LessonEntity>();

  public async findById(id: LessonId): Promise<LessonEntity | null> {
    return this.lessons.get(id.value) || null;
  }

  public async findByLevel(level: CEFRLevel): Promise<LessonEntity[]> {
    return Array.from(this.lessons.values()).filter((l) => l.cefrLevel.value === level.value);
  }

  public async findByTopic(topicTag: string): Promise<LessonEntity[]> {
    return Array.from(this.lessons.values()).filter((l) => l.topicTag === topicTag);
  }

  public async findAllActive(): Promise<LessonEntity[]> {
    return Array.from(this.lessons.values());
  }

  public async save(lesson: LessonEntity): Promise<void> {
    this.lessons.set(lesson.id, lesson);
  }
}
