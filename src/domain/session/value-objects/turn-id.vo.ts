import { ValueObject } from '../../shared/value-object';
import { InvalidArgumentError } from '../../shared/domain-error';

interface TurnIdProps {
  value: string;
}

export class TurnId extends ValueObject<TurnIdProps> {
  private constructor(props: TurnIdProps) {
    super(props);
  }

  public static create(id: string): TurnId {
    if (!id || id.trim().length === 0) {
      throw new InvalidArgumentError('Turn ID cannot be empty.');
    }
    return new TurnId({ value: id.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
