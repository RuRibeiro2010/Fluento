import { ValueObject } from '../../shared/value-object';
import { InvalidArgumentError } from '../../shared/domain-error';

interface SessionIdProps {
  value: string;
}

export class SessionId extends ValueObject<SessionIdProps> {
  private constructor(props: SessionIdProps) {
    super(props);
  }

  public static create(id: string): SessionId {
    if (!id || id.trim().length === 0) {
      throw new InvalidArgumentError('Session ID cannot be empty.');
    }
    return new SessionId({ value: id.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
