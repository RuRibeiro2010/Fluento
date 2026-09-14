import { ValueObject } from '../../shared/value-object';

interface PedagogicalDirectiveProps {
  correctionPatienceLevel: 'gentle' | 'balanced' | 'strict';
  focusSkill: string;
  maxSentenceLengthWords: number;
  useSocraticQuestions: boolean;
}

export class PedagogicalDirective extends ValueObject<PedagogicalDirectiveProps> {
  private constructor(props: PedagogicalDirectiveProps) {
    super(props);
  }

  public static create(props: Partial<PedagogicalDirectiveProps>): PedagogicalDirective {
    return new PedagogicalDirective({
      correctionPatienceLevel: props.correctionPatienceLevel || 'balanced',
      focusSkill: props.focusSkill || 'fluência oral e vocabulário',
      maxSentenceLengthWords: props.maxSentenceLengthWords || 25,
      useSocraticQuestions: props.useSocraticQuestions !== undefined ? props.useSocraticQuestions : true,
    });
  }

  get correctionPatienceLevel(): string {
    return this.props.correctionPatienceLevel;
  }

  get focusSkill(): string {
    return this.props.focusSkill;
  }

  get maxSentenceLengthWords(): number {
    return this.props.maxSentenceLengthWords;
  }

  get useSocraticQuestions(): boolean {
    return this.props.useSocraticQuestions;
  }
}
