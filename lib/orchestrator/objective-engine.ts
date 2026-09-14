/**
 * Objective Engine Module (AI Teaching Orchestrator - Phase 15)
 * Coordinates macro (quarterly/monthly) and micro (weekly/session) learning objectives.
 */

export interface LearningObjective {
  id: string;
  type: 'macro_goal' | 'weekly_milestone' | 'session_micro_objective';
  title: string;
  description: string;
  targetCefr: string;
  isCompleted: boolean;
}

export function generateSessionObjectives(
  userProfession: string = 'business',
  cefrLevel: string = 'B1',
  userState: string = 'Ready to Learn'
): LearningObjective[] {
  if (userState === 'Needs Confidence') {
    return [
      {
        id: 'obj-1',
        type: 'session_micro_objective',
        title: 'Fluidez e Segurança nas Saudações',
        description: 'Responder sem hesitação a 3 perguntas informais de aquecimento.',
        targetCefr: cefrLevel,
        isCompleted: false,
      },
    ];
  }

  if (userProfession === 'technology') {
    return [
      {
        id: 'obj-tech-1',
        type: 'session_micro_objective',
        title: 'Vocabulário de Standup Meeting',
        description: 'Explicar impedimentos técnicos e progresso de código em espanhol.',
        targetCefr: cefrLevel,
        isCompleted: false,
      },
    ];
  }

  return [
    {
      id: 'obj-gen-1',
      type: 'session_micro_objective',
      title: 'Comunicação Espontânea em Contexto Real',
      description: 'Manter diálogo fluido de 5 minutos utilizando conectores discourse.',
      targetCefr: cefrLevel,
      isCompleted: false,
    },
  ];
}
