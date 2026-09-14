import { BusinessRuleViolationError } from '../../shared/domain-error';

export class SessionRules {
  public static validateTurnLimits(currentTurnCount: number, maxTurns = 50): void {
    if (currentTurnCount >= maxTurns) {
      throw new BusinessRuleViolationError(
        'MaxSessionTurnsRule',
        `Session has reached maximum limit of ${maxTurns} turns.`
      );
    }
  }
}
