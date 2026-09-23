import { ValueObject } from '../../shared/value-object';

export type PaceType = 'slow' | 'moderate' | 'fast';
export type FeedbackStyle = 'immediate' | 'end_of_lesson' | 'daily_summary';
export type CorrectionStyle = 'gentle' | 'strict' | 'adaptive';

interface LearningPreferencesProps {
  topics: string[];
  pace: PaceType;
  feedbackStyle: FeedbackStyle;
  correctionStyle: CorrectionStyle;
  weeklyGoalMinutes: number;
  dailyMinutes: number;
}

export class LearningPreferences extends ValueObject<LearningPreferencesProps> {
  private constructor(props: LearningPreferencesProps) {
    super(props);
  }

  public static create(props: Partial<LearningPreferencesProps>): LearningPreferences {
    return new LearningPreferences({
      topics: props.topics || ['negócios', 'viagens', 'cultura', 'tecnologia'],
      pace: props.pace || 'moderate',
      feedbackStyle: props.feedbackStyle || 'immediate',
      correctionStyle: props.correctionStyle || 'adaptive',
      weeklyGoalMinutes: props.weeklyGoalMinutes && props.weeklyGoalMinutes > 0 ? props.weeklyGoalMinutes : 150,
      dailyMinutes: props.dailyMinutes && props.dailyMinutes > 0 ? props.dailyMinutes : 20,
    });
  }

  get topics(): string[] {
    return [...this.props.topics];
  }

  get pace(): PaceType {
    return this.props.pace;
  }

  get feedbackStyle(): FeedbackStyle {
    return this.props.feedbackStyle;
  }

  get correctionStyle(): CorrectionStyle {
    return this.props.correctionStyle;
  }

  get weeklyGoalMinutes(): number {
    return this.props.weeklyGoalMinutes;
  }

  get dailyMinutes(): number {
    return this.props.dailyMinutes;
  }
}
