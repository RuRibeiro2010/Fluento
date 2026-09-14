import { Entity } from '../../shared/entity';
import { CEFRLevel } from '../../shared/value-objects/cefr-level.vo';
import { LanguageCode } from '../../shared/value-objects/language-code.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';
import { StudentId } from '../value-objects/student-id.vo';
import { SkillMatrix, SkillScores } from '../value-objects/skill-matrix.vo';
import { LearningPreferences } from '../value-objects/learning-preferences.vo';
import { StudentObjectives } from '../value-objects/student-objectives.vo';
import { StudentProgress } from '../value-objects/student-progress.vo';
import { StudentGoals } from '../value-objects/student-goals.vo';
import { StudentEntity } from './student.entity';

export interface LearningHistoryRecord {
  readonly sessionId: string;
  readonly dateIso: string;
  readonly topicTitle: string;
  readonly cefrLevel: string;
  readonly accuracyPercent: number;
  readonly keyFeedback?: string;
}

export interface StudentProfileData {
  readonly id: string;
  readonly name?: string;
  readonly email?: string;
  readonly nativeLanguage: string;
  readonly targetLanguages: string[];
  readonly currentLevel: string;
  readonly targetLevel: string;
  readonly objectives: {
    readonly primaryMotivation: string;
    readonly professionalDomain?: string;
    readonly currentFocus: string;
    readonly targetExamOrMilestone?: string;
  };
  readonly interests: string[];
  readonly preferences: {
    readonly dailyGoalMinutes: number;
    readonly weeklyGoalMinutes: number;
    readonly preferredTeacherPersona: string;
    readonly correctionStrictness: 'gentle' | 'balanced' | 'strict';
    readonly pace: 'relaxed' | 'moderate' | 'intensive';
    readonly learningStyle?: 'auditory' | 'visual' | 'interactive' | 'reflective';
  };
  readonly competencies: {
    readonly speaking: number;
    readonly listening: number;
    readonly reading: number;
    readonly writing: number;
    readonly grammar: number;
    readonly vocabulary: number;
    readonly pronunciation: number;
    readonly fluency?: number;
    readonly confidence?: number;
  };
  readonly progress: {
    readonly completedSessionsCount: number;
    readonly totalMinutesPracticed: number;
    readonly wordsLearnedCount: number;
    readonly streakDays: number;
    readonly completedMinutesThisWeek: number;
    readonly lastSessionDateIso?: string;
  };
  readonly goals: {
    readonly weeklyMinutesGoal: number;
    readonly targetDeadlineIso?: string;
    readonly milestoneGoals: string[];
  };
  readonly learningHistory: LearningHistoryRecord[];
  readonly version: number;
  readonly createdAtIso: string;
  readonly updatedAtIso: string;
  readonly lastSyncedAtIso?: string;
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
  competencies: SkillMatrix;
  progress: StudentProgress;
  goals: StudentGoals;
  learningHistory: LearningHistoryRecord[];
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
      competencies: SkillMatrix.create({
        speaking: 72,
        listening: 78,
        reading: 80,
        writing: 70,
        grammar: 74,
        vocabulary: 76,
        pronunciation: 71,
        fluency: 73,
        confidence: 75,
      }),
      progress: StudentProgress.create({
        completedSessionsCount: 12,
        totalMinutesPracticed: 240,
        wordsLearnedCount: 185,
        streakDays: 4,
        completedMinutesThisWeek: 45,
        lastSessionDateIso: now.toISO(),
      }),
      goals: StudentGoals.create({
        weeklyMinutesGoal: 60,
        milestoneGoals: [
          'Concluir 4 sessões de simulação de negociação',
          'Alcançar precisão de 80% em conectores formais',
          'Dominar 50 novos termos de liderança',
        ],
      }),
      learningHistory: [
        {
          sessionId: 'session_init_1',
          dateIso: now.toISO(),
          topicTitle: 'Apresentação Executiva & Negociação de Ideias',
          cefrLevel: 'B1',
          accuracyPercent: 88,
          keyFeedback: 'Excelente cadência e vocabulário técnico preciso.',
        },
      ],
      learningStyle: 'interactive',
      preferredTeacherPersona: 'Prof. Sofia',
      version: 1,
      createdAt: now,
      updatedAt: now,
      lastSyncedAt: now,
    });
  }

  public static fromData(data: StudentProfileData): StudentProfileEntity {
    const scores: SkillScores = {
      speaking: data.competencies.speaking,
      listening: data.competencies.listening,
      reading: data.competencies.reading,
      writing: data.competencies.writing,
      grammar: data.competencies.grammar,
      vocabulary: data.competencies.vocabulary,
      pronunciation: data.competencies.pronunciation,
      fluency: data.competencies.fluency,
      confidence: data.competencies.confidence,
    };

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
      competencies: SkillMatrix.create(scores),
      progress: StudentProgress.create(data.progress || {}),
      goals: StudentGoals.create(data.goals || {}),
      learningHistory: data.learningHistory ? [...data.learningHistory] : [],
      learningStyle: data.preferences.learningStyle || 'interactive',
      preferredTeacherPersona: data.preferences.preferredTeacherPersona || 'Prof. Sofia',
      version: data.version || 1,
      createdAt: TimeStamp.fromISO(data.createdAtIso || new Date().toISOString()),
      updatedAt: TimeStamp.fromISO(data.updatedAtIso || new Date().toISOString()),
      lastSyncedAt: data.lastSyncedAtIso ? TimeStamp.fromISO(data.lastSyncedAtIso) : undefined,
    });
  }

  public toData(): StudentProfileData {
    const p = this._props;
    const scores = p.competencies.scores;
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
      competencies: {
        speaking: scores.speaking,
        listening: scores.listening,
        reading: scores.reading,
        writing: scores.writing,
        grammar: scores.grammar,
        vocabulary: scores.vocabulary,
        pronunciation: scores.pronunciation,
        fluency: scores.fluency,
        confidence: scores.confidence,
      },
      progress: {
        completedSessionsCount: p.progress.completedSessionsCount,
        totalMinutesPracticed: p.progress.totalMinutesPracticed,
        wordsLearnedCount: p.progress.wordsLearnedCount,
        streakDays: p.progress.streakDays,
        completedMinutesThisWeek: p.progress.completedMinutesThisWeek,
        lastSessionDateIso: p.progress.lastSessionDateIso,
      },
      goals: {
        weeklyMinutesGoal: p.goals.weeklyMinutesGoal,
        targetDeadlineIso: p.goals.targetDeadlineIso,
        milestoneGoals: p.goals.milestoneGoals,
      },
      learningHistory: [...p.learningHistory],
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

  get competencies(): SkillMatrix {
    return this._props.competencies;
  }

  get progress(): StudentProgress {
    return this._props.progress;
  }

  get goals(): StudentGoals {
    return this._props.goals;
  }

  get learningHistory(): ReadonlyArray<LearningHistoryRecord> {
    return this._props.learningHistory;
  }

  get version(): number {
    return this._props.version;
  }

  public updateProfile(updates: Partial<StudentProfileData>): void {
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
      p.preferences = LearningPreferences.create({
        dailyMinutes: prefs.dailyGoalMinutes ?? p.preferences.dailyMinutes,
        weeklyGoalMinutes: prefs.weeklyGoalMinutes ?? p.preferences.weeklyGoalMinutes,
        pace: prefs.pace ?? p.preferences.pace,
        correctionStyle: prefs.correctionStrictness === 'strict' ? 'strict' : prefs.correctionStrictness === 'gentle' ? 'gentle' : 'adaptive',
        topics: p.interests,
      });
    }

    if (updates.competencies) {
      const currentScores = p.competencies.scores;
      p.competencies = SkillMatrix.create({
        ...currentScores,
        ...updates.competencies,
      });
    }

    if (updates.progress) {
      p.progress = StudentProgress.create({
        completedSessionsCount: updates.progress.completedSessionsCount ?? p.progress.completedSessionsCount,
        totalMinutesPracticed: updates.progress.totalMinutesPracticed ?? p.progress.totalMinutesPracticed,
        wordsLearnedCount: updates.progress.wordsLearnedCount ?? p.progress.wordsLearnedCount,
        streakDays: updates.progress.streakDays ?? p.progress.streakDays,
        completedMinutesThisWeek: updates.progress.completedMinutesThisWeek ?? p.progress.completedMinutesThisWeek,
        lastSessionDateIso: updates.progress.lastSessionDateIso ?? p.progress.lastSessionDateIso,
      });
    }

    if (updates.goals) {
      p.goals = StudentGoals.create({
        weeklyMinutesGoal: updates.goals.weeklyMinutesGoal ?? p.goals.weeklyMinutesGoal,
        targetDeadlineIso: updates.goals.targetDeadlineIso ?? p.goals.targetDeadlineIso,
        milestoneGoals: updates.goals.milestoneGoals ?? p.goals.milestoneGoals,
      });
    }

    if (updates.learningHistory) {
      p.learningHistory = [...updates.learningHistory];
    }

    p.version += 1;
    p.updatedAt = TimeStamp.now();
  }

  public recordSessionCompletion(minutes: number, score: number, topic: string): void {
    const p = this._props;
    const newCompletedSessions = p.progress.completedSessionsCount + 1;
    const newTotalMinutes = p.progress.totalMinutesPracticed + minutes;
    const newWeeklyMinutes = p.progress.completedMinutesThisWeek + minutes;

    p.progress = StudentProgress.create({
      completedSessionsCount: newCompletedSessions,
      totalMinutesPracticed: newTotalMinutes,
      wordsLearnedCount: p.progress.wordsLearnedCount + Math.round(minutes * 1.5),
      streakDays: p.progress.streakDays,
      completedMinutesThisWeek: newWeeklyMinutes,
      lastSessionDateIso: new Date().toISOString(),
    });

    p.learningHistory.unshift({
      sessionId: `session_${Date.now()}`,
      dateIso: new Date().toISOString(),
      topicTitle: topic,
      cefrLevel: p.currentLevel.value,
      accuracyPercent: Math.min(100, Math.max(0, score)),
    });

    p.version += 1;
    p.updatedAt = TimeStamp.now();
  }

  public toStudentEntity(): StudentEntity {
    const p = this._props;
    return StudentEntity.create(this.studentId, {
      email: p.email,
      nativeLanguage: p.nativeLanguage,
      targetLanguages: [...p.targetLanguages],
      currentLevel: p.currentLevel,
      skillMatrix: p.competencies,
      preferences: p.preferences,
      currentFocus: p.objectives.currentFocus,
      motivation: p.objectives.primaryMotivation,
      active: true,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  public static fromStudentEntity(entity: StudentEntity, extra?: Partial<StudentProfileData>): StudentProfileEntity {
    const now = TimeStamp.now();
    const scores = entity.skillMatrix.scores;
    const prefs = entity.preferences;

    return new StudentProfileEntity(entity.id, {
      name: extra?.name || 'Aluno Executivo',
      email: entity.email,
      nativeLanguage: entity.nativeLanguage,
      targetLanguages: entity.targetLanguages,
      currentLevel: entity.currentLevel,
      targetLevel: extra?.targetLevel ? CEFRLevel.create(extra.targetLevel) : CEFRLevel.create('B2'),
      objectives: StudentObjectives.create({
        primaryMotivation: extra?.objectives?.primaryMotivation || entity.motivation,
        professionalDomain: extra?.objectives?.professionalDomain || 'Gestão & Negócios',
        currentFocus: entity.currentFocus,
        targetExamOrMilestone: extra?.objectives?.targetExamOrMilestone || 'Alinhamento Profissional',
      }),
      interests: extra?.interests ? [...extra.interests] : prefs.topics,
      preferences: prefs,
      competencies: entity.skillMatrix,
      progress: StudentProgress.create(extra?.progress || {
        completedSessionsCount: 1,
        totalMinutesPracticed: prefs.dailyMinutes,
        wordsLearnedCount: 30,
        streakDays: 1,
        completedMinutesThisWeek: prefs.dailyMinutes,
        lastSessionDateIso: now.toISO(),
      }),
      goals: StudentGoals.create(extra?.goals || {
        weeklyMinutesGoal: prefs.weeklyGoalMinutes,
      }),
      learningHistory: extra?.learningHistory ? [...extra.learningHistory] : [],
      learningStyle: extra?.preferences?.learningStyle || 'interactive',
      preferredTeacherPersona: extra?.preferences?.preferredTeacherPersona || 'Prof. Sofia',
      version: 1,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      lastSyncedAt: now,
    });
  }
}
