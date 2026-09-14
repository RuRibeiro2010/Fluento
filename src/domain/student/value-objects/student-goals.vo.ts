import { ValueObject } from '../../shared/value-object';

export interface StudentGoalsProps {
  readonly weeklyMinutesGoal: number;
  readonly targetDeadlineIso?: string;
  readonly milestoneGoals: string[];
}

export class StudentGoals extends ValueObject<StudentGoalsProps> {
  private constructor(props: StudentGoalsProps) {
    super(props);
  }

  public static create(props: Partial<StudentGoalsProps>): StudentGoals {
    return new StudentGoals({
      weeklyMinutesGoal: props.weeklyMinutesGoal && props.weeklyMinutesGoal > 0 ? props.weeklyMinutesGoal : 60,
      targetDeadlineIso: props.targetDeadlineIso,
      milestoneGoals: props.milestoneGoals ? [...props.milestoneGoals] : ['Completar 4 sessões executivas', 'Atingir 80% no vocabulário'],
    });
  }

  get weeklyMinutesGoal(): number {
    return this.props.weeklyMinutesGoal;
  }

  get targetDeadlineIso(): string | undefined {
    return this.props.targetDeadlineIso;
  }

  get milestoneGoals(): string[] {
    return [...this.props.milestoneGoals];
  }
}
