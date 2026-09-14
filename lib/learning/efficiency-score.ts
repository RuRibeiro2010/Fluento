/**
 * Módulo 10: Learning Efficiency Score (LES)
 * Internal composite evaluation engine (0 to 100) combining retention, accuracy,
 * time, effort, motivation, confidence, and fatigue to auto-tune future AI lessons.
 */

import { getLearningScienceConfig } from './science-config';

export interface InternalEfficiencyInputs {
  accuracyRate: number; // 0.0 to 1.0
  retentionRate: number; // 0.0 to 1.0
  confidenceScore: number; // 0 to 100
  averageSpeedSecondsPerQuestion: number;
  fatigueIndex: number; // 0 to 100
  effortIndex: number; // 0 to 100
}

export interface LearningEfficiencyResult {
  score: number; // 0 to 100
  efficiencyCategory: 'optimal_flow' | 'high_growth' | 'moderate_efficiency' | 'overloaded_friction';
  recommendedPaceAdjustment: 'accelerate' | 'maintain' | 'decelerate_support';
}

export function calculateLearningEfficiencyScore(
  inputs: InternalEfficiencyInputs
): LearningEfficiencyResult {
  const weights = getLearningScienceConfig().efficiencyScoreWeights;

  const speedScore = Math.max(0, Math.min(100, 100 - (inputs.averageSpeedSecondsPerQuestion - 5) * 5));

  const weightedSum =
    inputs.accuracyRate * 100 * weights.accuracy +
    inputs.retentionRate * 100 * weights.retention +
    inputs.confidenceScore * weights.confidence +
    speedScore * weights.speedEfficiency +
    inputs.effortIndex * weights.effortReward -
    inputs.fatigueIndex * weights.fatiguePenalty;

  const finalScore = Math.max(10, Math.min(100, Math.round(weightedSum)));

  let category: LearningEfficiencyResult['efficiencyCategory'] = 'high_growth';
  let pace: LearningEfficiencyResult['recommendedPaceAdjustment'] = 'maintain';

  if (finalScore >= 85) {
    category = 'optimal_flow';
    pace = 'accelerate';
  } else if (finalScore < 55) {
    category = 'overloaded_friction';
    pace = 'decelerate_support';
  }

  return {
    score: finalScore,
    efficiencyCategory: category,
    recommendedPaceAdjustment: pace,
  };
}
