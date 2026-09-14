/**
 * Módulo 5: Cognitive Load Engine
 * Continuous assessment of cognitive strain, info density, user fatigue, and response latency.
 * Auto-chunks lessons when cognitive load thresholds are exceeded.
 */

import { getLearningScienceConfig } from './science-config';

export interface CognitiveLoadMetrics {
  infoUnitsCount: number;
  sessionDurationMinutes: number;
  averageResponseLatencyMs: number;
  errorRate: number; // 0.0 to 1.0
  perceivedFatigueScore?: number; // 0 to 100
}

export interface CognitiveLoadAnalysis {
  loadScore: number; // 0 to 100
  isOverloaded: boolean;
  recommendation: 'continue' | 'chunk_lesson' | 'offer_micro_break' | 'simplify_explanations';
  suggestedChunkCount: number;
}

export function evaluateCognitiveLoad(metrics: CognitiveLoadMetrics): CognitiveLoadAnalysis {
  const config = getLearningScienceConfig().cognitiveLoad;

  // Formula: Load = 0.35 * InfoDensity + 0.25 * DurationFactor + 0.25 * LatencyFactor + 0.15 * ErrorFactor
  const infoDensityRatio = Math.min(1.5, metrics.infoUnitsCount / config.maxInformationUnitsPerChunk);
  const durationFactor = Math.min(1.5, metrics.sessionDurationMinutes / config.fatigueThresholdMinutes);
  const latencyFactor = Math.min(1.5, metrics.averageResponseLatencyMs / 5000);

  const loadScore = Math.min(
    100,
    Math.round(
      (infoDensityRatio * 35) +
      (durationFactor * 25) +
      (latencyFactor * 25) +
      (metrics.errorRate * 15)
    )
  );

  const isOverloaded = loadScore >= config.chunkSplitThreshold;

  let recommendation: CognitiveLoadAnalysis['recommendation'] = 'continue';
  let suggestedChunkCount = 1;

  if (loadScore > 85) {
    recommendation = 'offer_micro_break';
    suggestedChunkCount = 3;
  } else if (isOverloaded) {
    recommendation = 'chunk_lesson';
    suggestedChunkCount = 2;
  } else if (metrics.errorRate > 0.4) {
    recommendation = 'simplify_explanations';
  }

  return {
    loadScore,
    isOverloaded,
    recommendation,
    suggestedChunkCount,
  };
}
