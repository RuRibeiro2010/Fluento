import { ValueObject } from '../../shared/value-object';

interface SpacedRepetitionDataProps {
  intervalDays: number;
  easeFactor: number; // SM-2 default 2.5
  repetitions: number;
  nextReviewDate: Date;
}

export class SpacedRepetitionData extends ValueObject<SpacedRepetitionDataProps> {
  private constructor(props: SpacedRepetitionDataProps) {
    super(props);
  }

  public static createDefault(): SpacedRepetitionData {
    return new SpacedRepetitionData({
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: new Date(),
    });
  }

  public static create(props: SpacedRepetitionDataProps): SpacedRepetitionData {
    return new SpacedRepetitionData({
      intervalDays: Math.max(1, props.intervalDays),
      easeFactor: Math.max(1.3, props.easeFactor),
      repetitions: Math.max(0, props.repetitions),
      nextReviewDate: new Date(props.nextReviewDate.getTime()),
    });
  }

  get intervalDays(): number {
    return this.props.intervalDays;
  }

  get easeFactor(): number {
    return this.props.easeFactor;
  }

  get repetitions(): number {
    return this.props.repetitions;
  }

  get nextReviewDate(): Date {
    return new Date(this.props.nextReviewDate.getTime());
  }

  public isDueForReview(currentDate = new Date()): boolean {
    return currentDate.getTime() >= this.props.nextReviewDate.getTime();
  }
}
