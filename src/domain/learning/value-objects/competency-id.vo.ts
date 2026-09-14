import { ValueObject } from '../../shared/value-object';
import { InvalidArgumentError } from '../../shared/domain-error';

interface CompetencyIdProps {
  value: string;
}

export class CompetencyId extends ValueObject<CompetencyIdProps> {
  private constructor(props: CompetencyIdProps) {
    super(props);
  }

  public static create(id: string): CompetencyId {
    if (!id || id.trim().length === 0) {
      throw new InvalidArgumentError('Competency ID cannot be empty.');
    }
    return new CompetencyId({ value: id.trim().toLowerCase() });
  }

  get value(): string {
    return this.props.value;
  }
}
