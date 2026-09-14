/**
 * FLUENTO LEARNING ENGINE - LESSON BLUEPRINT GENERATOR
 * 
 * Constructs a structured, executable Lesson Blueprint from a PedagogicalDecision
 * and student state. Defines time allocations, micro-modules, scaffolding prompts,
 * and teacher execution rules for a session.
 */

import { StudentLearningState, PedagogicalDecision, LessonBlueprint, BlueprintModule } from './types';

export class LessonBlueprintGenerator {
  /**
   * Generates a complete LessonBlueprint from a PedagogicalDecision.
   */
  public generateBlueprint(
    decision: PedagogicalDecision,
    studentState: StudentLearningState
  ): LessonBlueprint {
    const timestampIso = new Date().toISOString();
    const blueprintId = `bp_${studentState.studentId}_${Date.now()}`;
    const totalDuration = decision.recommendedDurationMinutes;

    // Build modules based on focus and total duration
    const modules: BlueprintModule[] = [];

    // 1. Warm-up & Human Connection Module (Always 2-3 minutes)
    const warmupDuration = Math.min(3, Math.max(2, Math.round(totalDuration * 0.2)));
    modules.push({
      moduleId: `${blueprintId}_mod_warmup`,
      title: 'Acolhimento Humano & Conexão',
      moduleType: 'warmup_connection',
      durationMinutes: warmupDuration,
      objective: 'Acolher o aluno com tom humano, desativar o filtro afetivo e estabelecer o contexto da conversa.',
      instructionsForTeacher: 'Saudar com serenidade. Fazer uma pergunta simples sobre o dia ou interesse sem avaliar a exatidão inicial.',
      scaffoldingPrompts: [
        `How is your day going so far, ${studentState.studentId}?`,
        'Ready for a calm, friendly chat today?'
      ]
    });

    // 2. Core Practice Module
    const coreDuration = Math.max(3, Math.round(totalDuration * 0.5));
    modules.push({
      moduleId: `${blueprintId}_mod_core`,
      title: `Prática Core: ${decision.whatToTeach}`,
      moduleType: 'core_practice',
      durationMinutes: coreDuration,
      objective: decision.pedagogicalRationale,
      instructionsForTeacher: `Focar na comunicação real. Aplicar a estratégia '${decision.strategy.name}'. Respeitar o tempo de espera de pelo menos ${decision.strategy.waitTimeSeconds} segundos.`,
      scaffoldingPrompts: decision.scheduledReviewItems.length > 0
        ? decision.scheduledReviewItems.map(item => `Praticar a estrutura/conceito: ${item.conceptOrWord}`)
        : [`Praticar o tópico do aluno: ${studentState.primaryGoal}`],
      targetExercises: [
        {
          prompt: `Expressar uma ideia sobre ${studentState.primaryGoal} usando o vocabulário de ${decision.whatToTeach}.`,
          expectedOutcome: 'Produção oral fluida com STT > 65%.',
          hints: ['Usar frases curtas e diretas.', 'Não haverá interrupção para correção de erros pontuais.']
        }
      ]
    });

    // 3. Real World Application & Recasting Consolidation
    const appDuration = Math.max(2, totalDuration - warmupDuration - coreDuration);
    modules.push({
      moduleId: `${blueprintId}_mod_application`,
      title: 'Aplicação no Mundo Real & Vitória do Dia',
      moduleType: 'real_world_application',
      durationMinutes: appDuration,
      objective: 'Transferir a aprendizagem para um cenário real e destacar uma vitória tangível.',
      instructionsForTeacher: 'Consolidar a conversa em 1-2 frases de recasting natural. Celebrar um progresso específico.',
      scaffoldingPrompts: [
        `Como podes usar o que praticámos hoje na tua próxima reunião/viagem?`,
        `Destacar o progresso específico do aluno em ${decision.targetSkills.join(', ')}.`
      ]
    });

    return {
      blueprintId,
      studentId: studentState.studentId,
      timestampIso,
      decision,
      totalDurationMinutes: totalDuration,
      modules,
      immersionRatio: {
        targetPercent: decision.strategy.immersionTargetPercent,
        nativePercent: 100 - decision.strategy.immersionTargetPercent
      },
      teacherRules: [
        ...decision.strategy.forbiddenBehaviours,
        `Student Talk Time mínimo: ${decision.strategy.targetStudentTalkTimeRatio}%`,
        `Tempo de espera pós-pergunta: ${decision.strategy.waitTimeSeconds}s`,
        'Nunca parecer um chatbot ou assistente virtual.'
      ],
      successCriteria: [
        'Redução ou manutenção baixa da ansiedade oral.',
        'Pelo menos 1 momento de recasting natural sem interrupção.',
        'Sensação clara de utilidade prática para a vida real.'
      ]
    };
  }
}

export const lessonBlueprintGenerator = new LessonBlueprintGenerator();
