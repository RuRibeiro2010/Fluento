/**
 * Micro-Moments Module (Human Learning Experience - HLX)
 * Introduces spontaneous, human-like micro-moments during conversation
 * (idiomatic curiosities, authentic anecdotes, brief thoughtful pauses, language fun facts)
 * without derailing the main pedagogical goals.
 */

export interface MicroMoment {
  id: string;
  type: 'idiom_curiosity' | 'phonetic_fun_fact' | 'human_anecdote' | 'thoughtful_reflection';
  content: string;
  pedagogicalRelevance: string;
  estimatedDurationSeconds: number;
}

export const MICRO_MOMENTS_LIBRARY: MicroMoment[] = [
  {
    id: 'mm-1',
    type: 'idiom_curiosity',
    content: 'Sabias que em espanhol a expressão "Dar en el clavo" vem dos jogos antigos de pontaria com cravos de ferro?',
    pedagogicalRelevance: 'Enriquece o vocabulário idiomático de nível B1/B2.',
    estimatedDurationSeconds: 6,
  },
  {
    id: 'mm-2',
    type: 'phonetic_fun_fact',
    content: 'Repara como a letra "R" forte em espanhol vibra no mesmo ponto do céu da boca onde dizes a letra "D" em português!',
    pedagogicalRelevance: 'Facilita a colocação fonética imediata.',
    estimatedDurationSeconds: 7,
  },
  {
    id: 'mm-3',
    type: 'thoughtful_reflection',
    content: 'É fascinante como pensar noutra língua muda ligeiramente o nosso ritmo de raciocínio. Estás a adaptar-te muito bem!',
    pedagogicalRelevance: 'Fortalece a empatia e a autoconfiança.',
    estimatedDurationSeconds: 5,
  },
];

export function triggerMicroMoment(
  turnCount: number,
  recentMomentIds: string[] = []
): { shouldTrigger: boolean; moment: MicroMoment | null } {
  // Trigger roughly every 6-8 conversation turns
  if (turnCount > 0 && turnCount % 7 === 0) {
    const available = MICRO_MOMENTS_LIBRARY.filter((m) => !recentMomentIds.includes(m.id));
    const chosen = available.length > 0 ? available[0] : MICRO_MOMENTS_LIBRARY[0];
    return { shouldTrigger: true, moment: chosen };
  }

  return { shouldTrigger: false, moment: null };
}
