import { ValueObject } from '../../shared/value-object';
import { Score } from '../../shared/value-objects/score.vo';

interface SpeakingMetricsProps {
  wordsPerMinute: number;
  grammarScore: Score;
  pronunciationScore: Score;
  fluencyScore: Score;
  hesitationCount: number;
}

export class SpeakingMetrics extends ValueObject<SpeakingMetricsProps> {
  private constructor(props: SpeakingMetricsProps) {
    super(props);
  }

  public static create(props: {
    wordsPerMinute: number;
    grammarScore: number;
    pronunciationScore: number;
    fluencyScore: number;
    hesitationCount?: number;
  }): SpeakingMetrics {
    return new SpeakingMetrics({
      wordsPerMinute: Math.max(0, props.wordsPerMinute),
      grammarScore: Score.create(props.grammarScore),
      pronunciationScore: Score.create(props.pronunciationScore),
      fluencyScore: Score.create(props.fluencyScore),
      hesitationCount: props.hesitationCount || 0,
    });
  }

  get wordsPerMinute(): number {
    return this.props.wordsPerMinute;
  }

  get grammarScore(): Score {
    return this.props.grammarScore;
  }

  get pronunciationScore(): Score {
    return this.props.pronunciationScore;
  }

  get fluencyScore(): Score {
    return this.props.fluencyScore;
  }

  get hesitationCount(): number {
    return this.props.hesitationCount;
  }

  public calculateCompositeScore(): number {
    return Math.round(
      (this.props.grammarScore.value * 0.35) +
      (this.props.pronunciationScore.value * 0.30) +
      (this.props.fluencyScore.value * 0.35)
    );
  }
}
