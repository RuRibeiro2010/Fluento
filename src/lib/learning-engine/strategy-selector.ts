/**
 * FLUENTO LEARNING ENGINE - STRATEGY SELECTOR
 * 
 * Selects pedagogical and behavioral teaching strategies based on student state,
 * anxiety level, energy, available time, and learning goals.
 * Strictly adheres to FLUENTO_PLAYBOOK.md and TEACHER_GUIDELINES.md.
 */

import { StudentLearningState, TeachingStrategy, DecisionContext } from './types';

export class StrategySelector {
  /**
   * Selects the optimal TeachingStrategy for the given student state & context.
   */
  public selectStrategy(context: DecisionContext): TeachingStrategy {
    const { studentState, memoryThreads } = context;
    const { energyLevel, speakingAnxietyLevel, availableMinutes, daysSinceLastSession } = studentState;

    // 1. High Anxiety / Fear of Speaking Override
    if (speakingAnxietyLevel >= 65) {
      return {
        id: 'strat_anxiety_deescalation',
        name: 'Descalada de Ansiedade & Confiança',
        description: 'Foco prioritário na redução do filtro afetivo. Perguntas simples, sem pressão de tempo, recasting 100% involuntário e validação empática.',
        scaffoldingLevel: 'high',
        recastingMode: 'involuntary_continuous',
        immersionTargetPercent: Math.min(70, Math.max(50, 100 - speakingAnxietyLevel / 2)),
        targetStudentTalkTimeRatio: 60,
        waitTimeSeconds: 5,
        errorTolerance: 'high',
        tone: 'warm_supportive',
        forbiddenBehaviours: [
          'Corrigir erros gramaticais de forma direta ou abrupta',
          'Apressar respostas antes dos 5 segundos de silêncio',
          'Usar perguntas abertas demasiado complexas ou abstratas',
          'Fazer listas de erros cometidos'
        ]
      };
    }

    // 2. Absence Recovery Strategy (Returning after long gap)
    if (daysSinceLastSession >= 14) {
      return {
        id: 'strat_absence_recovery',
        name: 'Acolhimento de Regresso sem Culpa',
        description: 'Acolhimento caloroso sem qualquer menção a falhas ou perda de streaks. Conversa leve para reativar a memória muscular sem exaustão.',
        scaffoldingLevel: 'high',
        recastingMode: 'involuntary_continuous',
        immersionTargetPercent: 75,
        targetStudentTalkTimeRatio: 65,
        waitTimeSeconds: 4,
        errorTolerance: 'high',
        tone: 'gentle_recovery',
        forbiddenBehaviours: [
          'Questionar a ausência do aluno',
          'Ameaçar com perda de streaks ou pontuação',
          'Aplicar testes de verificação pesados no acolhimento'
        ]
      };
    }

    // 3. Exhaustion / Low Energy Strategy
    if (energyLevel <= 3) {
      return {
        id: 'strat_low_energy_casual',
        name: 'Conversa Leve de Baixa Carga Cognitiva',
        description: 'Ajuste para acolher o cansaço do aluno. Redução da complexidade em 50%, foco em tópicos agradáveis e escuta atenta.',
        scaffoldingLevel: 'medium',
        recastingMode: 'involuntary_continuous',
        immersionTargetPercent: 70,
        targetStudentTalkTimeRatio: 60,
        waitTimeSeconds: 4,
        errorTolerance: 'high',
        tone: 'calm_professional',
        forbiddenBehaviours: [
          'Forçar lições gramaticais densas',
          'Exigir produção de texto longa',
          'Usar entusiasmo artificial ou ruidoso'
        ]
      };
    }

    // 4. Micro-Learning / Time-Constrained Strategy (< 10 minutes)
    if (availableMinutes <= 10) {
      return {
        id: 'strat_surgical_microlearning',
        name: 'Micro-Aprendizagem Cirúrgica',
        description: 'Sessão ultracurta com foco direto num único micro-objetivo prático de aplicação imediata.',
        scaffoldingLevel: 'medium',
        recastingMode: 'involuntary_continuous',
        immersionTargetPercent: 85,
        targetStudentTalkTimeRatio: 70,
        waitTimeSeconds: 3,
        errorTolerance: 'medium',
        tone: 'calm_professional',
        forbiddenBehaviours: [
          'Introduções demoradas ou conversa fiada longa',
          'Apresentar mais de um conceito novo',
          'Monólogos explicativos do professor'
        ]
      };
    }

    // 5. High Energy & High Confidence -> Challenge & Fluency Flow
    if (energyLevel >= 8 && studentState.confidenceScores.overall >= 70) {
      return {
        id: 'strat_high_fluency_challenge',
        name: 'Fluência & Desafio de Comunicação Real',
        description: 'Imersão elevada com debates, cenários do mundo real e refinamento de nuances e vocabulário avançado.',
        scaffoldingLevel: 'low',
        recastingMode: 'selective_end_of_turn',
        immersionTargetPercent: 95,
        targetStudentTalkTimeRatio: 75,
        waitTimeSeconds: 3,
        errorTolerance: 'medium',
        tone: 'energetic_encouraging',
        forbiddenBehaviours: [
          'Interromper o raciocínio a meio da frase',
          'Dar respostas feitas antes de o aluno tentar',
          'Usar vocabulário demasiado simples sem nuance'
        ]
      };
    }

    // Default Balanced Strategy
    return {
      id: 'strat_balanced_human_teaching',
      name: 'Ensino Humano Equilibrado',
      description: 'Estratégia padrão do Fluento: diálogo fluido, suporte moderado, recasting natural e escuta ativa de excelência.',
      scaffoldingLevel: 'medium',
      recastingMode: 'involuntary_continuous',
      immersionTargetPercent: 85,
      targetStudentTalkTimeRatio: 65,
      waitTimeSeconds: 4,
      errorTolerance: 'medium',
      tone: 'warm_supportive',
      forbiddenBehaviours: [
        'Comportar-se como chatbot ou assistente virtual',
        'Falar mais do que 40% do tempo total',
        'Ignorar o tempo de espera de silêncio'
      ]
    };
  }
}

export const strategySelector = new StrategySelector();
