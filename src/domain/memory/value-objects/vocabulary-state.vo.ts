import { ValueObject } from '../../shared/value-object';

export type VocabState = 'recognizes' | 'understands' | 'uses_with_help' | 'uses_naturally';

interface VocabularyStateProps {
  state: VocabState;
}

export class VocabularyState extends ValueObject<VocabularyStateProps> {
  private constructor(props: VocabularyStateProps) {
    super(props);
  }

  public static create(state: VocabState): VocabularyState {
    return new VocabularyState({ state });
  }

  get state(): VocabState {
    return this.props.state;
  }

  public isMastered(): boolean {
    return this.props.state === 'uses_naturally';
  }
}
