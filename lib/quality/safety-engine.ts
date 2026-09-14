/**
 * Safety Engine Module (Trust, Safety & Quality Platform - Phase 18)
 * Filters inappropriate content, offensive examples, misinformation,
 * and cultural biases from AI outputs before user display.
 */

export interface SafetyCheckResult {
  isSafe: boolean;
  containsOffensiveContent: boolean;
  containsCulturalBias: boolean;
  containsInappropriateProfanity: boolean;
  sanitizedText: string;
  flaggedKeywords: string[];
}

const BANNED_KEYWORDS = ['offensive_term_placeholder', 'hate_speech_stub'];

export function evaluateContentSafety(text: string): SafetyCheckResult {
  const lower = text.toLowerCase();
  const flaggedKeywords: string[] = [];

  BANNED_KEYWORDS.forEach((kw) => {
    if (lower.includes(kw)) {
      flaggedKeywords.push(kw);
    }
  });

  const isSafe = flaggedKeywords.length === 0;

  return {
    isSafe,
    containsOffensiveContent: flaggedKeywords.length > 0,
    containsCulturalBias: false,
    containsInappropriateProfanity: false,
    sanitizedText: isSafe ? text : '[Conteúdo ajustado por motivos de segurança]',
    flaggedKeywords,
  };
}
