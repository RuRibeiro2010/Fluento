/**
 * Habit Engine Module (Living Language Ecosystem - Phase 13)
 * Uses behavioral psychology (Habit Stacking & Cue-Routine-Reward)
 * to anchor micro-study sessions into existing daily habits without friction.
 */

export interface HabitAnchor {
  id: string;
  triggerCue: string;
  recommendedRoutine: string;
  rewardText: string;
  estimatedMinutes: number;
}

export const HABIT_ANCHORS: HabitAnchor[] = [
  {
    id: 'habit-1',
    triggerCue: 'Enquanto o café da manhã está a preparar',
    recommendedRoutine: 'Abre a app e completa 1 cartão de vocabulário expresso.',
    rewardText: 'Aproveita o teu café com a sensação de dever cumprido!',
    estimatedMinutes: 2,
  },
  {
    id: 'habit-2',
    triggerCue: 'Logo após lavar os dentes antes de deitar',
    recommendedRoutine: 'Ouve 1 áudio curto do Professor Virtual com legendas.',
    rewardText: 'Sólida consolidação de memória durante o sono profundo.',
    estimatedMinutes: 3,
  },
  {
    id: 'habit-3',
    triggerCue: 'No início da pausa para almoço',
    recommendedRoutine: 'Lê 1 curiosidade cultural rápida no Curiosity Engine.',
    rewardText: 'Inspirante e descontraído.',
    estimatedMinutes: 2,
  },
];

export function getHabitStackingSuggestions(): HabitAnchor[] {
  return HABIT_ANCHORS;
}
