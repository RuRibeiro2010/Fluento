/**
 * Achievements Engine Module (Fluento Platform Ecosystem - Phase 17)
 * Focuses on meaningful, non-childish badges representing real pedagogical evolution,
 * cognitive retention milestones, spontaneous fluency, and professional mastery.
 */

export interface MasterAchievement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'spontaneous_speech' | 'memory_retention' | 'professional_fluency' | 'cultural_autonomy';
  requiredMilestoneValue: number;
  unlockedIso?: string;
}

export const MASTER_ACHIEVEMENTS_CATALOG: MasterAchievement[] = [
  {
    id: 'ach-1',
    code: 'SPONTANEOUS_FLUENCY_C1',
    title: 'Discurso Espontâneo C1',
    description: 'Manter 15 minutos de conversação contínua com menos de 2 hesitações por minuto.',
    category: 'spontaneous_speech',
    requiredMilestoneValue: 15,
  },
  {
    id: 'ach-2',
    code: 'LONG_TERM_MEMORY_1000',
    title: 'Domínio de 1.000 Expressões Ativas',
    description: 'Consolidar 1.000 unidades lexicais no sistema de memória de longo prazo com retenção >85%.',
    category: 'memory_retention',
    requiredMilestoneValue: 1000,
  },
  {
    id: 'ach-3',
    code: 'EXECUTIVE_NEGOTIATOR',
    title: 'Negociador Executivo',
    description: 'Completar 10 simulações de apresentações comerciais com argumentação e diplomacia em espanhol.',
    category: 'professional_fluency',
    requiredMilestoneValue: 10,
  },
  {
    id: 'ach-4',
    code: 'CULTURAL_AUTONOMY',
    title: 'Autonomia Cultural e Social',
    description: 'Compreender podcasts em velocidade nativa sem suporte de tradução.',
    category: 'cultural_autonomy',
    requiredMilestoneValue: 5,
  },
];

export function checkAndUnlockAchievements(
  userStats: {
    continuousConversationMinutes: number;
    activeLexiconCount: number;
    completedExecutiveSimulations: number;
    nativePodcastsCompleted: number;
  }
): MasterAchievement[] {
  return MASTER_ACHIEVEMENTS_CATALOG.map((ach) => {
    let unlocked = false;
    if (ach.code === 'SPONTANEOUS_FLUENCY_C1' && userStats.continuousConversationMinutes >= 15) {
      unlocked = true;
    } else if (ach.code === 'LONG_TERM_MEMORY_1000' && userStats.activeLexiconCount >= 1000) {
      unlocked = true;
    } else if (ach.code === 'EXECUTIVE_NEGOTIATOR' && userStats.completedExecutiveSimulations >= 10) {
      unlocked = true;
    } else if (ach.code === 'CULTURAL_AUTONOMY' && userStats.nativePodcastsCompleted >= 5) {
      unlocked = true;
    }

    return {
      ...ach,
      unlockedIso: unlocked ? new Date().toISOString() : undefined,
    };
  });
}
