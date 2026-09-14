import { Entity } from '../../shared/entity';
import { TeacherId } from '../value-objects/teacher-id.vo';
import { TeacherPersona } from '../value-objects/teacher-persona.vo';
import { LanguageCode } from '../../shared/value-objects/language-code.vo';

export interface TeacherProps {
  persona: TeacherPersona;
  targetLanguage: LanguageCode;
  supportedCEFRLevels: string[];
  active: boolean;
}

export class TeacherEntity extends Entity<TeacherProps> {
  private constructor(id: string, props: TeacherProps) {
    super(id, props);
  }

  public static create(id: TeacherId, props: TeacherProps): TeacherEntity {
    return new TeacherEntity(id.value, props);
  }

  get teacherId(): TeacherId {
    return TeacherId.create(this._id);
  }

  get persona(): TeacherPersona {
    return this._props.persona;
  }

  get targetLanguage(): LanguageCode {
    return this._props.targetLanguage;
  }

  get supportedCEFRLevels(): string[] {
    return [...this._props.supportedCEFRLevels];
  }

  get isActive(): boolean {
    return this._props.active;
  }

  public supportsLevel(level: string): boolean {
    return this._props.supportedCEFRLevels.includes(level.toUpperCase());
  }
}
