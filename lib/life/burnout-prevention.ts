/**
 * Burnout Prevention Module (Living Language Ecosystem - Phase 13)
 * Monitors cognitive strain, streak pressure, and recent study session density.
 * Automatically adapts study load or shifts to "Recovery Mode" to ensure long-term retention.
 */

export interface StudentFatigueState {
  consecutiveDaysStudied: number;
  averageSessionDurationMinutes: number;
  perceivedCognitiveLoadScore: number; // 1 (Relaxed) to 10 (Overwhelmed)
  isRecoveryModeActive: boolean;
}

export interface BurnoutAssessment {
  burnoutRiskLevel: 'low' | 'moderate' | 'high';
  recommendedSessionMinutes: number;
  suggestedAction: string;
  enableRecoveryMode: boolean;
}

export function evaluateBurnoutRisk(state: StudentFatigueState): BurnoutAssessment {
  if (
    state.perceivedCognitiveLoadScore >= 8 ||
    (state.consecutiveDaysStudied > 14 && state.averageSessionDurationMinutes > 45)
  ) {
    return {
      burnoutRiskLevel: 'high',
      recommendedSessionMinutes: 5,
      suggestedAction:
        'Modo de Recuperação Ativado: Reduzimos as lições para 5 minutos de escuta passiva para proteger a tua motivação e memória.',
      enableRecoveryMode: true,
    };
  }

  if (state.perceivedCognitiveLoadScore >= 6) {
    return {
      burnoutRiskLevel: 'moderate',
      recommendedSessionMinutes: 10,
      suggestedAction:
        'Mantenha um ritmo leve hoje: foca-te em rever conceitos já conhecidos e celebra os teus progressos.',
      enableRecoveryMode: false,
    };
  }

  return {
    burnoutRiskLevel: 'low',
    recommendedSessionMinutes: 20,
    suggestedAction:
      'A tua energia e ritmo de estudo estão excelentes! Continuas na zona ideal de aprendizagem (State of Flow).',
    enableRecoveryMode: false,
  };
}
