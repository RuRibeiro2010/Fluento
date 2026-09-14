/**
 * Módulo 13: Explain Until Understood Engine
 * When a student struggles or clicks "Explica melhor", switches pedagogical strategy
 * completely using new examples, analogies, real-life scenarios, and temporary native language bridge.
 */

export interface ExplanationStrategy {
  attemptNumber: number;
  strategyName: 'simple_breakdown' | 'real_world_analogy' | 'native_bridge_contrast' | 'interactive_micro_dialogue';
  explanationText: string;
  analogy?: string;
  targetLanguageExample: string;
  nativeLanguageBridge?: string;
  returnToTargetPrompt: string;
}

export function generateMultiStrategyExplanation(
  concept: string,
  targetLanguage: string,
  nativeLanguage: string,
  attemptNumber: number = 1
): ExplanationStrategy {
  if (attemptNumber === 1) {
    return {
      attemptNumber: 1,
      strategyName: 'simple_breakdown',
      explanationText: `Em ${targetLanguage.toUpperCase()}, "${concept}" serve para conectar ideias com precisão sem fazer pausas artificiais.`,
      targetLanguageExample: `Ejemplo: "Desde mi punto de vista, la propuesta es sólida."`,
      returnToTargetPrompt: `Agora tenta repetir esta frase em voz alta para sentir a cadência natural.`,
    };
  }

  if (attemptNumber === 2) {
    return {
      attemptNumber: 2,
      strategyName: 'real_world_analogy',
      explanationText: `Pensa nesta estrutura como um pirilampo numa estrada escura: dá sinal aos ouvintes do que vais dizer antes de dizeres a opinião principal.`,
      analogy: `É a diferença entre entrar num escritório a gritar "Ideia nova!" e dizer suavemente "Gostaria de sugerir uma alternativa..."`,
      targetLanguageExample: `Ejemplo: "Quisiera proponer una alternativa."`,
      nativeLanguageBridge: `Em português equivale exatamente a "Gostaria de propor...".`,
      returnToTargetPrompt: `Regressando ao espanhol: como dirias "Gostaria de propor..." numa reunião?`,
    };
  }

  return {
    attemptNumber,
    strategyName: 'native_bridge_contrast',
    explanationText: `Ponte com a Língua Nativa: Vamos contrastar a forma direta com a diplomática.`,
    targetLanguageExample: `Direto: "No me gusta" vs Diplomático: "Desde mi punto de vista, podemos mejorar este aspecto."`,
    nativeLanguageBridge: `Usa o tom cortês quando quiseres negociar sem confrontar.`,
    returnToTargetPrompt: `Vamos praticar diretamente na língua alvo!`,
  };
}
