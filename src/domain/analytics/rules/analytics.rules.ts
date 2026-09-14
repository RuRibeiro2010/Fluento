import { BusinessRuleViolationError } from '../../shared/domain-error';

export class AnalyticsRules {
  public static validateAccuracyPercent(accuracy: number): void {
    if (accuracy < 0 || accuracy > 100) {
      throw new BusinessRuleViolationError(
        'AccuracyPercentageRule',
        'Accuracy percentage must be between 0 and 100.'
      );
    }
  }
}
