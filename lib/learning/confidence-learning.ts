/**
 * Módulo 6: Confidence-Based Learning Engine
 * Ensures correct answers backed by low confidence or guessing are marked as needing
 * further consolidation, avoiding false positives in mastery tracking.
 */

export interface ConfidenceAssessment {
  userAnsweredCorrectly: boolean;
  selfReportedConfidence: 'certain' | 'somewhat_sure' | 'guessed';
  responseSpeedMs: number;
}

export interface MasteryAdjustment {
  isMasteryConfirmed: boolean;
  effectiveConfidenceScore: number; // 0 to 100
  needsFurtherConsolidation: boolean;
  pedagogicalNote: string;
}

export function evaluateConfidenceBasedMastery(
  assessment: ConfidenceAssessment
): MasteryAdjustment {
  if (!assessment.userAnsweredCorrectly) {
    return {
      isMasteryConfirmed: false,
      effectiveConfidenceScore: 20,
      needsFurtherConsolidation: true,
      pedagogicalNote: 'Resposta incorreta. Agendado para reforço focado.',
    };
  }

  let effectiveScore = 90;
  if (assessment.selfReportedConfidence === 'guessed') {
    effectiveScore = 40;
  } else if (assessment.selfReportedConfidence === 'somewhat_sure') {
    effectiveScore = 65;
  }

  // Latency check: If response took > 8 seconds, reduce effective confidence
  if (assessment.responseSpeedMs > 8000) {
    effectiveScore = Math.max(30, effectiveScore - 20);
  }

  const isConfirmed = effectiveScore >= 80;

  return {
    isMasteryConfirmed: isConfirmed,
    effectiveConfidenceScore: effectiveScore,
    needsFurtherConsolidation: !isConfirmed,
    pedagogicalNote: isConfirmed
      ? 'Acerto com elevadas certezas. Item adicionado à consolidação avançada.'
      : 'Acerto com baixa certeza ou hesitação. Mantido no ciclo de prática ativa para reforçar certezas.',
  };
}
