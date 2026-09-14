/**
 * Módulo 1: Active Recall Engine
 * Scientifically transforms passive reading/learning items into active recall prompts
 * that force the brain to retrieve knowledge from memory before showing answers.
 */

export interface ActiveRecallPrompt {
  id: string;
  originalConcept: string;
  targetLanguage: string;
  nativeLanguage: string;
  promptQuestion: string;
  hint?: string;
  revealedAnswer: string;
  explanation: string;
  recalledSuccessfully?: boolean;
}

export function convertToActiveRecall(item: {
  concept: string;
  targetLanguage: string;
  nativeLanguage: string;
  translation: string;
  exampleSentence?: string;
  explanation?: string;
}): ActiveRecallPrompt {
  return {
    id: `ar-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    originalConcept: item.concept,
    targetLanguage: item.targetLanguage,
    nativeLanguage: item.nativeLanguage,
    promptQuestion: `Como se expressa "${item.translation}" em ${item.targetLanguage.toUpperCase()} no contexto de "${item.concept}" sem consultar os seus apontamentos?`,
    hint: item.exampleSentence ? `Dica de contexto: "${item.exampleSentence.replace(item.concept, '___')}"` : undefined,
    revealedAnswer: item.concept,
    explanation: item.explanation || `Ativação de memória para "${item.concept}": recorde primeiro, verifique depois.`,
  };
}

export function evaluateActiveRecallAttempt(
  userResponse: string,
  correctAnswer: string
): { isCorrect: boolean; similarityScore: number; feedback: string } {
  const normUser = userResponse.trim().toLowerCase();
  const normTarget = correctAnswer.trim().toLowerCase();

  if (normUser === normTarget) {
    return {
      isCorrect: true,
      similarityScore: 100,
      feedback: 'Recuperação perfeita da memória de longo prazo!',
    };
  }

  // Basic partial matching
  const containsWord = normTarget.includes(normUser) || normUser.includes(normTarget);
  if (containsWord && normUser.length > 2) {
    return {
      isCorrect: true,
      similarityScore: 80,
      feedback: 'Muito perto! Recuperação bem-sucedida com pequena variação.',
    };
  }

  return {
    isCorrect: false,
    similarityScore: 30,
    feedback: 'Não faz mal. O esforço de tentar recordar fortalece as sinapses para a próxima revisão.',
  };
}
