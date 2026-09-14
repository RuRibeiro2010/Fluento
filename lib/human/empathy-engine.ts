/**
 * Empathy Engine Module (Fluento Human Experience - Phase 19)
 * Modulates teacher tone and speech energy based on detected student emotional state
 * (calm when tired, challenging when motivated, reassuring when anxious).
 */

export type EmotionalToneAdjustment =
  | 'gentle_soothing'
  | 'encouraging_reassuring'
  | 'balanced_professional'
  | 'energetic_challenging';

export interface EmpathyGuidance {
  toneAdjustment: EmotionalToneAdjustment;
  recommendedPacingMultiplier: number;
  empathyStatementPrompt?: string;
}

export function determineEmpathicTone(
  studentFatigue: number,
  studentConfidence: number,
  isRecentSuccess: boolean
): EmpathyGuidance {
  if (studentFatigue >= 7) {
    return {
      toneAdjustment: 'gentle_soothing',
      recommendedPacingMultiplier: 0.85,
      empathyStatementPrompt: 'Nota-se que hoje tiveste um dia exigente. Vamos fazer uma sessão descontraída e sem pressas.',
    };
  }

  if (studentConfidence <= 4) {
    return {
      toneAdjustment: 'encouraging_reassuring',
      recommendedPacingMultiplier: 0.9,
      empathyStatementPrompt: 'Não te preocupes com pequenos erros — o objetivo aqui é apenas comunicar com confiança.',
    };
  }

  if (isRecentSuccess && studentConfidence >= 8) {
    return {
      toneAdjustment: 'energetic_challenging',
      recommendedPacingMultiplier: 1.1,
      empathyStatementPrompt: 'Estás num ritmo excelente! Vamos elevar ligeiramente a fasquia e tentar uma frase mais complexa.',
    };
  }

  return {
    toneAdjustment: 'balanced_professional',
    recommendedPacingMultiplier: 1.0,
  };
}
