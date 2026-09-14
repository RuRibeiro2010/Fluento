/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - FIXTURES
 * 
 * Mock adaptive learning plan fixtures for testing and development.
 */

import { AdaptiveLearningPlan } from './types';

export const mockAdaptiveLearningPlan: AdaptiveLearningPlan = {
  planId: 'plan_mock_s11_001',
  studentId: 'student_s11_test',
  generatedAtIso: new Date().toISOString(),
  recommendedDurationMinutes: 15,
  targetCefr: 'B2',
  primaryObjective: 'Aprimorar comunicação profissional no domínio de Gestão / Negócios',
  secondaryFocusAreas: [
    'Vocabulário corporativo',
    'Clareza em apresentações',
    'Polidez e registro formal'
  ],
  lessonMode: 'spontaneous_roleplay',
  scaffoldingLevel: 'moderate',
  difficultySetting: 'optimal_challenge',
  reviewItemsToCover: [],
  conversationScenario: {
    scenarioId: 'scen_exec_update',
    title: 'Atualização de Projeto para Direção',
    roleplayRole: 'Diretor / VP Executivo',
    contextDescription: 'Apresentar métricas chave, riscos e próximos passos de um projeto estratégico.',
    professionalDomain: 'Gestão / Negócios',
    suggestedCefr: 'B2'
  },
  tutorStyle: {
    pace: 'moderate',
    tone: 'encouraging',
    correctionStrategy: 'gentle_implicit'
  },
  motivationStrategy: {
    driver: 'career_advancement',
    focusMessage: 'Foco total em articulação clara para cenários profissionais e liderança de reuniões.',
    praiseTarget: 'Precisão e polidez no discurso de negócios'
  },
  recommendations: [
    'Incentivar expressão totalmente desassistida sem interrupções imediatas.',
    'Manter cadência confortável com validação positiva dos pontos fortes.'
  ],
  revision: 1
};
