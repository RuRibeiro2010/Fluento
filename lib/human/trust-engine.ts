/**
 * Trust Engine Module (Fluento Human Experience - Phase 19)
 * Evaluates and fosters student psychological safety, lowering anxiety
 * and ensuring students feel safe making mistakes during speech practice.
 */

export interface PsychologicalSafetyAssessment {
  safetyIndexScore: number; // 0 to 100
  isSafeToMakeMistakes: boolean;
  recommendedTeacherAction: string;
}

export function evaluatePsychologicalSafety(
  hesitationCount: number,
  selfCorrectionAttempts: number,
  reportedAnxietyLevel: number // 1 to 10
): PsychologicalSafetyAssessment {
  let score = 100 - reportedAnxietyLevel * 7 - hesitationCount * 2 + selfCorrectionAttempts * 3;
  score = Math.max(10, Math.min(100, Math.round(score)));

  let action = 'Manter tom de suporte habitual.';
  if (score < 60) {
    action = 'Reforçar expressamente que o erro é parte ativa do processo de aprendizagem e que não há julgamentos.';
  }

  return {
    safetyIndexScore: score,
    isSafeToMakeMistakes: score >= 50,
    recommendedTeacherAction: action,
  };
}
