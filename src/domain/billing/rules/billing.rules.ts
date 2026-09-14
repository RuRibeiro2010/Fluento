import { BusinessRuleViolationError } from '../../shared/domain-error';

export class BillingRules {
  public static validateUpgradeEligibility(currentPlan: string, targetPlan: string): void {
    if (currentPlan === targetPlan) {
      throw new BusinessRuleViolationError(
        'SubscriptionUpgradeRule',
        `Student is already subscribed to '${targetPlan}'.`
      );
    }
  }
}
