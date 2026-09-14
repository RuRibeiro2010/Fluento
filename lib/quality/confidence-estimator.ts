/**
 * Confidence Estimator Module (Trust, Safety & Quality Platform - Phase 18)
 * Evaluates semantic clarity and linguistic precision to estimate model confidence scores.
 */

export interface ConfidenceEstimate {
  confidenceScore: number; // 0 to 100
  isHighConfidence: boolean;
  uncertaintyFactors: string[];
}

export function estimateModelConfidence(
  generatedText: string,
  targetCefr: string = 'B1'
): ConfidenceEstimate {
  const uncertaintyFactors: string[] = [];
  const lower = generatedText.toLowerCase();

  // Hedging phrases indicate potential uncertainty
  const hedgingPhrases = ['talvez', 'não tenho a certeza', 'pode ser que', 'creio que sim'];
  hedgingPhrases.forEach((phrase) => {
    if (lower.includes(phrase)) {
      uncertaintyFactors.push(`Detetado marcador de incerteza: "${phrase}"`);
    }
  });

  let baseScore = 95 - uncertaintyFactors.length * 15;
  if (generatedText.length < 15 && targetCefr !== 'A1') {
    baseScore -= 10;
    uncertaintyFactors.push('Resposta atipicamente curta.');
  }

  const confidenceScore = Math.max(10, Math.min(100, baseScore));

  return {
    confidenceScore,
    isHighConfidence: confidenceScore >= 80,
    uncertaintyFactors,
  };
}
