import { TrackedWordEntity } from '../entities/tracked-word.entity';
import { VocabularyState } from '../value-objects/vocabulary-state.vo';
import { SpacedRepetitionData } from '../value-objects/spaced-repetition-data.vo';

export class MemoryFactory {
  public static createNewTrackedWord(
    studentId: string,
    word: string,
    translation: string,
    categoryTag?: string
  ): TrackedWordEntity {
    return TrackedWordEntity.create(`wrd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, {
      studentId,
      word: word.trim(),
      translation: translation.trim(),
      state: VocabularyState.create('recognizes'),
      srsData: SpacedRepetitionData.createDefault(),
      timesUsedCorrectly: 0,
      errorCount: 0,
      categoryTag,
    });
  }
}
