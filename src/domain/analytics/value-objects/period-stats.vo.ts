import { ValueObject } from '../../shared/value-object';

interface PeriodStatsProps {
  sessionsCompleted: number;
  totalMinutesPracticed: number;
  wordsLearnedCount: number;
  grammarRulesMasteredCount: number;
  averageAccuracyPercent: number;
}

export class PeriodStats extends ValueObject<PeriodStatsProps> {
  private constructor(props: PeriodStatsProps) {
    super(props);
  }

  public static create(props: Partial<PeriodStatsProps>): PeriodStats {
    return new PeriodStats({
      sessionsCompleted: props.sessionsCompleted || 0,
      totalMinutesPracticed: props.totalMinutesPracticed || 0,
      wordsLearnedCount: props.wordsLearnedCount || 0,
      grammarRulesMasteredCount: props.grammarRulesMasteredCount || 0,
      averageAccuracyPercent: props.averageAccuracyPercent ? Math.min(100, Math.max(0, props.averageAccuracyPercent)) : 0,
    });
  }

  get sessionsCompleted(): number {
    return this.props.sessionsCompleted;
  }

  get totalMinutesPracticed(): number {
    return this.props.totalMinutesPracticed;
  }

  get wordsLearnedCount(): number {
    return this.props.wordsLearnedCount;
  }

  get grammarRulesMasteredCount(): number {
    return this.props.grammarRulesMasteredCount;
  }

  get averageAccuracyPercent(): number {
    return this.props.averageAccuracyPercent;
  }
}
