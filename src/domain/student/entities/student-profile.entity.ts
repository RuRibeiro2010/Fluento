import { Entity } from '../../shared/entity';
import { CEFRLevel } from '../../shared/value-objects/cefr-level.vo';
import { LanguageCode } from '../../shared/value-objects/language-code.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';
import { StudentId } from '../value-objects/student-id.vo';
import { SkillMatrix, SkillScores } from '../value-objects/skill-matrix.vo';
import { LearningPreferences } from '../value-objects/learning-preferences.vo';
import { StudentObjectives } from '../value-objects/student-objectives.vo';
import { StudentEntity } from './student.entity';

/**
 * Domain-owned data representation of a Student Profile.
 * This is used for persistence and internal domain logic.
 */
export interface StudentProfileDomainData {
  id: string;
  name?: string;
  email?: string;
  nativeLanguage?: string;
  targetLanguages?: string[];
  currentLevel?: string;
  targetLevel?: string;
  objectives?: {
    primaryMotivation?: string;
    professionalDomain?: string;
    currentFocus?: string;
    targetExamOrMilestone?: string;
  };
  interests?: string[];
  preferences: {
    dailyGoalMinutes: number;
    weeklyGoalMinutes: number;
    preferredTeacherPersona?: string;
    correctionStrictness?: 'gentle' | 'balanced' | 'strict';
    pace?: 'slow' | 'moderate' | 'fast';
    learningStyle?: 'auditory' | 'visual' | 'interactive' | 'reflective';
  };
  version: number;
  createdAtIso: string;
  updatedAtIso: string;
  lastSyncedAtIso?: string;
}

export interface LearningHistoryRecord {
  sessionId: string;
  dateIso: string;
  topicTitle: string;
  cefrLevel: string;
  accuracyPercent: number;
  keyFeedback?: string;
}

export interface StudentProfileProps {
  name: string;
  email: string;
  nativeLanguage: LanguageCode;
  targetLanguages: LanguageCode[];
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  objectives: StudentObjectives;
  interests: string[];
  preferences: LearningPreferences;
  learningStyle: 'auditory' | 'visual' | 'interactive' | 'reflective';
  preferredTeacherPersona: string;
  version: number;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  lastSyncedAt?: TimeStamp;
}

export class StudentProfileEntity extends Entity<StudentProfileProps> {
  private constructor(id: string, props: StudentProfileProps) {
    super(id, props);
  }

  public static create(id: StudentId, props: StudentProfileProps): StudentProfileEntity {
    return new StudentProfileEntity(id.value, props);
  }

  public static createDefault(
    studentId = 'usr_fluento_primary',
    name = 'Aluno Executivo',
    email = 'aluno@fluento.ai',
    targetLang = 'es',
    nativeLang = 'pt'
  ): StudentProfileEntity {
    const now = TimeStamp.now();
    return new StudentProfileEntity(studentId, {
      name,
      email,
      nativeLanguage: LanguageCode.create(nativeLang),
      targetLanguages: [LanguageCode.create(targetLang)],
      currentLevel: CEFRLevel.create('B1'),
      targetLevel: CEFRLevel.create('B2'),
      objectives: StudentObjectives.create({
        primaryMotivation: 'Fluência Corporativa & Reuniões Globais',
        professionalDomain: 'Gestão Executiva & Tecnologia',
        currentFocus: 'Apresentação Executiva & Negociação de Ideias',
        targetExamOrMilestone: 'Nível B2 Profissional',
      }),
      interests: ['Negócios', 'Viagens', 'Tecnologia', 'Liderança', 'Cultura'],
      preferences: LearningPreferences.create({
        dailyMinutes: 15,
        weeklyGoalMinutes: 60,
        pace: 'moderate',
        correctionStyle: 'adaptive',
        topics: ['Negócios', 'Viagens', 'Tecnologia'],
      }),
      learningStyle: 'interactive',
      preferredTeacherPersona: 'Prof. Sofia',
      version: 1,
      createdAt: now,
      updatedAt: now,
      lastSyncedAt: now,
    });
  }

  public static fromData(data: StudentProfileDomainData): StudentProfileEntity {
    const correctionStyle = data.preferences.correctionStrictness === 'strict'
      ? 'strict'
      : data.preferences.correctionStrictness === 'gentle'
      ? 'gentle'
      : 'adaptive';

    return new StudentProfileEntity(data.id, {
      name: data.name || 'Aluno Executivo',
      email: data.email || `${data.id}@fluento.ai`,
      nativeLanguage: LanguageCode.create(data.nativeLanguage || 'pt'),
      targetLanguages: (data.targetLanguages && data.targetLanguages.length > 0)
        ? data.targetLanguages.map((c) => LanguageCode.create(c))
        : [LanguageCode.create('es')],
      currentLevel: CEFRLevel.create(data.currentLevel || 'B1'),
      targetLevel: CEFRLevel.create(data.targetLevel || 'B2'),
      objectives: StudentObjectives.create(data.objectives || {}),
      interests: data.interests ? [...data.interests] : ['Negócios', 'Viagens'],
      preferences: LearningPreferences.create({
        dailyMinutes: data.preferences.dailyGoalMinutes,
        weeklyGoalMinutes: data.preferences.weeklyGoalMinutes,
        pace: data.preferences.pace,
        correctionStyle,
        topics: data.interests,
      }),
      learningStyle: data.preferences.learningStyle || 'interactive',
      preferredTeacherPersona: data.preferences.preferredTeacherPersona || 'Prof. Sofia',
      version: data.version || 1,
      createdAt: TimeStamp.fromISO(data.createdAtIso || new Date().toISOString()),
      updatedAt: TimeStamp.fromISO(data.updatedAtIso || new Date().toISOString()),
      lastSyncedAt: data.lastSyncedAtIso ? TimeStamp.fromISO(data.lastSyncedAtIso) : undefined,
    });
  }

  public toData(): StudentProfileDomainData {
    const p = this._props;
    const correctionStrictness: 'gentle' | 'balanced' | 'strict' =
      p.preferences.correctionStyle === 'strict'
        ? 'strict'
        : p.preferences.correctionStyle === 'gentle'
        ? 'gentle'
        : 'balanced';

    return {
      id: this._id,
      name: p.name,
      email: p.email,
      nativeLanguage: p.nativeLanguage.code,
      targetLanguages: p.targetLanguages.map((l) => l.code),
      currentLevel: p.currentLevel.value,
      targetLevel: p.targetLevel.value,
      objectives: {
        primaryMotivation: p.objectives.primaryMotivation,
        professionalDomain: p.objectives.professionalDomain,
        currentFocus: p.objectives.currentFocus,
        targetExamOrMilestone: p.objectives.targetExamOrMilestone,
      },
      interests: [...p.interests],
      preferences: {
        dailyGoalMinutes: p.preferences.dailyMinutes,
        weeklyGoalMinutes: p.preferences.weeklyGoalMinutes,
        preferredTeacherPersona: p.preferredTeacherPersona,
        correctionStrictness,
        pace: p.preferences.pace,
        learningStyle: p.learningStyle,
      },
      version: p.version,
      createdAtIso: p.createdAt.toISO(),
      updatedAtIso: p.updatedAt.toISO(),
      lastSyncedAtIso: p.lastSyncedAt?.toISO(),
    };
  }

  get studentId(): StudentId {
    return StudentId.create(this._id);
  }

  get name(): string {
    return this._props.name;
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

  get targetLevel(): CEFRLevel {
    return this._props.targetLevel;
  }

  get objectives(): StudentObjectives {
    return this._props.objectives;
  }

  get interests(): string[] {
    return [...this._props.interests];
  }

  get preferences(): LearningPreferences {
    return this._props.preferences;
  }

  get version(): number {
    return this._props.version;
  }

  get createdAt(): TimeStamp {
    return this._props.createdAt;
  }

  get updatedAt(): TimeStamp {
    return this._props.updatedAt;
  }

  public updateProfile(updates: Partial<StudentProfileDomainData>): void {
    const p = this._props;
    if (updates.name !== undefined) p.name = updates.name;
    if (updates.email !== undefined) p.email = updates.email;
    if (updates.nativeLanguage) p.nativeLanguage = LanguageCode.create(updates.nativeLanguage);
    if (updates.targetLanguages && updates.targetLanguages.length > 0) {
      p.targetLanguages = updates.targetLanguages.map((c) => LanguageCode.create(c));
    }
    if (updates.currentLevel) p.currentLevel = CEFRLevel.create(updates.currentLevel);
    if (updates.targetLevel) p.targetLevel = CEFRLevel.create(updates.targetLevel);
    if (updates.interests) p.interests = [...updates.interests];

    if (updates.objectives) {
      p.objectives = StudentObjectives.create({
        primaryMotivation: updates.objectives.primaryMotivation ?? p.objectives.primaryMotivation,
        professionalDomain: updates.objectives.professionalDomain ?? p.objectives.professionalDomain,
        currentFocus: updates.objectives.currentFocus ?? p.objectives.currentFocus,
        targetExamOrMilestone: updates.objectives.targetExamOrMilestone ?? p.objectives.targetExamOrMilestone,
      });
    }

    if (updates.preferences) {
      const prefs = updates.preferences;
      if (prefs.preferredTeacherPersona) p.preferredTeacherPersona = prefs.preferredTeacherPersona;
      if (prefs.learningStyle) p.learningStyle = prefs.learningStyle;
      
      const pace = (prefs.pace || p.preferences.pace);

      p.preferences = LearningPreferences.create({
        dailyMinutes: prefs.dailyGoalMinutes ?? p.preferences.dailyMinutes,
        weeklyGoalMinutes: prefs.weeklyGoalMinutes ?? p.preferences.weeklyGoalMinutes,
        pace: pace as any,
        correctionStyle: prefs.correctionStrictness === 'strict' ? 'strict' : prefs.correctionStrictness === 'gentle' ? 'gentle' : 'adaptive',
        topics: p.interests,
      });
    }

    p.version += 1;
    p.updatedAt = TimeStamp.now();
  }
}
