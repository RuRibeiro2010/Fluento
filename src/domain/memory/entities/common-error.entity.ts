import { Entity } from '../../shared/entity';

export type ErrorCategory = 'grammar' | 'vocabulary' | 'pronunciation' | 'syntax' | 'style';

export interface CommonErrorProps {
  studentId: string;
  concept: string;
  category: ErrorCategory;
  frequency: number;
  lastOccurred: Date;
  examples: string[];
}

export class CommonErrorEntity extends Entity<CommonErrorProps> {
  private constructor(id: string, props: CommonErrorProps) {
    super(id, props);
  }

  public static create(id: string, props: CommonErrorProps): CommonErrorEntity {
    return new CommonErrorEntity(id, props);
  }

  get studentId(): string {
    return this._props.studentId;
  }

  get concept(): string {
    return this._props.concept;
  }

  get category(): ErrorCategory {
    return this._props.category;
  }

  get frequency(): number {
    return this._props.frequency;
  }

  get examples(): string[] {
    return [...this._props.examples];
  }

  public recordOccurrence(exampleSentence: string): void {
    this._props.frequency++;
    this._props.lastOccurred = new Date();
    if (exampleSentence && !this._props.examples.includes(exampleSentence)) {
      this._props.examples.push(exampleSentence);
    }
  }
}
