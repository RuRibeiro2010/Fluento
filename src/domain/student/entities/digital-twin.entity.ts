import { Entity } from '../../shared/entity';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';
import { StudentId } from '../value-objects/student-id.vo';
import { CEFRLevel } from '../../shared/value-objects/cefr-level.vo';

/**
 * Domain-owned data representation of the Student Digital Twin.
 * Focuses on evolving learning state, competencies, and progress signals.
 */
export interface DigitalTwinDomainData {
  studentId: string;
  currentLevel: string;
  targetLevel: string;
  competencies: {
    speaking: number;
    listening: number;
    reading: number;
    writing: number;
    grammar: number;
    vocabulary: number;
    pronunciation: number;
    fluency: number;
    confidence: number;
  };
  progress: {
    completedSessionsCount: number;
    totalMinutesPracticed: number;
    wordsLearnedCount: number;
    streakDays: number;
    completedMinutesThisWeek: number;
    lastSessionDateIso: string;
    lastSessionTopic: string;
  };
  strengths: string[];
  weaknesses: string[];
  recentSignals: LearningSignal[];
  version: number;
  updatedAtIso: string;
}

export interface LearningSignal {
  type: 'lesson_completion' | 'assessment' | 'interaction';
  timestampIso: string;
  payload: any;
}

export interface DigitalTwinProps {
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  competencies: {
    speaking: number;
    listening: number;
    reading: number;
    writing: number;
    grammar: number;
    vocabulary: number;
    pronunciation: number;
    fluency: number;
    confidence: number;
  };
  progress: {
    completedSessionsCount: number;
    totalMinutesPracticed: number;
    wordsLearnedCount: number;
    streakDays: number;
    completedMinutesThisWeek: number;
    lastSessionDateIso: string;
    lastSessionTopic: string;
  };
  strengths: string[];
  weaknesses: string[];
  recentSignals: LearningSignal[];
  version: number;
  updatedAt: TimeStamp;
}

export class DigitalTwinEntity extends Entity<DigitalTwinProps> {
  private constructor(id: string, props: DigitalTwinProps) {
    super(id, props);
  }

  public static create(studentId: StudentId, props: DigitalTwinProps): DigitalTwinEntity {
    return new DigitalTwinEntity(studentId.value, props);
  }

  public static createNew(studentId: string): DigitalTwinEntity {
    const now = TimeStamp.now();
    return new DigitalTwinEntity(studentId, {
      currentLevel: CEFRLevel.create('B1'),
      targetLevel: CEFRLevel.create('B2'),
      competencies: {
        speaking: 70,
        listening: 70,
        reading: 70,
        writing: 70,
        grammar: 70,
        vocabulary: 70,
        pronunciation: 70,
        fluency: 70,
        confidence: 70,
      },
      progress: {
        completedSessionsCount: 0,
        totalMinutesPracticed: 0,
        wordsLearnedCount: 0,
        streakDays: 0,
        completedMinutesThisWeek: 0,
        lastSessionDateIso: now.toISO(),
        lastSessionTopic: '',
      },
      strengths: [],
      weaknesses: [],
      recentSignals: [],
      version: 1,
      updatedAt: now,
    });
  }

  public static fromData(data: DigitalTwinDomainData): DigitalTwinEntity {
    return new DigitalTwinEntity(data.studentId, {
      currentLevel: CEFRLevel.create(data.currentLevel),
      targetLevel: CEFRLevel.create(data.targetLevel),
      competencies: { ...data.competencies },
      progress: { ...data.progress },
      strengths: [...data.strengths],
      weaknesses: [...data.weaknesses],
      recentSignals: [...data.recentSignals],
      version: data.version,
      updatedAt: TimeStamp.fromISO(data.updatedAtIso),
    });
  }

  public toData(): DigitalTwinDomainData {
    const p = this._props;
    return {
      studentId: this._id,
      currentLevel: p.currentLevel.value,
      targetLevel: p.targetLevel.value,
      competencies: { ...p.competencies },
      progress: { ...p.progress },
      strengths: [...p.strengths],
      weaknesses: [...p.weaknesses],
      recentSignals: [...p.recentSignals],
      version: p.version,
      updatedAtIso: p.updatedAt.toISO(),
    };
  }

  public recordLessonOutcome(minutes: number, score: number, topic: string): void {
    const p = this._props;
    p.progress.completedSessionsCount += 1;
    p.progress.totalMinutesPracticed += minutes;
    p.progress.completedMinutesThisWeek += minutes;
    p.progress.lastSessionDateIso = new Date().toISOString();
    p.progress.lastSessionTopic = topic;
    
    // Simple heuristic for word count growth
    p.progress.wordsLearnedCount += Math.round(minutes * 1.5);

    // Update specific competency slightly based on score
    const growth = score / 100 * 0.5;
    p.competencies.fluency = Math.min(100, p.competencies.fluency + growth);
    p.competencies.confidence = Math.min(100, p.competencies.confidence + growth);

    p.recentSignals.unshift({
      type: 'lesson_completion',
      timestampIso: new Date().toISOString(),
      payload: { minutes, score, topic }
    });

    if (p.recentSignals.length > 10) p.recentSignals.pop();

    p.version += 1;
    p.updatedAt = TimeStamp.now();
  }

  public updateCompetencies(updates: Partial<DigitalTwinProps['competencies']>): void {
    this._props.competencies = { ...this._props.competencies, ...updates };
    this._props.version += 1;
    this._props.updatedAt = TimeStamp.now();
  }

  public updateLevel(level: string): void {
    this._props.currentLevel = CEFRLevel.create(level);
    this._props.version += 1;
    this._props.updatedAt = TimeStamp.now();
  }
}
