/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - GOAL PRIORITIZER
 * 
 * Determines primary and secondary learning objectives for a session by analyzing
 * student goals, language profiles, and analytics reports.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { LearningAnalyticsReport } from '@/src/lib/learning-analytics';

export interface GoalPrioritizationResult {
  primaryObjective: string;
  secondaryFocusAreas: string[];
}

export class GoalPrioritizer {
  public prioritizeGoals(
    twin: StudentDigitalTwinState,
    analytics?: LearningAnalyticsReport
  ): GoalPrioritizationResult {
    const goals = twin.goal;
    const lang = twin.language;

    // High anxiety or low confidence -> prioritize confidence & fluency
    if (analytics && (analytics.anxietyTrend.affectiveFilterStatus === 'panic' || analytics.confidence.score < 50)) {
      return {
        primaryObjective: 'Desenvolver fluência comunicativa e desinibição oral em ambiente seguro',
        secondaryFocusAreas: ['Redução de ansiedade', 'Expressões de transição', 'Respostas automáticas']
      };
    }

    // Low retention -> prioritize spaced review & vocabulary consolidation
    if (analytics && analytics.retention.score < 55) {
      return {
        primaryObjective: 'Consolidar vocabulário e estruturas em risco de esquecimento (SRS)',
        secondaryFocusAreas: ['Recuperação ativa', 'Aplicação contextual de termos', 'Retenção a longo prazo']
      };
    }

    // Professional focus goal
    if (goals.primaryMotivation || goals.professionalDomain) {
      const domain = goals.professionalDomain || 'Negócios';
      return {
        primaryObjective: `Aprimorar comunicação profissional no domínio de ${domain}`,
        secondaryFocusAreas: ['Vocabulário corporativo', 'Clareza em apresentações', 'Polidez e registro formal']
      };
    }

    // General CEFR progression
    return {
      primaryObjective: `Expandir repertório comunicativo para o nível ${goals.targetCefrGoal}`,
      secondaryFocusAreas: [
        `Gramática nível ${lang.currentCefr}`,
        'Fluência e cadência de discurso',
        'Vocabulário prático'
      ]
    };
  }
}

export const goalPrioritizer = new GoalPrioritizer();
