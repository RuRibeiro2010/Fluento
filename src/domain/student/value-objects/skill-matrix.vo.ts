import { ValueObject } from '../../shared/value-object';
import { InvalidSkillMatrixError } from '../errors/student.errors';

export interface SkillScores {
  grammar: number;
  vocabulary: number;
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
  pronunciation: number;
  fluency?: number;
  confidence?: number;
}

interface SkillMatrixProps {
  scores: SkillScores;
}

export class SkillMatrix extends ValueObject<SkillMatrixProps> {
  private constructor(props: SkillMatrixProps) {
    super(props);
  }

  public static create(scores: SkillScores): SkillMatrix {
    const keys: (keyof SkillScores)[] = ['grammar', 'vocabulary', 'listening', 'speaking', 'reading', 'writing', 'pronunciation'];
    for (const k of keys) {
      const val = scores[k];
      if (typeof val !== 'number' || val < 0 || val > 100) {
        throw new InvalidSkillMatrixError(`Skill '${k}' score must be a number between 0 and 100. Received ${val}.`);
      }
    }
    return new SkillMatrix({
      scores: Object.freeze({
        grammar: Math.round(scores.grammar),
        vocabulary: Math.round(scores.vocabulary),
        listening: Math.round(scores.listening),
        speaking: Math.round(scores.speaking),
        reading: Math.round(scores.reading),
        writing: Math.round(scores.writing),
        pronunciation: Math.round(scores.pronunciation),
        fluency: scores.fluency !== undefined ? Math.round(scores.fluency) : undefined,
        confidence: scores.confidence !== undefined ? Math.round(scores.confidence) : undefined,
      }),
    });
  }

  public static defaultInitial(): SkillMatrix {
    return SkillMatrix.create({
      grammar: 40,
      vocabulary: 45,
      listening: 50,
      speaking: 35,
      reading: 55,
      writing: 40,
      pronunciation: 38,
      fluency: 35,
      confidence: 40,
    });
  }

  get scores(): SkillScores {
    return { ...this.props.scores };
  }

  public getAverageScore(): number {
    const s = this.props.scores;
    const sum = s.grammar + s.vocabulary + s.listening + s.speaking + s.reading + s.writing + s.pronunciation;
    return Math.round(sum / 7);
  }

  public withUpdatedSkill(skillName: keyof SkillScores, newScore: number): SkillMatrix {
    const updated = { ...this.props.scores, [skillName]: newScore };
    return SkillMatrix.create(updated);
  }
}
