import { BusinessRuleViolationError } from '../../shared/domain-error';

export class LessonRules {
  public static validateEstimatedDuration(minutes: number): void {
    if (minutes < 5 || minutes > 120) {
      throw new BusinessRuleViolationError(
        'LessonDurationRule',
        'Lesson estimated duration must be between 5 and 120 minutes.'
      );
    }
  }
}
