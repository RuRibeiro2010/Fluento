import { ValueObject } from '../value-object';
import { InvalidArgumentError } from '../domain-error';

interface LanguageCodeProps {
  code: string;
}

export class LanguageCode extends ValueObject<LanguageCodeProps> {
  private static readonly SUPPORTED_CODES = ['es', 'pt', 'en', 'fr', 'de', 'it', 'ja', 'zh'];

  private constructor(props: LanguageCodeProps) {
    super(props);
  }

  public static create(code: string): LanguageCode {
    const normalized = code.trim().toLowerCase();
    if (!normalized || normalized.length < 2) {
      throw new InvalidArgumentError(`Invalid language code '${code}'.`);
    }
    return new LanguageCode({ code: normalized });
  }

  get code(): string {
    return this.props.code;
  }
}
