import { ValueObject } from '../value-object';
import { InvalidArgumentError } from '../domain-error';

export type CEFRLevelType = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

interface CEFRLevelProps {
  value: CEFRLevelType;
}

export class CEFRLevel extends ValueObject<CEFRLevelProps> {
  private static readonly VALID_LEVELS: CEFRLevelType[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  private constructor(props: CEFRLevelProps) {
    super(props);
  }

  public static create(value: string): CEFRLevel {
    const uppercase = value.toUpperCase() as CEFRLevelType;
    if (!this.VALID_LEVELS.includes(uppercase)) {
      throw new InvalidArgumentError(`Invalid CEFR level '${value}'. Must be one of: ${this.VALID_LEVELS.join(', ')}`);
    }
    return new CEFRLevel({ value: uppercase });
  }

  get value(): CEFRLevelType {
    return this.props.value;
  }

  public isHigherThan(other: CEFRLevel): boolean {
    return CEFRLevel.VALID_LEVELS.indexOf(this.props.value) > CEFRLevel.VALID_LEVELS.indexOf(other.value);
  }

  public isLowerThan(other: CEFRLevel): boolean {
    return CEFRLevel.VALID_LEVELS.indexOf(this.props.value) < CEFRLevel.VALID_LEVELS.indexOf(other.value);
  }
}
