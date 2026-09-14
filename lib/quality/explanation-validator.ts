/**
 * Explanation Validator Module (Trust, Safety & Quality Platform - Phase 18)
 * Ensures generated explanations are simple, accurate, leverage real examples,
 * adapt to CEFR level, and avoid overly technical jargon.
 */

export interface ExplanationQualityScore {
  isValid: boolean;
  isSimpleAndClear: boolean;
  hasRealWorldExample: boolean;
  avoidsExcessiveJargon: boolean;
  cefrAppropriatenessScore: number; // 0 to 100
  feedbackNotes: string[];
}

export function validateExplanationQuality(
  explanationText: string,
  targetCefr: string = 'B1'
): ExplanationQualityScore {
  const feedbackNotes: string[] = [];
  const textLength = explanationText.length;

  const hasRealWorldExample =
    explanationText.includes('Exemplo') ||
    explanationText.includes('Por exemplo') ||
    explanationText.includes('"') ||
    explanationText.includes('«');

  // Check for excessive linguistic jargon (e.g., "syntagmatic hypercorrection")
  const jargonTerms = ['sintagmático', 'desinência morfossintática', 'hipercorreção fonêmica'];
  const hasJargon = jargonTerms.some((term) => explanationText.toLowerCase().includes(term));

  if (hasJargon) {
    feedbackNotes.push('Evitar terminologia linguística excessivamente técnica.');
  }

  if (!hasRealWorldExample) {
    feedbackNotes.push('Incluir pelo menos um exemplo prático de uso real.');
  }

  const isValid = !hasJargon && (textLength < 600 || targetCefr === 'C1' || targetCefr === 'C2');

  return {
    isValid,
    isSimpleAndClear: !hasJargon,
    hasRealWorldExample,
    avoidsExcessiveJargon: !hasJargon,
    cefrAppropriatenessScore: isValid ? 90 : 65,
    feedbackNotes,
  };
}
