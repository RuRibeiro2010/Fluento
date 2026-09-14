import { BusinessRuleViolationError } from '../../shared/domain-error';
import { TeacherPersona } from '../value-objects/teacher-persona.vo';

export class TeacherRules {
  public static validateSpeechSpeedForBeginner(speechRate: number, isBeginner: boolean): void {
    if (isBeginner && speechRate > 1.0) {
      throw new BusinessRuleViolationError(
        'TeacherBeginnerSpeechRateRule',
        'Speech rate for beginner students (A1/A2) must not exceed 1.0x native speed.'
      );
    }
  }
}
