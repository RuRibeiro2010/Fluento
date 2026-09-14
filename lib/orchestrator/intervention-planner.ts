/**
 * Intervention Planner Module (AI Teaching Orchestrator - Phase 15)
 * Decides in real-time whether to offer dynamic hints, praise, or scaffolded support during lessons.
 */

export interface StudentTurnMetrics {
  hesitationSeconds: number;
  grammarErrorCount: number;
  pronunciationScore: number;
  consecutiveSuccessCount: number;
}

export interface InterventionPlan {
  shouldIntervene: boolean;
  interventionType: 'scaffold_hint' | 'praise_booster' | 'pace_slowdown' | 'none';
  suggestedPromptMessage?: string;
}

export function planRealtimeIntervention(metrics: StudentTurnMetrics): InterventionPlan {
  if (metrics.hesitationSeconds > 6) {
    return {
      shouldIntervene: true,
      interventionType: 'scaffold_hint',
      suggestedPromptMessage: 'Lembra-te do conector "Sin embargo" para introduzir um contraste.',
    };
  }

  if (metrics.consecutiveSuccessCount >= 4) {
    return {
      shouldIntervene: true,
      interventionType: 'praise_booster',
      suggestedPromptMessage: 'Excelente precisão! Vamos elevar ligeiramente a complexidade.',
    };
  }

  if (metrics.grammarErrorCount >= 2) {
    return {
      shouldIntervene: true,
      interventionType: 'pace_slowdown',
      suggestedPromptMessage: 'Vamos rever este verbo suavemente antes de avançar.',
    };
  }

  return {
    shouldIntervene: false,
    interventionType: 'none',
  };
}
