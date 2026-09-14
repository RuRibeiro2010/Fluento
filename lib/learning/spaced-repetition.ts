/**
 * Módulo 3: Advanced Spaced Repetition Engine (Dynamic SRS)
 * Uses dynamic Ebbinghaus forgetting curve modeling with variable stability factors
 * incorporating confidence ratings, error counts, response latency, and review history.
 */

import { getLearningScienceConfig } from './science-config';

export interface ItemMemoryState {
  itemId: string;
  concept: string;
  lastReviewedTimestamp: number; // Unix timestamp ms
  reviewCount: number;
  consecutiveSuccesses: number;
  totalErrors: number;
  lastConfidenceScore: number; // 0 to 100
  lastResponseSpeedMs: number;
  stabilityDays: number; // Stability metric S
}

export interface DecayEvaluation {
  itemId: string;
  currentForgettingProbability: number; // 0.0 to 1.0
  retainedPercent: number; // 0% to 100%
  recommendedReviewUrgency: 'critical' | 'high' | 'moderate' | 'optimal';
  nextOptimalReviewDays: number;
}

export function calculateDynamicStability(item: ItemMemoryState): number {
  const config = getLearningScienceConfig().spacedRepetition;

  let baseS = item.stabilityDays || config.initialStabilityDays;

  // Multiplier for consecutive successes
  const successMultiplier = Math.pow(1.5, Math.min(item.consecutiveSuccesses, 8));

  // Multiplier for confidence (0..100 -> 0.7..1.3)
  const confidenceFactor = 0.7 + (item.lastConfidenceScore / 100) * 0.6;

  // Penalty for errors
  const errorPenalty = Math.max(0.3, Math.pow(config.errorPenaltyMultiplier, item.totalErrors));

  // Speed factor: fast accurate responses (< 2500ms) increase stability
  const speedFactor = item.lastResponseSpeedMs < 2500 ? 1.15 : item.lastResponseSpeedMs > 8000 ? 0.85 : 1.0;

  return Math.max(0.5, baseS * successMultiplier * confidenceFactor * errorPenalty * speedFactor);
}

export function evaluateItemForgettingProbability(
  item: ItemMemoryState,
  currentTimestamp: number = Date.now()
): DecayEvaluation {
  const config = getLearningScienceConfig().spacedRepetition;

  const daysElapsed = Math.max(0, (currentTimestamp - item.lastReviewedTimestamp) / (1000 * 60 * 60 * 24));
  const stability = calculateDynamicStability(item);

  // Ebbinghaus equation: R = e^(-t / S)
  const retention = Math.exp(-daysElapsed / stability);
  const forgettingProb = 1 - retention;
  const retainedPercent = Math.round(retention * 100);

  let urgency: DecayEvaluation['recommendedReviewUrgency'] = 'optimal';
  if (retention < 0.6) urgency = 'critical';
  else if (retention < 0.75) urgency = 'high';
  else if (retention < config.targetRecallThreshold) urgency = 'moderate';

  const nextOptimalDays = Math.max(0.5, stability * Math.abs(Math.log(config.targetRecallThreshold)));

  return {
    itemId: item.itemId,
    currentForgettingProbability: parseFloat(forgettingProb.toFixed(3)),
    retainedPercent,
    recommendedReviewUrgency: urgency,
    nextOptimalReviewDays: parseFloat(nextOptimalDays.toFixed(1)),
  };
}
