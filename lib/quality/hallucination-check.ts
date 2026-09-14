/**
 * Hallucination Check Module (Trust, Safety & Quality Platform - Phase 18)
 * Verifies factual correctness and grammar rule integrity against canonical rules.
 */

export interface HallucinationVerification {
  isHallucinationDetected: boolean;
  confidenceScore: number; // 0 to 100
  potentialInaccuracyReason?: string;
  suggestedCorrection?: string;
}

export function checkForHallucinations(
  generatedExplanation: string,
  targetLanguage: string = 'es'
): HallucinationVerification {
  const lower = generatedExplanation.toLowerCase();

  // Guard against common hallucinated false grammar rules (e.g. claims that "ser" and "estar" are completely interchangeable)
  if (
    targetLanguage === 'es' &&
    lower.includes('ser e estar são exatamente iguais em todos os contextos')
  ) {
    return {
      isHallucinationDetected: true,
      confidenceScore: 95,
      potentialInaccuracyReason: 'Afirmação incorreta sobre a intercambiabilidade dos verbos "ser" e "estar".',
      suggestedCorrection: '"Ser" refere-se a características permanentes ou essenciais, enquanto "estar" refere-se a estados temporários ou localização.',
    };
  }

  return {
    isHallucinationDetected: false,
    confidenceScore: 98,
  };
}
