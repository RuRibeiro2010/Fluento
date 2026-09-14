import { BusinessRuleViolationError } from '../../shared/domain-error';
import { CEFRLevel } from '../../shared/value-objects/cefr-level.vo';

export class StudentRules {
  public static validateDailyGoal(dailyMinutes: number): void {
    if (dailyMinutes < 5 || dailyMinutes > 240) {
      throw new BusinessRuleViolationError(
        'StudentDailyGoalRule',
        'Daily practice goal must be between 5 and 240 minutes.'
      );
    }
  }

  public static validateLevelTransition(current: CEFRLevel, target: CEFRLevel): void {
    if (target.isLowerThan(current)) {
      throw new BusinessRuleViolationError(
        'CEFRTargetLevelRule',
        'Target level cannot be lower than current assessed level.'
      );
    }
  }
}
