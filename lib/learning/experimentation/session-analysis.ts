/**
 * Session Analysis & Automatic Optimization Module
 * Analyzes post-session data (retention, duration, confidence, drop-off, LES)
 * and automatically updates the user's Personal Learning Profile without fixed static rules.
 */

import { PersonalLearningProfile, deriveTimeOfDay } from './personal-learning-profile';
import { SessionRecord, StrategyWeight, TimeOfDayWindow } from './strategy-types';
import { getExperimentationConfig } from './config';

export interface SessionAnalysisInput {
  sessionId: string;
  durationMinutes: number;
  completed: boolean;
  accuracyRate: number; // 0.0 to 1.0
  retentionScore: number; // 0 to 100
  confidenceScore: number; // 0 to 100
  learningEfficiencyScore: number; // LES 0 to 100
  appliedStrategy: SessionRecord['appliedStrategy'];
  targetSkill: string;
  perceivedChallenge?: number; // 0.0 to 1.0
  timestampMs?: number;
}

export function analyzeSessionAndUpdateProfile(
  profile: PersonalLearningProfile,
  input: SessionAnalysisInput
): PersonalLearningProfile {
  const config = getExperimentationConfig();
  const timestamp = input.timestampMs || Date.now();
  const timeOfDay = deriveTimeOfDay(timestamp);

  const newRecord: SessionRecord = {
    sessionId: input.sessionId,
    timestamp,
    timeOfDay,
    durationMinutes: input.durationMinutes,
    targetSkill: input.targetSkill,
    completed: input.completed,
    accuracyRate: input.accuracyRate,
    retentionScore: input.retentionScore,
    confidenceScore: input.confidenceScore,
    learningEfficiencyScore: input.learningEfficiencyScore,
    perceivedChallenge: input.perceivedChallenge ?? 0.70,
    appliedStrategy: input.appliedStrategy,
  };

  const updatedHistory = [newRecord, ...profile.sessionHistory].slice(0, 50); // Keep last 50 sessions

  // 1. Update Strategy Weights using Moving Average
  const updatedWeights = { ...profile.strategyWeights };
  const categories: Array<{ key: string; category: StrategyWeight['category']; id: string }> = [
    { key: `order:${input.appliedStrategy.order}`, category: 'order', id: input.appliedStrategy.order },
    { key: `modality:${input.appliedStrategy.modality}`, category: 'modality', id: input.appliedStrategy.modality },
    { key: `review:${input.appliedStrategy.reviewStyle}`, category: 'review', id: input.appliedStrategy.reviewStyle },
    { key: `explanation:${input.appliedStrategy.explanationType}`, category: 'explanation', id: input.appliedStrategy.explanationType },
  ];

  categories.forEach(({ key, category, id }) => {
    const prev = updatedWeights[key] || {
      strategyId: id,
      category,
      weight: 0.5,
      sampleCount: 0,
      avgEfficiencyScore: 75,
    };

    const newCount = prev.sampleCount + 1;
    const newAvg = Math.round(((prev.avgEfficiencyScore * prev.sampleCount) + input.learningEfficiencyScore) / newCount);
    const newWeight = Math.min(1.0, Math.max(0.1, newAvg / 100));

    updatedWeights[key] = {
      ...prev,
      sampleCount: newCount,
      avgEfficiencyScore: newAvg,
      weight: newWeight,
    };
  });

  // 2. Discover Best Session Length automatically
  let newOptimalSessionLength = profile.optimalSessionLengthMinutes;
  let newAttentionSpan = profile.attentionSpanMinutes;

  if (!input.completed && input.durationMinutes < profile.optimalSessionLengthMinutes) {
    // Drop-off occurred early: reduce session length target
    newOptimalSessionLength = Math.max(
      config.sessionOptimization.minSessionMinutes,
      Math.round(input.durationMinutes * 0.9)
    );
    newAttentionSpan = Math.max(5, Math.round(input.durationMinutes));
  } else if (input.completed && input.learningEfficiencyScore >= 80) {
    // High performance & completion: gradually expand capability
    newOptimalSessionLength = Math.min(
      config.sessionOptimization.maxSessionMinutes,
      profile.optimalSessionLengthMinutes + 1
    );
    newAttentionSpan = Math.max(profile.attentionSpanMinutes, input.durationMinutes + 2);
  }

  // 3. Discover Optimal Time of Day
  const timeOfDayStats: Record<TimeOfDayWindow, { totalLES: number; count: number }> = {
    morning: { totalLES: 0, count: 0 },
    afternoon: { totalLES: 0, count: 0 },
    evening: { totalLES: 0, count: 0 },
    night: { totalLES: 0, count: 0 },
  };

  updatedHistory.forEach((rec) => {
    timeOfDayStats[rec.timeOfDay].totalLES += rec.learningEfficiencyScore;
    timeOfDayStats[rec.timeOfDay].count += 1;
  });

  let bestTimeOfDay = profile.optimalTimeOfDay;
  let highestAvgLES = -1;

  (Object.keys(timeOfDayStats) as TimeOfDayWindow[]).forEach((tod) => {
    const stat = timeOfDayStats[tod];
    if (stat.count >= 2) {
      const avg = stat.totalLES / stat.count;
      if (avg > highestAvgLES) {
        highestAvgLES = avg;
        bestTimeOfDay = tod;
      }
    }
  });

  // 4. Discover Personal Challenge Level (Goldilocks Zone)
  let newChallengeLevel = profile.optimalChallengeLevel;
  if (input.accuracyRate > config.sessionOptimization.idealAccuracyUpperBound) {
    // Too easy, increase challenge slightly
    newChallengeLevel = Math.min(0.95, profile.optimalChallengeLevel + 0.03);
  } else if (input.accuracyRate < config.sessionOptimization.idealAccuracyLowerBound) {
    // Too difficult, decrease challenge slightly
    newChallengeLevel = Math.max(0.40, profile.optimalChallengeLevel - 0.04);
  }

  return {
    ...profile,
    updatedAtTimestamp: timestamp,
    optimalSessionLengthMinutes: newOptimalSessionLength,
    attentionSpanMinutes: newAttentionSpan,
    optimalTimeOfDay: bestTimeOfDay,
    optimalChallengeLevel: parseFloat(newChallengeLevel.toFixed(2)),
    strategyWeights: updatedWeights,
    sessionHistory: updatedHistory,
  };
}
