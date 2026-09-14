import { Entity } from '../../shared/entity';
import { CEFRLevel } from '../../shared/value-objects/cefr-level.vo';
import { LanguageCode } from '../../shared/value-objects/language-code.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';
import { StudentId } from '../value-objects/student-id.vo';
import { SkillMatrix } from '../value-objects/skill-matrix.vo';
import { LearningPreferences } from '../value-objects/learning-preferences.vo';
import { StudentProfileUpdatedEvent } from '../events/student-registered.event';

export interface StudentProps {
  email: string;
  nativeLanguage: LanguageCode;
  targetLanguages: LanguageCode[];
  currentLevel: CEFRLevel;
  skillMatrix: SkillMatrix;
  preferences: LearningPreferences;
  currentFocus: string;
  motivation: string;
  active: boolean;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
}

export class StudentEntity extends Entity<StudentProps> {
  private constructor(id: string, props: StudentProps) {
    super(id, props);
  }

  public static create(id: StudentId, props: StudentProps): StudentEntity {
    return new StudentEntity(id.value, props);
  }

  get studentId(): StudentId {
    return StudentId.create(this._id);
  }

  get email(): string {
    return this._props.email;
  }

  get nativeLanguage(): LanguageCode {
    return this._props.nativeLanguage;
  }

  get targetLanguages(): LanguageCode[] {
    return [...this._props.targetLanguages];
  }

  get currentLevel(): CEFRLevel {
    return this._props.currentLevel;
  }

  get skillMatrix(): SkillMatrix {
    return this._props.skillMatrix;
  }

  get preferences(): LearningPreferences {
    return this._props.preferences;
  }

  get currentFocus(): string {
    return this._props.currentFocus;
  }

  get motivation(): string {
    return this._props.motivation;
  }

  get isActive(): boolean {
    return this._props.active;
  }

  get createdAt(): TimeStamp {
    return this._props.createdAt;
  }

  get updatedAt(): TimeStamp {
    return this._props.updatedAt;
  }

  public updateSkillMatrix(newMatrix: SkillMatrix): void {
    this._props.skillMatrix = newMatrix;
    this._props.updatedAt = TimeStamp.now();
    this.addDomainEvent(new StudentProfileUpdatedEvent(this._id, ['skillMatrix']));
  }

  public updateLevel(newLevel: CEFRLevel): void {
    this._props.currentLevel = newLevel;
    this._props.updatedAt = TimeStamp.now();
    this.addDomainEvent(new StudentProfileUpdatedEvent(this._id, ['currentLevel']));
  }

  public updatePreferences(newPrefs: LearningPreferences): void {
    this._props.preferences = newPrefs;
    this._props.updatedAt = TimeStamp.now();
    this.addDomainEvent(new StudentProfileUpdatedEvent(this._id, ['preferences']));
  }
}
