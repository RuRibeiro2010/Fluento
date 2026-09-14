import { Entity } from '../../shared/entity';
import { PeriodStats } from '../value-objects/period-stats.vo';
import { FluencyIndex } from '../value-objects/fluency-index.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';
import { AnalyticsSnapshotTakenEvent } from '../events/analytics-snapshot-taken.event';

export interface StudentAnalyticsProps {
  studentId: string;
  weeklyStats: PeriodStats;
  monthlyStats: PeriodStats;
  fluencyIndex: FluencyIndex;
  lastCalculatedAt: TimeStamp;
}

export class StudentAnalyticsEntity extends Entity<StudentAnalyticsProps> {
  private constructor(id: string, props: StudentAnalyticsProps) {
    super(id, props);
  }

  public static create(id: string, props: StudentAnalyticsProps): StudentAnalyticsEntity {
    return new StudentAnalyticsEntity(id, props);
  }

  get studentId(): string {
    return this._props.studentId;
  }

  get weeklyStats(): PeriodStats {
    return this._props.weeklyStats;
  }

  get monthlyStats(): PeriodStats {
    return this._props.monthlyStats;
  }

  get fluencyIndex(): FluencyIndex {
    return this._props.fluencyIndex;
  }

  get lastCalculatedAt(): TimeStamp {
    return this._props.lastCalculatedAt;
  }

  public recordSessionCompleted(minutes: number, score: number, newWordsCount: number): void {
    const w = this._props.weeklyStats;
    const m = this._props.monthlyStats;

    const newWeeklyAcc = w.sessionsCompleted === 0 ? score : Math.round((w.averageAccuracyPercent * w.sessionsCompleted + score) / (w.sessionsCompleted + 1));
    const newMonthlyAcc = m.sessionsCompleted === 0 ? score : Math.round((m.averageAccuracyPercent * m.sessionsCompleted + score) / (m.sessionsCompleted + 1));

    this._props.weeklyStats = PeriodStats.create({
      sessionsCompleted: w.sessionsCompleted + 1,
      totalMinutesPracticed: w.totalMinutesPracticed + minutes,
      wordsLearnedCount: w.wordsLearnedCount + newWordsCount,
      grammarRulesMasteredCount: w.grammarRulesMasteredCount,
      averageAccuracyPercent: newWeeklyAcc,
    });

    this._props.monthlyStats = PeriodStats.create({
      sessionsCompleted: m.sessionsCompleted + 1,
      totalMinutesPracticed: m.totalMinutesPracticed + minutes,
      wordsLearnedCount: m.wordsLearnedCount + newWordsCount,
      grammarRulesMasteredCount: m.grammarRulesMasteredCount,
      averageAccuracyPercent: newMonthlyAcc,
    });

    this._props.lastCalculatedAt = TimeStamp.now();
    this.addDomainEvent(new AnalyticsSnapshotTakenEvent(this._props.studentId, this._props.fluencyIndex.overallScore.value));
  }
}
