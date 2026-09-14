import { BusinessRuleViolationError } from '../../shared/domain-error';

export class AiRules {
  public static validateTemperature(temperature: number): void {
    if (temperature < 0.0 || temperature > 2.0) {
      throw new BusinessRuleViolationError(
        'AiTemperatureRule',
        'AI generation temperature must be between 0.0 and 2.0.'
      );
    }
  }
}
