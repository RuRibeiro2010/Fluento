import { ValueObject } from '../../shared/value-object';
import { InvalidArgumentError } from '../../shared/domain-error';

interface TeacherIdProps {
  value: string;
}

export class TeacherId extends ValueObject<TeacherIdProps> {
  private constructor(props: TeacherIdProps) {
    super(props);
  }

  public static create(id: string): TeacherId {
    if (!id || id.trim().length === 0) {
      throw new InvalidArgumentError('Teacher ID cannot be empty.');
    }
    return new TeacherId({ value: id.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
