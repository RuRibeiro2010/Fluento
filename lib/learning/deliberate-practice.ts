/**
 * Módulo 9: Deliberate Practice Engine
 * Generates highly focused exercises targeting top identified student weaknesses,
 * eliminating wasted time on already mastered concepts.
 */

import { LongitudinalMemory } from '@/types/coach';

export interface DeliberateExercise {
  id: string;
  targetWeakness: string;
  exercisePrompt: string;
  recommendedTimeSeconds: number;
  expectedOutputFormat: 'speaking' | 'writing' | 'choice';
}

export function generateDeliberatePracticeSet(
  memory?: LongitudinalMemory
): DeliberateExercise[] {
  if (!memory) return [];

  const exercises: DeliberateExercise[] = [];

  // Focus 1: Weak grammar
  if (memory.weakGrammar && memory.weakGrammar.length > 0) {
    memory.weakGrammar.forEach((g, idx) => {
      exercises.push({
        id: `dp-gram-${idx}-${Date.now()}`,
        targetWeakness: g.concept,
        exercisePrompt: `Exercício de Prática Deliberada: Crie 2 frases em contexto profissional utilizando corretamente "${g.concept}".`,
        recommendedTimeSeconds: 90,
        expectedOutputFormat: 'writing',
      });
    });
  }

  // Focus 2: Weak words
  if (memory.weakWords && memory.weakWords.length > 0) {
    memory.weakWords.forEach((w, idx) => {
      exercises.push({
        id: `dp-word-${idx}-${Date.now()}`,
        targetWeakness: w.word,
        exercisePrompt: `Prática Deliberada de Vocabulário: Pronuncie e insira "${w.word}" numa resposta de simulação de negociação.`,
        recommendedTimeSeconds: 60,
        expectedOutputFormat: 'speaking',
      });
    });
  }

  return exercises;
}
