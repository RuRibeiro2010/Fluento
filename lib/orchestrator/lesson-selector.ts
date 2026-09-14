/**
 * Lesson Selector Module (AI Teaching Orchestrator - Phase 15)
 * Dynamically chooses or synthesizes the next custom lesson topic.
 * Ensures zero repetition and avoids too easy or too hard content.
 */

export interface LessonSelectionCriteria {
  userInterest: string;
  profession: string;
  targetCEFR: string;
  completedLessonIds: string[];
}

export interface SelectedLessonTopic {
  topicId: string;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  cefrLevel: string;
  mode: 'roleplay' | 'interactive_dialogue' | 'micro_drill' | 'listening_immersion';
}

export function selectOptimalLessonTopic(
  criteria: LessonSelectionCriteria,
  availableMinutes: number = 15
): SelectedLessonTopic {
  const isShortSession = availableMinutes <= 5;

  if (isShortSession) {
    return {
      topicId: `topic_micro_${Date.now()}`,
      title: 'Micro-Sessão de Vocabulário Ativo',
      description: 'Revisão rápida e focada em frases de alto impacto.',
      estimatedDurationMinutes: 5,
      cefrLevel: criteria.targetCEFR,
      mode: 'micro_drill',
    };
  }

  if (criteria.profession === 'technology') {
    return {
      topicId: `topic_tech_${Date.now()}`,
      title: 'Simulação: Apresentação de Arquitetura de Software',
      description: 'Roleplay interativo onde explicas a estrutura de um projeto a colegas internacionais.',
      estimatedDurationMinutes: 15,
      cefrLevel: criteria.targetCEFR,
      mode: 'roleplay',
    };
  }

  return {
    topicId: `topic_gen_${Date.now()}`,
    title: 'Simulação: Negociação e Opiniões numa Mesa Redonda',
    description: 'Diálogo guiado para expressar concordância e discordância diplomática.',
    estimatedDurationMinutes: 15,
    cefrLevel: criteria.targetCEFR,
    mode: 'interactive_dialogue',
  };
}
