import { ValueObject } from '../../shared/value-object';
import { InvalidArgumentError } from '../../shared/domain-error';

interface LessonIdProps {
  value: string;
}

export class LessonId extends ValueObject<LessonIdProps> {
  private constructor(props: LessonIdProps) {
    super(props);
  }

  public static create(id: string): LessonId {
    if (!id || id.trim().length === 0) {
      throw new InvalidArgumentError('Lesson ID cannot be empty.');
    }
    return new LessonId({ value: id.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
