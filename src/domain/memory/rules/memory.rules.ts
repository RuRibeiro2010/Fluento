import { BusinessRuleViolationError } from '../../shared/domain-error';

export class MemoryRules {
  public static validateQualityScore(quality: number): void {
    if (quality < 0 || quality > 5) {
      throw new BusinessRuleViolationError(
        'SpacedRepetitionQualityRule',
        'SuperMemo SM-2 quality score must be an integer between 0 and 5.'
      );
    }
  }
}
