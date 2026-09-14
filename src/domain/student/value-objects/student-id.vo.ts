import { ValueObject } from '../../shared/value-object';
import { InvalidArgumentError } from '../../shared/domain-error';

interface StudentIdProps {
  value: string;
}

export class StudentId extends ValueObject<StudentIdProps> {
  private constructor(props: StudentIdProps) {
    super(props);
  }

  public static create(id: string): StudentId {
    if (!id || id.trim().length === 0) {
      throw new InvalidArgumentError('Student ID cannot be empty.');
    }
    return new StudentId({ value: id.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
