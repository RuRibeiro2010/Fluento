import { ValueObject } from '../value-object';
import { InvalidArgumentError } from '../domain-error';

interface TimeStampProps {
  value: Date;
}

export class TimeStamp extends ValueObject<TimeStampProps> {
  private constructor(props: TimeStampProps) {
    super(props);
  }

  public static now(): TimeStamp {
    return new TimeStamp({ value: new Date() });
  }

  public static fromDate(date: Date): TimeStamp {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new InvalidArgumentError('Invalid Date object provided to TimeStamp.');
    }
    return new TimeStamp({ value: new Date(date.getTime()) });
  }

  public static fromISO(isoString: string): TimeStamp {
    const parsed = new Date(isoString);
    if (isNaN(parsed.getTime())) {
      throw new InvalidArgumentError(`Invalid ISO date string '${isoString}'.`);
    }
    return new TimeStamp({ value: parsed });
  }

  get value(): Date {
    return new Date(this.props.value.getTime());
  }

  public toISO(): string {
    return this.props.value.toISOString();
  }
}
