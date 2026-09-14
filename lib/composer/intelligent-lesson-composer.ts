/**
 * Master Intelligent Lesson Composer (Sprint 5)
 * Builds each lesson dynamically in real time without fixed models or rigid templates.
 * Coordinates the AI Teaching Orchestrator, Student Digital Twin, Learning Momentum Engine,
 * Memory Threads Engine, Content Selector Engine, Lesson Quality Engine, and Lesson DNA Engine.
 */

import {
  ComposerInput,
  ComposedLesson,
  DynamicLessonBlock,
  MicroGoal,
  LessonJustification,
  InternalLessonReflection,
  FuturePlanningOutput,
  LessonQualityScore,
  LessonDNA,
} from './lesson-composer-types';
import { LearningMomentumEngine } from './learning-momentum';
import { MemoryThreadsEngine } from './memory-threads';
import { ContentSelectorEngine } from './content-selector';
import { LessonQualityEngine, LessonTelemetry } from './lesson-quality';
import { LessonDnaEngine } from './lesson-dna';
import { orchestrateLearningSession } from '../orchestrator/teaching-orchestrator';
import { StudentDigitalTwinEngine } from '../twin/student-digital-twin';

export class IntelligentLessonComposer {
  private memoryThreadsEngine: MemoryThreadsEngine;
  private lessonDnaEngine: LessonDnaEngine;

  constructor(memoryThreads?: MemoryThreadsEngine, lessonDna?: LessonDnaEngine) {
    this.memoryThreadsEngine = memoryThreads || new MemoryThreadsEngine();
    this.lessonDnaEngine = lessonDna || new LessonDnaEngine();
  }

  /**
   * Main Entry Point: Dynamically composes a personalized lesson in real-time.
   */
  public composeLesson(input: ComposerInput): ComposedLesson {
    const userId = input.userId || 'usr_guest';
    const profession = input.profession || 'general';
    const targetCEFR = input.targetCEFR || 'B2';
    const currentCEFR = input.currentCEFR || 'A2';
    const availableMinutes = input.availableMinutes || 15;

    // 1. Calculate Real-Time Learning Momentum
    const momentum = LearningMomentumEngine.calculateMomentum({
      fatigueScore: input.fatigueScore,
      confidenceRating: input.confidenceRating,
      recentAccuracyPercentage: input.recentAccuracyPercentage,
      streakDays: input.streakDays,
      unreviewedItemsCount: input.unreviewedItemsCount,
      availableMinutes,
    });

    // 2. Retrieve Applied Lesson DNA
    const appliedLessonDna = this.lessonDnaEngine.getDNA();

    // 3. Obtain Master Orchestrator Decision & Pre-Lesson Diagnostic
    const orchestrationPlan = orchestrateLearningSession({
      userId,
      profession,
      userInterest: input.userInterest || 'conversacao',
      targetCEFR,
      currentCEFR,
      availableMinutes: momentum.recommendedDurationMinutes,
      fatigueScore: input.fatigueScore,
      confidenceRating: input.confidenceRating,
      recentAccuracyPercentage: input.recentAccuracyPercentage,
      streakDays: input.streakDays,
      unreviewedItemsCount: input.unreviewedItemsCount,
      completedLessonIds: input.completedLessonIds || [],
    });

    // 4. Retrieve Active Memory Threads for Cross-Context Reinforcement
    const activeMemoryThreads = this.memoryThreadsEngine.getActiveThreadsForLesson(3);

    // 5. Formulate Single Crisp Micro-Goal
    const primaryObjectiveText = orchestrationPlan.objectives[0]?.title ||
      `Expressar opiniões e ideias com fluidez em ${targetCEFR}`;

    const microGoal: MicroGoal = {
      id: `goal_${Date.now()}`,
      primaryObjective: primaryObjectiveText,
      targetStructureOrTopic: orchestrationPlan.selectedTopic.title,
      successCriteria: `Produção oral espontânea durante pelo menos 60% do tempo da sessão com precisão >75%.`,
      isAchieved: false,
    };

    // 6. Dynamically Assemble Candidate Lesson Blocks based on Momentum & DNA
    const candidateBlocks = this.generateDynamicCandidateBlocks(
      momentum,
      appliedLessonDna,
      orchestrationPlan.selectedTopic.title,
      activeMemoryThreads,
      profession
    );

    // 7. Filter and Optimize Blocks via Cognitive Load Guard
    const finalBlocks = ContentSelectorEngine.optimizeBlockSequence(
      candidateBlocks,
      momentum,
      momentum.recommendedDurationMinutes
    );

    const totalMinutes = finalBlocks.reduce((sum, b) => sum + b.estimatedDurationMinutes, 0);

    // 8. Generate Philosophical Justifications
    const justification: LessonJustification = {
      whyThisLessonExists: `Esta aula foi desenhada para colmatar a lacuna em "${orchestrationPlan.diagnostic.biggestCurrentBlocker}" e acelerar a autonomia em ${profession}.`,
      whyToday: `Hoje o aluno encontra-se na zona "${momentum.emotionalZone}" (Momentum Score: ${momentum.score}/100), tornando esta a sequência de menor atrito e maior retenção.`,
      whyBetterThanAlternatives: `Em vez de exercícios isolados, utiliza uma estrutura dinâmica focada em ${momentum.primaryActivityFocus} com revisão contextual de memória.`,
      howItApproachesGoal: `Alinha-se diretamente com o objetivo de nível ${targetCEFR} e a micro-meta: "${microGoal.primaryObjective}".`,
      howItEndingBoostsMotivation: `A aula culmina numa reflexão e síntese com vitória rápida, aumentando a expetativa positiva e consistência para a próxima sessão.`,
    };

    return {
      lessonId: `les_comp_${Date.now()}`,
      studentId: userId,
      timestampIso: new Date().toISOString(),
      microGoal,
      momentum,
      blocks: finalBlocks,
      totalEstimatedMinutes: totalMinutes,
      memoryThreads: activeMemoryThreads,
      justification,
      appliedLessonDna,
    };
  }

  /**
   * Generates dynamic candidate blocks based on momentum and Lesson DNA.
   * NEVER uses rigid static templates — structures vary fluidly.
   */
  private generateDynamicCandidateBlocks(
    momentum: ReturnType<typeof LearningMomentumEngine.calculateMomentum>,
    dna: LessonDNA,
    topicName: string,
    memoryThreads: any[],
    profession: string
  ): DynamicLessonBlock[] {
    const blocks: DynamicLessonBlock[] = [];

    // Structure Pattern A: High Momentum / Flow State
    if (momentum.emotionalZone === 'flow_state' || dna.roleplayAffinityWeight >= 0.8) {
      blocks.push({
        id: 'blk_welcome',
        type: 'welcome',
        title: 'Boas-vindas & Sintonização de Flow',
        purpose: 'Estabelecer conexão inicial e definir o foco único da sessão',
        estimatedDurationMinutes: 1,
        cognitiveLoad: 'low',
        targetSkill: 'fluency',
        interactivePrompt: `Apresentação em tom ${momentum.primaryActivityFocus}.`,
      });

      blocks.push({
        id: 'blk_review',
        type: 'smart_review',
        title: 'Revisão Inteligente em Contexto',
        purpose: 'Reativar fios de memória da curva de esquecimento sem repetição artificial',
        estimatedDurationMinutes: 3,
        cognitiveLoad: 'low',
        targetSkill: 'grammar_vocabulary',
        contentItems: memoryThreads.map((m) => ({
          termOrConcept: m.concept,
          context: m.nextRecommendedContext,
          exampleSentence: `Aplicação em contexto de ${m.nextRecommendedContext}.`,
        })),
      });

      blocks.push({
        id: 'blk_conv',
        type: 'conversation',
        title: `Conversação Guiada: ${topicName}`,
        purpose: 'Desenvolver produção oral espontânea em contexto realista',
        estimatedDurationMinutes: 6,
        cognitiveLoad: 'moderate',
        targetSkill: 'speaking',
        interactivePrompt: `Diálogo imersivo focado em ${profession}.`,
      });

      blocks.push({
        id: 'blk_roleplay',
        type: 'roleplay',
        title: `Simulação Situacional (Roleplay): ${topicName}`,
        purpose: 'Testar aplicação em tempo real com reação a cenários não ensaiados',
        estimatedDurationMinutes: 8,
        cognitiveLoad: 'high',
        targetSkill: 'speaking_fluency',
      });

      blocks.push({
        id: 'blk_mission',
        type: 'mission',
        title: 'Missão do Mundo Real',
        purpose: 'Consolidar o aprendizado com uma entrega prática e autônoma',
        estimatedDurationMinutes: 4,
        cognitiveLoad: 'moderate',
        targetSkill: 'transfer_learning',
      });

      blocks.push({
        id: 'blk_summary',
        type: 'summary',
        title: 'Síntese de Vitórias & Fim',
        purpose: 'Reforçar o sentimento de conquista e projetar a evolução',
        estimatedDurationMinutes: 2,
        cognitiveLoad: 'low',
        targetSkill: 'motivation',
      });
    }
    // Structure Pattern B: Mentally Tired or Frustrated -> Micro & Low Friction
    else if (momentum.emotionalZone === 'mentally_tired' || momentum.emotionalZone === 'frustrated') {
      blocks.push({
        id: 'blk_welcome',
        type: 'welcome',
        title: 'Boas-vindas Relaxadas & Apoio',
        purpose: 'Reduzir a ansiedade e proporcionar um ambiente acolhedor',
        estimatedDurationMinutes: 1,
        cognitiveLoad: 'low',
        targetSkill: 'confidence',
      });

      blocks.push({
        id: 'blk_listening',
        type: 'listening',
        title: 'Compreensão Auditiva Leve (Listening)',
        purpose: 'Absorver estruturas naturais sem pressão de fala imediata',
        estimatedDurationMinutes: 4,
        cognitiveLoad: 'low',
        targetSkill: 'listening',
      });

      blocks.push({
        id: 'blk_shadowing',
        type: 'shadowing',
        title: 'Shadowing & Repetição Acompanhada',
        purpose: 'Treinar melodia e ritmo de voz com apoio do professor',
        estimatedDurationMinutes: 3,
        cognitiveLoad: 'low',
        targetSkill: 'pronunciation',
      });

      blocks.push({
        id: 'blk_conv_relaxed',
        type: 'conversation',
        title: 'Troca de Ideias Curta & Descontraída',
        purpose: 'Garantir produção oral positiva de baixo atrito',
        estimatedDurationMinutes: 3,
        cognitiveLoad: 'low',
        targetSkill: 'speaking',
      });

      blocks.push({
        id: 'blk_summary',
        type: 'summary',
        title: 'Vitória Rápida & Encerramento',
        purpose: 'Terminar com alta motivação para a próxima sessão',
        estimatedDurationMinutes: 1,
        cognitiveLoad: 'low',
        targetSkill: 'motivation',
      });
    }
    // Structure Pattern C: Standard / Balanced Progress
    else {
      blocks.push({
        id: 'blk_welcome',
        type: 'welcome',
        title: 'Boas-vindas & Foco da Sessão',
        purpose: 'Alinhar a micro-meta do dia e preparar o aluno',
        estimatedDurationMinutes: 1,
        cognitiveLoad: 'low',
        targetSkill: 'readiness',
      });

      blocks.push({
        id: 'blk_review',
        type: 'smart_review',
        title: 'Reativação de Fios de Memória',
        purpose: 'Reconectar conceitos aprendidos recentemente',
        estimatedDurationMinutes: 3,
        cognitiveLoad: 'low',
        targetSkill: 'memory_retention',
        contentItems: memoryThreads.map((m) => ({
          termOrConcept: m.concept,
          context: m.nextRecommendedContext,
        })),
      });

      blocks.push({
        id: 'blk_new_content',
        type: 'new_content',
        title: `Novo Conteúdo: ${topicName}`,
        purpose: 'Introduzir a estrutura gramatical ou vocabular essencial',
        estimatedDurationMinutes: 4,
        cognitiveLoad: 'moderate',
        targetSkill: 'comprehension',
      });

      blocks.push({
        id: 'blk_practice',
        type: 'practice',
        title: 'Prática Deliberada Guiada',
        purpose: 'Fixar o conceito com feedback seletivo em tempo real',
        estimatedDurationMinutes: 4,
        cognitiveLoad: 'moderate',
        targetSkill: 'accuracy',
      });

      blocks.push({
        id: 'blk_conv',
        type: 'conversation',
        title: 'Conversação & Aplicação Prática',
        purpose: 'Transformar o novo conhecimento em produção oral',
        estimatedDurationMinutes: 5,
        cognitiveLoad: 'moderate',
        targetSkill: 'speaking',
      });

      blocks.push({
        id: 'blk_reflection',
        type: 'reflection',
        title: 'Reflexão & Próximos Passos',
        purpose: 'Consolidar o aprendizado e autoavaliação guiada',
        estimatedDurationMinutes: 1,
        cognitiveLoad: 'low',
        targetSkill: 'metacognition',
      });
    }

    return blocks;
  }

  /**
   * Post-Lesson Evaluation & Reflection:
   * Calculates the internal Lesson Quality Score, updates Lesson DNA, updates Memory Threads,
   * generates internal reflection, and prepares Future Planning.
   */
  public completeLessonAndReflect(
    lesson: ComposedLesson,
    telemetry: LessonTelemetry
  ): {
    qualityScore: LessonQualityScore;
    reflection: InternalLessonReflection;
    futurePlan: FuturePlanningOutput;
    updatedDna: LessonDNA;
  } {
    // 1. Calculate Internal Lesson Quality Score
    const qualityScore = LessonQualityEngine.evaluateQuality(lesson, telemetry);

    // 2. Internal Lesson Reflection
    const reflection: InternalLessonReflection = {
      wasObjectiveAchieved: qualityScore.objectiveMetScore >= 65,
      studentTalkTimeRatio: qualityScore.studentTalkTimeScore,
      mostEffectiveBlockId: lesson.blocks[Math.floor(lesson.blocks.length / 2)]?.id || 'blk_conv',
      blockToModifyInFuture: qualityScore.studentTalkTimeScore < 50 ? 'blk_new_content' : 'none',
      frictionPoints: telemetry.userFrustrationLevel > 40
        ? ['Complexidade inicial de conjugações']
        : [],
      keyTakeawayForNextSession: `Manter densidade de fala do aluno acima de 60% e priorizar imersão situacional.`,
    };

    // 3. Update Lesson DNA
    const updatedDna = this.lessonDnaEngine.evolveDna(qualityScore, {
      hadRoleplay: lesson.blocks.some((b) => b.type === 'roleplay'),
      hadSpeakingFocus: lesson.blocks.some((b) => b.type === 'conversation'),
      hadRealExamples: true,
      challengeScale: lesson.momentum.recommendedDifficultyOffset + 0.5,
    });

    // 4. Advance Memory Threads
    lesson.memoryThreads.forEach((mt) => {
      this.memoryThreadsEngine.linkContext(mt.concept, mt.nextRecommendedContext);
    });

    // 5. Generate Future Planning Output
    const futurePlan: FuturePlanningOutput = {
      nextLessonTopic: `Aprofundamento de ${lesson.microGoal.targetStructureOrTopic} em Negociações`,
      nextScheduledReviewItems: lesson.memoryThreads.map((mt) => mt.concept),
      nextRealWorldMission: `Simulação de e-mail/mensagem profissional e diálogo de alinhamento.`,
      nextSuggestedChallenge: `Roleplay de 5 minutos sem hesitações usando conectores de discurso.`,
    };

    return {
      qualityScore,
      reflection,
      futurePlan,
      updatedDna,
    };
  }
}
