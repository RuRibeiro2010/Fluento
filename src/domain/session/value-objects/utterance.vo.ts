import { ValueObject } from '../../shared/value-object';
import { InvalidArgumentError } from '../../shared/domain-error';

interface UtteranceProps {
  text: string;
  languageCode: string;
  audioDurationSeconds?: number;
}

export class Utterance extends ValueObject<UtteranceProps> {
  private constructor(props: UtteranceProps) {
    super(props);
  }

  public static create(text: string, languageCode = 'es', audioDurationSeconds?: number): Utterance {
    if (text === undefined || text === null) {
      throw new InvalidArgumentError('Utterance text cannot be null or undefined.');
    }
    return new Utterance({
      text: text.trim(),
      languageCode,
      audioDurationSeconds,
    });
  }

  get text(): string {
    return this.props.text;
  }

  get languageCode(): string {
    return this.props.languageCode;
  }

  get audioDurationSeconds(): number | undefined {
    return this.props.audioDurationSeconds;
  }

  get wordCount(): number {
    if (!this.props.text) return 0;
    return this.props.text.trim().split(/\s+/).length;
  }
}
