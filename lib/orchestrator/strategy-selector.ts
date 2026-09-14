/**
 * Strategy Selector Module (AI Teaching Orchestrator - Phase 15)
 * Selects pedagogical delivery strategies tailored to student state.
 */

import { StudentLearningState } from './learning-state';

export type PedagogicalStrategy =
  | 'Socratic_Guidance'
  | 'Direct_Instruction'
  | 'Immersive_Roleplay'
  | 'Gentle_Confidence_Building'
  | 'Rapid_Review'
  | 'Passive_Recovery_Immersion';

export interface StrategyDecision {
  strategy: PedagogicalStrategy;
  pacingTempo: 'slow_relaxed' | 'moderate' | 'brisk_high_energy';
  correctionStrictness: 'gentle_minimal' | 'selective' | 'thorough';
}

export function selectPedagogicalStrategy(studentState: StudentLearningState): StrategyDecision {
  switch (studentState) {
    case 'Burnout Risk':
    case 'Recovery Mode':
    case 'Mentally Tired':
      return {
        strategy: 'Passive_Recovery_Immersion',
        pacingTempo: 'slow_relaxed',
        correctionStrictness: 'gentle_minimal',
      };

    case 'Needs Confidence':
      return {
        strategy: 'Gentle_Confidence_Building',
        pacingTempo: 'slow_relaxed',
        correctionStrictness: 'gentle_minimal',
      };

    case 'Needs Review':
      return {
        strategy: 'Rapid_Review',
        pacingTempo: 'moderate',
        correctionStrictness: 'selective',
      };

    case 'Ready for Challenge':
    case 'Flow State':
    case 'High Performance':
      return {
        strategy: 'Immersive_Roleplay',
        pacingTempo: 'brisk_high_energy',
        correctionStrictness: 'thorough',
      };

    default:
      return {
        strategy: 'Socratic_Guidance',
        pacingTempo: 'moderate',
        correctionStrictness: 'selective',
      };
  }
}
