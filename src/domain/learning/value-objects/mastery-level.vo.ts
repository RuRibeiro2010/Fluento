import { ValueObject } from '../../shared/value-object';
import { Score } from '../../shared/value-objects/score.vo';

export type MasteryStage = 'novice' | 'learning' | 'competent' | 'mastered';

interface MasteryLevelProps {
  score: Score;
}

export class MasteryLevel extends ValueObject<MasteryLevelProps> {
  private constructor(props: MasteryLevelProps) {
    super(props);
  }

  public static create(scoreValue: number): MasteryLevel {
    return new MasteryLevel({ score: Score.create(scoreValue) });
  }

  get score(): Score {
    return this.props.score;
  }

  get stage(): MasteryStage {
    const val = this.props.score.value;
    if (val >= 85) return 'mastered';
    if (val >= 65) return 'competent';
    if (val >= 40) return 'learning';
    return 'novice';
  }
}
