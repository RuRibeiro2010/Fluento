import { ValueObject } from '../../shared/value-object';
import { Score } from '../../shared/value-objects/score.vo';

interface FluencyIndexProps {
  overallScore: Score;
  confidenceScore: Score;
  spontaneityScore: Score;
}

export class FluencyIndex extends ValueObject<FluencyIndexProps> {
  private constructor(props: FluencyIndexProps) {
    super(props);
  }

  public static create(overall: number, confidence: number, spontaneity: number): FluencyIndex {
    return new FluencyIndex({
      overallScore: Score.create(overall),
      confidenceScore: Score.create(confidence),
      spontaneityScore: Score.create(spontaneity),
    });
  }

  get overallScore(): Score {
    return this.props.overallScore;
  }

  get confidenceScore(): Score {
    return this.props.confidenceScore;
  }

  get spontaneityScore(): Score {
    return this.props.spontaneityScore;
  }
}
