/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - MOTIVATION PLANNER
 * 
 * Formulates motivational focus strategies and pedagogical driver messages.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { LearningAnalyticsReport } from '@/src/lib/learning-analytics';
import { MotivationStrategyConfig } from './types';

export class MotivationPlanner {
  public planMotivation(
    twin: StudentDigitalTwinState,
    analytics?: LearningAnalyticsReport
  ): MotivationStrategyConfig {
    const driver = twin.goal.primaryMotivation || twin.emotional.primaryMotivationDrivers[0] || 'personal_growth';

    if (analytics && analytics.anxietyTrend.trend === 'significantly_decreased') {
      return {
        driver,
        focusMessage: 'A sua ansiedade comunicativa diminuiu acentuadamente. Continue a arriscar no discurso espontâneo!',
        praiseTarget: 'Progresso em autonomia e redução do filtro afetivo'
      };
    }

    if (driver === 'career_advancement') {
      return {
        driver,
        focusMessage: 'Foco total em articulação clara para cenários profissionais e liderança de reuniões.',
        praiseTarget: 'Precisão e polidez no discurso de negócios'
      };
    }

    return {
      driver,
      focusMessage: 'Mantenha a consistência de prática ativa e foco na transferência pragmática de conceitos.',
      praiseTarget: 'Ritmo constante de evolução'
    };
  }
}

export const motivationPlanner = new MotivationPlanner();
