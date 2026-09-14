import { Entity } from '../../shared/entity';
import { VocabularyState } from '../value-objects/vocabulary-state.vo';
import { SpacedRepetitionData } from '../value-objects/spaced-repetition-data.vo';
import { VocabularyMasteredEvent } from '../events/vocabulary-mastered.event';

export interface TrackedWordProps {
  studentId: string;
  word: string;
  translation: string;
  state: VocabularyState;
  srsData: SpacedRepetitionData;
  timesUsedCorrectly: number;
  errorCount: number;
  categoryTag?: string;
}

export class TrackedWordEntity extends Entity<TrackedWordProps> {
  private constructor(id: string, props: TrackedWordProps) {
    super(id, props);
  }

  public static create(id: string, props: TrackedWordProps): TrackedWordEntity {
    return new TrackedWordEntity(id, props);
  }

  get studentId(): string {
    return this._props.studentId;
  }

  get word(): string {
    return this._props.word;
  }

  get translation(): string {
    return this._props.translation;
  }

  get state(): VocabularyState {
    return this._props.state;
  }

  get srsData(): SpacedRepetitionData {
    return this._props.srsData;
  }

  get timesUsedCorrectly(): number {
    return this._props.timesUsedCorrectly;
  }

  get errorCount(): number {
    return this._props.errorCount;
  }

  public recordCorrectUsage(updatedSrs: SpacedRepetitionData): void {
    this._props.timesUsedCorrectly++;
    this._props.srsData = updatedSrs;

    if (this._props.timesUsedCorrectly >= 5 && !this._props.state.isMastered()) {
      this._props.state = VocabularyState.create('uses_naturally');
      this.addDomainEvent(new VocabularyMasteredEvent(this._props.studentId, this._id, this._props.word));
    }
  }

  public recordIncorrectUsage(updatedSrs: SpacedRepetitionData): void {
    this._props.errorCount++;
    this._props.srsData = updatedSrs;
    if (this._props.state.isMastered()) {
      this._props.state = VocabularyState.create('uses_with_help');
    }
  }
}
