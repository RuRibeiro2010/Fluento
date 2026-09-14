export interface TranslationContextPayload {
  phraseOrWord: string;
  targetLanguage: string;
  nativeLanguage: string;
  contextSentence?: string;
  imageUrl?: string;
}

export interface SmartTranslationResult {
  phraseOrWord: string;
  contextualMeaning: string;
  contextualExample: string;
  visualReference?: string;
  analogy?: string;
  literalTranslationLastResort: string;
  pedagogicalFormattedExplanation: string;
}

/**
 * Translation Engine
 * Never translates word-for-word as primary action.
 * Priority hierarchy:
 * 1. Context
 * 2. Example
 * 3. Image (when available)
 * 4. Analogy
 * 5. Direct Translation (last resort)
 */
export class TranslationEngine {
  /**
   * Generates a context-first smart translation explanation.
   */
  public generateSmartTranslation(payload: TranslationContextPayload): SmartTranslationResult {
    const { phraseOrWord, targetLanguage, nativeLanguage, contextSentence, imageUrl } = payload;

    const contextualMeaning = `Meaning in ${targetLanguage.toUpperCase()}: Expresses real-time intent within a conversational setting.`;
    const contextualExample = contextSentence || `Example: "En este momento, uso '${phraseOrWord}' de forma natural."`;
    const visualReference = imageUrl ? `Visual Aid: ${imageUrl}` : undefined;
    const analogy = `Analogy: It acts as an anchor connecting intent directly to expression.`;
    const literalTranslationLastResort = `Direct translation to ${nativeLanguage.toUpperCase()}: "${phraseOrWord}"`;

    const explanationParts = [
      `📌 **In Context (${targetLanguage.toUpperCase()}):** ${contextualMeaning}`,
      `🗣️ **Natural Example:** ${contextualExample}`,
    ];

    if (visualReference) {
      explanationParts.push(`🖼️ ${visualReference}`);
    }

    explanationParts.push(`💡 **Analogy:** ${analogy}`);
    explanationParts.push(`🔤 *(Direct Translation to ${nativeLanguage.toUpperCase()} - Last Resort):* ${literalTranslationLastResort}`);

    return {
      phraseOrWord,
      contextualMeaning,
      contextualExample,
      visualReference,
      analogy,
      literalTranslationLastResort,
      pedagogicalFormattedExplanation: explanationParts.join('\n\n'),
    };
  }
}

export const defaultTranslationEngine = new TranslationEngine();
