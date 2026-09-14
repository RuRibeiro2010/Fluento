/**
 * Multi-Horizon Planner (Sprint A)
 * Projects student progression across 4 long-term timeframes:
 * - 1 Week
 * - 1 Month
 * - 3 Months
 * - 6 Months
 *
 * SAFETY & PEDAGOGICAL GUARANTEES:
 * - Predictions are strictly probabilistic (e.g., 85% confidence range).
 * - Never imposes artificial limits or fixed intelligence labels on the student.
 * - Always models growth as an evolving continuum.
 */

import { HorizonProjections, HorizonProjection } from './journey-orchestrator-types';

export interface HorizonPlannerInput {
  currentCEFR: string;
  targetCEFR: string;
  weeklyPracticeHours: number;
  recentAccuracyPercentage: number; // 0-100
  streakDays: number;
  activeGoalTitle: string;
}

export class HorizonPlanner {
  /**
   * Generates dynamic multi-horizon projections.
   */
  public static calculateHorizons(input: HorizonPlannerInput): HorizonProjections {
    const current = input.currentCEFR || 'A2';
    const accuracy = input.recentAccuracyPercentage || 75;
    const hoursPerWeek = Math.max(0.5, input.weeklyPracticeHours || 2.5);

    // Estimate progress velocity coefficient
    const velocityCoef = (accuracy / 100) * (hoursPerWeek / 3.0);

    const oneWeek: HorizonProjection = {
      timeframe: '1_week',
      targetCEFR: current,
      estimatedMasteryPercentage: Math.min(100, Math.round(65 + velocityCoef * 10)),
      forecastedMilestones: ['Manter diálogo de 5 min sem hesitação', 'Revisar 100% dos itens agendados'],
      probabilisticSuccessRate: Math.min(0.98, Math.max(0.70, 0.85 + (input.streakDays > 3 ? 0.08 : 0))),
      keyRiskFactors: input.streakDays < 3 ? ['Interrupção de consistência diária'] : [],
    };

    const oneMonth: HorizonProjection = {
      timeframe: '1_month',
      targetCEFR: current === 'A1' ? 'A2' : current === 'A2' ? 'B1' : 'B2',
      estimatedMasteryPercentage: Math.min(100, Math.round(75 + velocityCoef * 18)),
      forecastedMilestones: ['Escrever e-mail profissional com clareza', 'Simular reunião de trabalho de 10 min'],
      probabilisticSuccessRate: 0.88,
      keyRiskFactors: ['Aumento de carga cognitiva em conjugações complexas'],
    };

    const threeMonths: HorizonProjection = {
      timeframe: '3_months',
      targetCEFR: input.targetCEFR || 'B2',
      estimatedMasteryPercentage: Math.min(100, Math.round(82 + velocityCoef * 25)),
      forecastedMilestones: [
        `Conduzir entrevista de emprego / apresentação para "${input.activeGoalTitle}"`,
        'Compreensão de podcasts sem legenda',
      ],
      probabilisticSuccessRate: 0.82,
      keyRiskFactors: ['Manter frequência de prática espaçada'],
    };

    const sixMonths: HorizonProjection = {
      timeframe: '6_months',
      targetCEFR: input.targetCEFR === 'B1' ? 'B2' : 'C1',
      estimatedMasteryPercentage: Math.min(100, Math.round(90 + velocityCoef * 30)),
      forecastedMilestones: [
        'Autonomia e fluência profissional espontânea',
        'Participação ativa em debates e negociações sem preparação prévia',
      ],
      probabilisticSuccessRate: 0.78,
      keyRiskFactors: ['Manter imersão contínua em contextos diversificados'],
    };

    return {
      oneWeek,
      oneMonth,
      threeMonths,
      sixMonths,
    };
  }
}
