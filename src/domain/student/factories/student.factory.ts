import { StudentEntity } from '../entities/student.entity';
import { StudentId } from '../value-objects/student-id.vo';
import { SkillMatrix } from '../value-objects/skill-matrix.vo';
import { LearningPreferences } from '../value-objects/learning-preferences.vo';
import { CEFRLevel } from '../../shared/value-objects/cefr-level.vo';
import { LanguageCode } from '../../shared/value-objects/language-code.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';

export class StudentFactory {
  public static createNewStudent(
    id: string,
    email: string,
    nativeLanguageCode = 'pt',
    targetLanguageCode = 'es'
  ): StudentEntity {
    return StudentEntity.create(StudentId.create(id), {
      email,
      nativeLanguage: LanguageCode.create(nativeLanguageCode),
      targetLanguages: [LanguageCode.create(targetLanguageCode)],
      currentLevel: CEFRLevel.create('A1'),
      skillMatrix: SkillMatrix.defaultInitial(),
      preferences: LearningPreferences.create({}),
      currentFocus: 'Vocabulário do dia-a-dia e expressões essenciais',
      motivation: 'Evolução profissional e viagens',
      active: true,
      createdAt: TimeStamp.now(),
      updatedAt: TimeStamp.now(),
    });
  }
}
