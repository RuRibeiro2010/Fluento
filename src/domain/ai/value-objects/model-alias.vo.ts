import { ValueObject } from '../../shared/value-object';
import { InvalidModelAliasError } from '../errors/ai.errors';

export type AllowedModelAlias = 'gemini-3.6-flash' | 'gemini-3.1-pro' | 'gemini-2.5-flash';

interface ModelAliasProps {
  alias: AllowedModelAlias;
}

export class ModelAlias extends ValueObject<ModelAliasProps> {
  private static readonly SUPPORTED: AllowedModelAlias[] = ['gemini-3.6-flash', 'gemini-3.1-pro', 'gemini-2.5-flash'];

  private constructor(props: ModelAliasProps) {
    super(props);
  }

  public static create(alias: string): ModelAlias {
    if (!this.SUPPORTED.includes(alias as AllowedModelAlias)) {
      throw new InvalidModelAliasError(alias);
    }
    return new ModelAlias({ alias: alias as AllowedModelAlias });
  }

  get alias(): AllowedModelAlias {
    return this.props.alias;
  }
}
