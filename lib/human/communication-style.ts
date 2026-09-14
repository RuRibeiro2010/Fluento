/**
 * Communication Style Module (Fluento Human Experience - Phase 19)
 * Formats natural conversational register, turn-taking pacing,
 * active listening acknowledgments, and humanlike transitional phrasing.
 */

export interface ActiveListeningPhrase {
  acknowledgment: string;
  transitionalBridge: string;
}

export function generateActiveListeningBridge(
  studentInputText: string,
  targetLanguage: string = 'es'
): ActiveListeningPhrase {
  if (targetLanguage === 'es') {
    return {
      acknowledgment: 'Entiendo perfectamente tu punto.',
      transitionalBridge: 'Es interesante cómo lo has planteado. Siguiendo esa idea...',
    };
  }

  return {
    acknowledgment: 'Compreendo perfeitamente o teu ponto.',
    transitionalBridge: 'É interessante como estruturaste essa ideia. Aprofundando um pouco...',
  };
}
