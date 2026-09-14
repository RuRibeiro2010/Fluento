import { TeacherEntity } from '../entities/teacher.entity';
import { TeacherId } from '../value-objects/teacher-id.vo';
import { LanguageCode } from '../../shared/value-objects/language-code.vo';

export interface ITeacherRepository {
  findById(id: TeacherId): Promise<TeacherEntity | null>;
  findAllActive(): Promise<TeacherEntity[]>;
  findByLanguage(language: LanguageCode): Promise<TeacherEntity[]>;
  save(teacher: TeacherEntity): Promise<void>;
}
