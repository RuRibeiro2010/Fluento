import { ValueObject } from '../value-object';
import { InvalidArgumentError } from '../domain-error';

interface ScoreProps {
  value: number; // 0 to 100
}

export class Score extends ValueObject<ScoreProps> {
  private constructor(props: ScoreProps) {
    super(props);
  }

  public static create(value: number): Score {
    if (isNaN(value) || value < 0 || value > 100) {
      throw new InvalidArgumentError(`Score must be a number between 0 and 100. Received '${value}'.`);
    }
    return new Score({ value: Math.round(value * 10) / 10 });
  }

  get value(): number {
    return this.props.value;
  }

  public isPassing(threshold = 60): boolean {
    return this.props.value >= threshold;
  }
}
