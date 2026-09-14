/**
 * Adaptive Flow Module (Live Experience Engine)
 * Smoothly reduces or increases conversation difficulty during live dialogue based on real-time student performance,
 * avoiding abrupt or jarring shifts in complexity.
 */

export interface FlowPerformanceMetrics {
  rollingAccuracyRate: number; // 0.0 to 1.0
  averageLatencyMs: number;
  hesitationFrequency: number;
  perceivedConfidenceScore: number; // 0 to 100
  consecutiveSuccessTurns: number;
  consecutiveStruggleTurns: number;
}

export interface DifficultyFlowAdjustment {
  newDifficultyLevel: number; // 0.0 to 1.0
  adjustmentDirection: 'eased_support' | 'maintained_flow' | 'stepped_up_challenge';
  targetSentenceMaxWords: number;
  targetVocabularyTier: 'foundational' | 'intermediate' | 'advanced';
  pedagogicalRationale: string;
}

export function computeAdaptiveFlowAdjustment(
  currentDifficulty: number, // 0.0 to 1.0
  metrics: FlowPerformanceMetrics
): DifficultyFlowAdjustment {
  let nextDifficulty = currentDifficulty;
  let direction: DifficultyFlowAdjustment['adjustmentDirection'] = 'maintained_flow';
  let rationale = 'Manter o nível de fluxo e conforto atual do aluno.';

  // Check for easing need (High struggle: accuracy < 0.55 or latency > 6500ms or struggle turns >= 2)
  if (
    metrics.rollingAccuracyRate < 0.55 ||
    metrics.averageLatencyMs > 6500 ||
    metrics.consecutiveStruggleTurns >= 2
  ) {
    // Smooth, gradual decrease (max -0.05 per adjustment step)
    nextDifficulty = Math.max(0.25, parseFloat((currentDifficulty - 0.05).toFixed(2)));
    direction = 'eased_support';
    rationale = 'Suporte adaptativo: redução suave de complexidade sintática para aliviar a carga cognitiva.';
  } else if (
    metrics.rollingAccuracyRate > 0.85 &&
    metrics.perceivedConfidenceScore >= 80 &&
    metrics.consecutiveSuccessTurns >= 3
  ) {
    // Smooth, gradual increase (max +0.04 per adjustment step)
    nextDifficulty = Math.min(0.95, parseFloat((currentDifficulty + 0.04).toFixed(2)));
    direction = 'stepped_up_challenge';
    rationale = 'Desafio progressivo: aumento graduado na riqueza do vocabulário para manter o estado de fluxo.';
  }

  // Derive target parameters based on resulting difficulty score
  let maxWords = 14;
  let vocabTier: DifficultyFlowAdjustment['targetVocabularyTier'] = 'intermediate';

  if (nextDifficulty < 0.45) {
    maxWords = 9;
    vocabTier = 'foundational';
  } else if (nextDifficulty > 0.78) {
    maxWords = 22;
    vocabTier = 'advanced';
  }

  return {
    newDifficultyLevel: nextDifficulty,
    adjustmentDirection: direction,
    targetSentenceMaxWords: maxWords,
    targetVocabularyTier: vocabTier,
    pedagogicalRationale: rationale,
  };
}
