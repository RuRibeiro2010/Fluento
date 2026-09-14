/**
 * Safety & Experimentation Configuration
 * Centralized settings for evidence-based strategy exploration, safety bounds,
 * and multi-armed bandit parameters. Ensures learning quality is NEVER compromised.
 */

export interface ExperimentationConfig {
  safety: {
    minimumAllowedLES: number; // Safety floor for Learning Efficiency Score (e.g., 60)
    maxExplorationRate: number; // Epsilon-greedy rate cap (e.g., 0.15 = 15% exploration, 85% exploitation)
    minSampleCountForConfidence: number; // Min trials before declaring a strategy superior
    reversibilityThresholdLES: number; // If LES drops below this, auto-revert strategy
  };
  sessionOptimization: {
    minSessionMinutes: number; // e.g., 5 min
    maxSessionMinutes: number; // e.g., 45 min
    idealAccuracyLowerBound: number; // 0.65
    idealAccuracyUpperBound: number; // 0.85 (Zone of Proximal Development)
  };
}

export const DEFAULT_EXPERIMENTATION_CONFIG: ExperimentationConfig = {
  safety: {
    minimumAllowedLES: 60,
    maxExplorationRate: 0.12,
    minSampleCountForConfidence: 5,
    reversibilityThresholdLES: 55,
  },
  sessionOptimization: {
    minSessionMinutes: 8,
    maxSessionMinutes: 30,
    idealAccuracyLowerBound: 0.68,
    idealAccuracyUpperBound: 0.84,
  },
};

let activeExperimentConfig: ExperimentationConfig = { ...DEFAULT_EXPERIMENTATION_CONFIG };

export function getExperimentationConfig(): ExperimentationConfig {
  return activeExperimentConfig;
}

export function updateExperimentationConfig(partial: Partial<ExperimentationConfig>): ExperimentationConfig {
  activeExperimentConfig = {
    ...activeExperimentConfig,
    ...partial,
  };
  return activeExperimentConfig;
}

export function resetExperimentationConfig(): ExperimentationConfig {
  activeExperimentConfig = { ...DEFAULT_EXPERIMENTATION_CONFIG };
  return activeExperimentConfig;
}
