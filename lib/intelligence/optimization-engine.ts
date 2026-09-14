/**
 * Optimization Engine Module (Fluento Intelligence 1.0 - Phase 16)
 * Fine-tunes speech recognition tolerances, correction frequency,
 * and cognitive prompt difficulty during live sessions.
 */

export interface LiveSessionOptimizationParameters {
  speechToleranceLevel: 'lenient' | 'standard' | 'strict';
  correctionFrequency: 'minimal' | 'balanced' | 'comprehensive';
  promptScaffoldingLevel: 'high_support' | 'medium_hints' | 'unassisted';
}

export function optimizeSessionParameters(
  confidenceScore: number,
  fatigueScore: number,
  cefrLevel: string
): LiveSessionOptimizationParameters {
  if (fatigueScore >= 6 || confidenceScore <= 4) {
    return {
      speechToleranceLevel: 'lenient',
      correctionFrequency: 'minimal',
      promptScaffoldingLevel: 'high_support',
    };
  }

  if (cefrLevel === 'C1' || cefrLevel === 'C2') {
    return {
      speechToleranceLevel: 'strict',
      correctionFrequency: 'comprehensive',
      promptScaffoldingLevel: 'unassisted',
    };
  }

  return {
    speechToleranceLevel: 'standard',
    correctionFrequency: 'balanced',
    promptScaffoldingLevel: 'medium_hints',
  };
}
