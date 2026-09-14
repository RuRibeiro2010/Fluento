import { ValueObject } from '../../shared/value-object';

export interface StudentProgressProps {
  readonly completedSessionsCount: number;
  readonly totalMinutesPracticed: number;
  readonly wordsLearnedCount: number;
  readonly streakDays: number;
  readonly completedMinutesThisWeek: number;
  readonly lastSessionDateIso?: string;
}

export class StudentProgress extends ValueObject<StudentProgressProps> {
  private constructor(props: StudentProgressProps) {
    super(props);
  }

  public static create(props: Partial<StudentProgressProps>): StudentProgress {
    return new StudentProgress({
      completedSessionsCount: Math.max(0, props.completedSessionsCount ?? 0),
      totalMinutesPracticed: Math.max(0, props.totalMinutesPracticed ?? 0),
      wordsLearnedCount: Math.max(0, props.wordsLearnedCount ?? 0),
      streakDays: Math.max(0, props.streakDays ?? 1),
      completedMinutesThisWeek: Math.max(0, props.completedMinutesThisWeek ?? 0),
      lastSessionDateIso: props.lastSessionDateIso || new Date().toISOString(),
    });
  }

  get completedSessionsCount(): number {
    return this.props.completedSessionsCount;
  }

  get totalMinutesPracticed(): number {
    return this.props.totalMinutesPracticed;
  }

  get wordsLearnedCount(): number {
    return this.props.wordsLearnedCount;
  }

  get streakDays(): number {
    return this.props.streakDays;
  }

  get completedMinutesThisWeek(): number {
    return this.props.completedMinutesThisWeek;
  }

  get lastSessionDateIso(): string | undefined {
    return this.props.lastSessionDateIso;
  }
}
