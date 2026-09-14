import { ValueObject } from '../../shared/value-object';
import { InvalidArgumentError } from '../../shared/domain-error';

interface LessonObjectiveProps {
  title: string;
  description: string;
  keyCompetencies: string[];
  targetSkill: string;
}

export class LessonObjective extends ValueObject<LessonObjectiveProps> {
  private constructor(props: LessonObjectiveProps) {
    super(props);
  }

  public static create(props: LessonObjectiveProps): LessonObjective {
    if (!props.title || props.title.trim().length === 0) {
      throw new InvalidArgumentError('Lesson objective title cannot be empty.');
    }
    return new LessonObjective({
      ...props,
      title: props.title.trim(),
      keyCompetencies: props.keyCompetencies || [],
    });
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get keyCompetencies(): string[] {
    return [...this.props.keyCompetencies];
  }

  get targetSkill(): string {
    return this.props.targetSkill;
  }
}
