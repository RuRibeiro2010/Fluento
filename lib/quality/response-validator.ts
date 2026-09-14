/**
 * Response Validator Module (Trust, Safety & Quality Platform - Phase 18)
 * Complete pre-flight validation pipeline inspecting coherence, naturalness,
 * CEFR level match, grammar correctness, and structural length.
 */

import { evaluateContentSafety } from './safety-engine';
import { validatePedagogicalAlignment } from './pedagogy-validator';
import { validateExplanationQuality } from './explanation-validator';

export interface PreflightValidationReport {
  isApproved: boolean;
  qualityScore: number; // 0 to 100
  safetyPassed: boolean;
  pedagogyPassed: boolean;
  explanationPassed: boolean;
  rejectionReasons: string[];
}

export function validateGeneratedResponse(
  responseContent: string,
  lessonObjective: string = 'Prática Geral',
  targetCefr: string = 'B1'
): PreflightValidationReport {
  const rejectionReasons: string[] = [];

  const safety = evaluateContentSafety(responseContent);
  if (!safety.isSafe) {
    rejectionReasons.push('Falha na verificação de segurança de conteúdos.');
  }

  const pedagogy = validatePedagogicalAlignment(responseContent, lessonObjective, targetCefr);
  if (!pedagogy.isPedagogicallySound) {
    rejectionReasons.push('Alinhamento pedagógico sub-ótimo.');
  }

  const explanation = validateExplanationQuality(responseContent, targetCefr);
  if (!explanation.isValid) {
    rejectionReasons.push('Explicação demasiado técnica ou sem exemplos.');
  }

  const overallScore = Math.round((pedagogy.score + explanation.cefrAppropriatenessScore) / 2);
  const isApproved = safety.isSafe && overallScore >= 70;

  return {
    isApproved,
    qualityScore: isApproved ? overallScore : Math.min(overallScore, 50),
    safetyPassed: safety.isSafe,
    pedagogyPassed: pedagogy.isPedagogicallySound,
    explanationPassed: explanation.isValid,
    rejectionReasons,
  };
}
