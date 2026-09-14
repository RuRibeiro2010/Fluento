/**
 * Módulo 8: Metacognition Engine
 * Prompts post-lesson self-reflection and processes metacognitive feedback
 * to adapt the student's learning model.
 */

export interface MetacognitiveReflection {
  whatWasLearned: string;
  whatWasMostDifficult: string;
  perceivedDoubts: string;
}

export interface ProcessedMetacognitiveInsights {
  identifiedFocusAreas: string[];
  selfAwarenessScore: number; // 0 to 100
  pedagogicalAdjustmentNeeded: string;
}

export function generateMetacognitivePrompts(): {
  learnedPrompt: string;
  difficultPrompt: string;
  doubtsPrompt: string;
} {
  return {
    learnedPrompt: 'O que aprendeste hoje de mais valioso?',
    difficultPrompt: 'Qual foi o conceito ou momento mais difícil da aula?',
    doubtsPrompt: 'Em que aspeto sentes que ainda tens dúvidas para aplicar no mundo real?',
  };
}

export function processMetacognitiveFeedback(
  reflection: MetacognitiveReflection
): ProcessedMetacognitiveInsights {
  const focusAreas: string[] = [];

  if (reflection.whatWasMostDifficult.length > 3) {
    focusAreas.push(reflection.whatWasMostDifficult);
  }
  if (reflection.perceivedDoubts.length > 3) {
    focusAreas.push(reflection.perceivedDoubts);
  }

  const selfAwarenessScore = Math.min(
    100,
    30 + (reflection.whatWasLearned.length > 10 ? 30 : 10) + (reflection.whatWasMostDifficult.length > 10 ? 40 : 10)
  );

  return {
    identifiedFocusAreas: focusAreas.length > 0 ? focusAreas : ['Reforço de vocabulário e fluência geral'],
    selfAwarenessScore,
    pedagogicalAdjustmentNeeded: focusAreas.length > 0
      ? `Ajustar próximas aulas para focar em: ${focusAreas.join(', ')}.`
      : 'Manter plano de estudo atual com aumento gradual de complexidade.',
  };
}
