import { BusinessRuleViolationError } from '../../shared/domain-error';

export class LearningRules {
  public static validateEvolutionMonths(months: number): void {
    if (months < 1 || months > 24) {
      throw new BusinessRuleViolationError(
        'EstimatedEvolutionMonthsRule',
        'Estimated evolution timeline must be between 1 and 24 months.'
      );
    }
  }
}
