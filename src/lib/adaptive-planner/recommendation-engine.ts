/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - RECOMMENDATION ENGINE
 * 
 * Generates tailored pedagogical recommendations for the student session based on
 * analytics metrics and difficulty planning.
 */

import { LearningAnalyticsReport } from '@/src/lib/learning-analytics';
import { ScaffoldingLevel, DifficultySetting } from './types';

export class RecommendationEngine {
  public generateRecommendations(
    analytics?: LearningAnalyticsReport,
    scaffolding?: ScaffoldingLevel,
    difficulty?: DifficultySetting
  ): string[] {
    const recs: string[] = [];

    if (scaffolding === 'high') {
      recs.push('Utilizar sugestões visuais de suporte durante hesitações prolongadas.');
    } else if (scaffolding === 'minimal') {
      recs.push('Incentivar expressão totalmente desassistida sem interrupções imediatas.');
    }

    if (analytics && analytics.retention.dueReviewItemsCount > 0) {
      recs.push(`Integrar ${analytics.retention.dueReviewItemsCount} itens pendentes de revisão SRS no fluxo natural da conversa.`);
    }

    if (difficulty === 'stretch') {
      recs.push('Desafiar com estruturas complexas e pedidos de clarificação Socrática.');
    } else {
      recs.push('Manter cadência confortável com validação positiva dos pontos fortes.');
    }

    return recs;
  }
}

export const recommendationEngine = new RecommendationEngine();
