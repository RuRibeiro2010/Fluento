import { AssessmentTurnResponse, AssessmentAiSelfValidation } from '../types';

/**
 * ASSESSMENT RULES SERVICE (Domain)
 * 
 * Contains pure deterministic business rules for language assessment scoring,
 * adaptive difficulty, and data sufficiency validation.
 */
export class AssessmentRulesService {
  /**
   * Calculates dynamic confidence score based on response speed, length, hesitations, and self-corrections.
   * Never penalizes students merely for initial nervousness.
   */
  public calculateConfidenceScore(turns: AssessmentTurnResponse[]): number {
    if (turns.length === 0) return 70;

    let confidenceTotal = 75;

    turns.forEach((turn) => {
      // Latency factor
      if (turn.responseTimeMs) {
        if (turn.responseTimeMs < 3000) confidenceTotal += 3;
        else if (turn.responseTimeMs > 9000) confidenceTotal -= 2;
      }

      // Length factor for speaking/writing
      if (turn.userResponseText) {
        const wordCount = turn.userResponseText.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount >= 8) confidenceTotal += 4;
        else if (wordCount <= 2) confidenceTotal -= 3;
      }

      // Hesitations & self-corrections
      if (turn.hesitationDetected) confidenceTotal -= 2;
      if (turn.selfCorrectionCount && turn.selfCorrectionCount > 0) {
        // Self correction shows metalinguistic awareness; slight positive boost
        confidenceTotal += 2;
      }
    });

    return Math.min(98, Math.max(45, confidenceTotal));
  }

  /**
   * Calculates dynamic adaptive difficulty step based on turn performance.
   */
  public calculateNextAdaptiveDifficulty(
    currentDifficulty: number,
    lastTurn: AssessmentTurnResponse
  ): number {
    let delta = 0;

    if (lastTurn.isOptionCorrect === true) {
      delta += 0.12;
    } else if (lastTurn.isOptionCorrect === false) {
      delta -= 0.08;
    }

    if (lastTurn.userResponseText) {
      const wordCount = lastTurn.userResponseText.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount >= 10) delta += 0.08;
      else if (wordCount <= 3) delta -= 0.05;
    }

    const next = currentDifficulty + delta;
    return Math.min(0.95, Math.max(0.2, Math.round(next * 100) / 100));
  }

  /**
   * AI Quality Gate: Validates if collected diagnostic information is sufficient across competencies.
   */
  public validateAssessmentDataSufficient(
    turns: AssessmentTurnResponse[]
  ): AssessmentAiSelfValidation {
    const evaluatedTypes = new Set(turns.map((t) => t.turnType));
    const requiredTypes = ['speaking', 'listening', 'reading', 'writing'];

    const missingTypes = requiredTypes.filter((type) => !evaluatedTypes.has(type as any));
    const isSufficient = turns.length >= 4 && missingTypes.length === 0;

    return {
      isInformationSufficient: isSufficient,
      underEvaluatedSkills: missingTypes,
      inconsistenciesDetected: false,
      confidenceInResultPercent: isSufficient ? 92 : 70,
      recommendedExtensionAction: !isSufficient
        ? 'Gostarias de continuar mais 2 minutos para tornar a tua avaliação ainda mais precisa?'
        : undefined,
    };
  }
}

export const assessmentRulesService = new AssessmentRulesService();
