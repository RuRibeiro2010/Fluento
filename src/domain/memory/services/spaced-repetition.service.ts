import { SpacedRepetitionData } from '../value-objects/spaced-repetition-data.vo';
import { MemoryRules } from '../rules/memory.rules';

export class SpacedRepetitionService {
  /**
   * Calculates the next SuperMemo SM-2 review parameters based on quality score (0 to 5).
   * 0 - Complete blackout
   * 1 - Incorrect response; the familiar item remembered
   * 2 - Incorrect response; where the correct one seemed easy to recall
   * 3 - Correct response recalled with serious difficulty
   * 4 - Correct response after a hesitation
   * 5 - Perfect response
   */
  public calculateNextReview(current: SpacedRepetitionData, quality: number): SpacedRepetitionData {
    MemoryRules.validateQualityScore(quality);

    let repetitions = current.repetitions;
    let intervalDays = current.intervalDays;
    let easeFactor = current.easeFactor;

    if (quality >= 3) {
      if (repetitions === 0) {
        intervalDays = 1;
      } else if (repetitions === 1) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round(intervalDays * easeFactor);
      }
      repetitions += 1;
    } else {
      repetitions = 0;
      intervalDays = 1;
    }

    // Ease Factor formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervalDays);

    return SpacedRepetitionData.create({
      intervalDays,
      easeFactor,
      repetitions,
      nextReviewDate: nextDate,
    });
  }
}
