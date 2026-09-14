import { LessonEntity } from '../entities/lesson.entity';
import { LessonId } from '../value-objects/lesson-id.vo';
import { CEFRLevel } from '../../shared/value-objects/cefr-level.vo';

export interface ILessonRepository {
  findById(id: LessonId): Promise<LessonEntity | null>;
  findByLevel(level: CEFRLevel): Promise<LessonEntity[]>;
  findByTopic(topicTag: string): Promise<LessonEntity[]>;
  findAllActive(): Promise<LessonEntity[]>;
  save(lesson: LessonEntity): Promise<void>;
}
