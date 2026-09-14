/**
 * Personal Learning Profile Module
 * Maintains an evidence-based internal model of the student's unique cognitive profile.
 * Continuously updated after every session without fixed static rules.
 */

import {
  CoachPersonalityFit,
  ExplanationType,
  IncentiveType,
  PedagogicalOrder,
  ModalityFocus,
  ReviewStyle,
  SessionRecord,
  StrategyWeight,
  TimeOfDayWindow,
} from './strategy-types';

export interface PersonalLearningProfile {
  userId: string;
  updatedAtTimestamp: number;
  
  // Cognitive & Behavioral Parameters
  optimalSessionLengthMinutes: number; // Discovered ideal session duration
  attentionSpanMinutes: number; // Max high-focus duration before fatigue
  optimalTimeOfDay: TimeOfDayWindow; // Discovered peak learning window
  optimalChallengeLevel: number; // Goldilocks difficulty target (0.0 to 1.0, default 0.70)
  preferredPaceSpeed: 'relaxed' | 'steady' | 'accelerated';
  
  // Pedagogical Preferences & Discovered Weights
  coachPersonalityFit: CoachPersonalityFit;
  explanationPreference: ExplanationType;
  motivationIncentiveType: IncentiveType;
  
  strategyWeights: Record<string, StrategyWeight>;
  
  // Motivation & Memory History
  usedMotivationPhrases: string[]; // Hashes or texts to prevent exact duplicate incentives
  
  // Historical Performance Log
  sessionHistory: SessionRecord[];
}

export function createDefaultPersonalLearningProfile(userId: string): PersonalLearningProfile {
  return {
    userId,
    updatedAtTimestamp: Date.now(),
    optimalSessionLengthMinutes: 15,
    attentionSpanMinutes: 18,
    optimalTimeOfDay: 'morning',
    optimalChallengeLevel: 0.70,
    preferredPaceSpeed: 'steady',
    coachPersonalityFit: 'encouraging',
    explanationPreference: 'real_world_scenario',
    motivationIncentiveType: 'real_world_utility',
    strategyWeights: {
      'order:examples_first': { strategyId: 'examples_first', category: 'order', weight: 0.5, sampleCount: 0, avgEfficiencyScore: 75 },
      'order:theory_first': { strategyId: 'theory_first', category: 'order', weight: 0.5, sampleCount: 0, avgEfficiencyScore: 75 },
      'order:guided_discovery': { strategyId: 'guided_discovery', category: 'order', weight: 0.5, sampleCount: 0, avgEfficiencyScore: 75 },
      'modality:balanced': { strategyId: 'balanced', category: 'modality', weight: 0.5, sampleCount: 0, avgEfficiencyScore: 75 },
      'modality:speaking_heavy': { strategyId: 'speaking_heavy', category: 'modality', weight: 0.5, sampleCount: 0, avgEfficiencyScore: 75 },
      'explanation:real_world_scenario': { strategyId: 'real_world_scenario', category: 'explanation', weight: 0.5, sampleCount: 0, avgEfficiencyScore: 75 },
      'explanation:analogy': { strategyId: 'analogy', category: 'explanation', weight: 0.5, sampleCount: 0, avgEfficiencyScore: 75 },
    },
    usedMotivationPhrases: [],
    sessionHistory: [],
  };
}

export function deriveTimeOfDay(timestampMs: number = Date.now()): TimeOfDayWindow {
  const hour = new Date(timestampMs).getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 23) return 'evening';
  return 'night';
}
