/**
 * Confidence Recovery Model (Student Digital Twin - Sprint 4)
 * Recognizes when a student has experienced multiple difficult sessions or high frustration.
 * Automatically activates Confidence Recovery Mode in subsequent sessions to:
 * - Reduce challenge level temporarily (-0.25 difficulty offset)
 * - Boost positive reinforcement and encouragement
 * - Focus on quick wins and mastered topics
 * - Restore confidence before scaling challenge back up.
 */

import { ConfidenceRecoveryState } from './digital-twin-types';

export interface ConfidenceRecoveryInput {
  currentConfidenceScore: number; // 0-100
  recentSessionScores: number[]; // e.g. [45, 50, 40]
  frustrationIndex: number; // 0-100
  perceivedFatigue: number; // 0-10
}

export class ConfidenceRecoveryEngine {
  private state: ConfidenceRecoveryState;

  constructor(initialState?: Partial<ConfidenceRecoveryState>) {
    this.state = {
      isInRecoveryMode: initialState?.isInRecoveryMode ?? false,
      consecutiveDifficultSessions: initialState?.consecutiveDifficultSessions ?? 0,
      recoverySessionsRemaining: initialState?.recoverySessionsRemaining ?? 0,
      recommendedDifficultyAdjustment: initialState?.recommendedDifficultyAdjustment ?? 0,
      encouragementBoostLevel: initialState?.encouragementBoostLevel || 'standard',
      quickWinsFocusArea: initialState?.quickWinsFocusArea || 'Revisão de Vocabulário Familiar',
      lastTriggerReason: initialState?.lastTriggerReason,
    };
  }

  public getState(): ConfidenceRecoveryState {
    return { ...this.state };
  }

  /**
   * Evaluates session telemetry and updates the Confidence Recovery State.
   */
  public evaluateAndTrigger(input: ConfidenceRecoveryInput): ConfidenceRecoveryState {
    const isRecentSessionDifficult =
      input.recentSessionScores.length > 0 &&
      input.recentSessionScores[input.recentSessionScores.length - 1] < 60;

    let consecutiveDifficult = this.state.consecutiveDifficultSessions;
    if (isRecentSessionDifficult) {
      consecutiveDifficult += 1;
    } else if (input.recentSessionScores.length > 0 && input.recentSessionScores[input.recentSessionScores.length - 1] >= 75) {
      consecutiveDifficult = Math.max(0, consecutiveDifficult - 1);
    }

    const isConfidenceDropped = input.currentConfidenceScore < 55;
    const isFrustrationHigh = input.frustrationIndex >= 65 || input.perceivedFatigue >= 8;

    const shouldActivateRecovery =
      consecutiveDifficult >= 2 || (isConfidenceDropped && isRecentSessionDifficult) || isFrustrationHigh;

    if (shouldActivateRecovery) {
      this.state = {
        isInRecoveryMode: true,
        consecutiveDifficultSessions: consecutiveDifficult,
        recoverySessionsRemaining: 2, // 2 sessions dedicated to recovery & quick wins
        recommendedDifficultyAdjustment: -0.25, // Lower difficulty for quick wins
        encouragementBoostLevel: isFrustrationHigh ? 'maximum' : 'high',
        quickWinsFocusArea: 'Consolidação de Conhecimentos Dominados & Diálogos Leves',
        lastTriggerReason: `Ativado devido a ${consecutiveDifficult} sessões exigentes e confiança reduzida (${input.currentConfidenceScore}%).`,
      };
    } else if (this.state.isInRecoveryMode) {
      // Decrement remaining recovery sessions if user had a good session
      const remaining = Math.max(0, this.state.recoverySessionsRemaining - 1);
      if (remaining === 0) {
        this.state = {
          isInRecoveryMode: false,
          consecutiveDifficultSessions: 0,
          recoverySessionsRemaining: 0,
          recommendedDifficultyAdjustment: 0,
          encouragementBoostLevel: 'standard',
          quickWinsFocusArea: 'Evolução Gradual',
          lastTriggerReason: 'Recuperação concluída com sucesso. Confiança restabelecida.',
        };
      } else {
        this.state.recoverySessionsRemaining = remaining;
      }
    }

    return { ...this.state };
  }
}
