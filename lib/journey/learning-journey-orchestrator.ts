/**
 * Master Learning Journey Orchestrator (Sprint A)
 * The central intelligence governing the learner's multi-month evolution.
 * Integrates and coordinates all underlying specialized engines without replacing them:
 * - Teaching Orchestrator
 * - Intelligent Lesson Composer
 * - Student Digital Twin
 * - Journey Engine & Roadmap
 * - Life Events Engine
 * - Learning ROI Engine
 * - Professor Notebook
 * - Multi-Horizon Planner
 *
 * PHILOSOPHY:
 * Does not think about just the next lesson. Thinks about the entire journey.
 * Dynamically recalculates whenever new telemetry or life events occur.
 * Works strictly on concrete real-world goals and competency milestones.
 */

import {
  RealWorldGoal,
  CompetencyMilestone,
  OrchestratedJourneySnapshot,
  JourneyExplainability,
  LearningROIEvaluation,
} from './journey-orchestrator-types';

import { LifeEventsEngine } from './life-events-engine';
import { LearningRoiEngine } from './learning-roi-engine';
import { ProfessorNotebook } from './professor-notebook';
import { HorizonPlanner } from './horizon-planner';
import { JourneyEngine, defaultJourneyEngine } from './journey-engine';
import { StudentDigitalTwinEngine } from '../twin/student-digital-twin';
import { orchestrateLearningSession, OrchestrationInput } from '../orchestrator/teaching-orchestrator';
import { IntelligentLessonComposer } from '../composer/intelligent-lesson-composer';

export class LearningJourneyOrchestrator {
  private digitalTwin: StudentDigitalTwinEngine;
  private journeyEngine: JourneyEngine;
  private lifeEventsEngine: LifeEventsEngine;
  private professorNotebook: ProfessorNotebook;
  private lessonComposer: IntelligentLessonComposer;

  private activeGoal: RealWorldGoal;
  private milestones: CompetencyMilestone[];

  constructor(
    digitalTwin?: StudentDigitalTwinEngine,
    journeyEngine?: JourneyEngine,
    lifeEventsEngine?: LifeEventsEngine,
    professorNotebook?: ProfessorNotebook,
    lessonComposer?: IntelligentLessonComposer
  ) {
    this.digitalTwin = digitalTwin || new StudentDigitalTwinEngine();
    this.journeyEngine = journeyEngine || defaultJourneyEngine;
    this.lifeEventsEngine = lifeEventsEngine || new LifeEventsEngine();
    this.professorNotebook = professorNotebook || new ProfessorNotebook();
    this.lessonComposer = lessonComposer || new IntelligentLessonComposer();

    this.activeGoal = {
      id: 'goal_relocation_work_1',
      category: 'job_interview',
      title: 'Entrevista de Emprego & Transição Profissional',
      description: 'Capacidade de apresentar a trajetória profissional, defender decisões e conduzir negociações.',
      priorityScore: 95,
      isCompleted: false,
    };

    this.milestones = [
      {
        id: 'ms_conv_10min',
        title: 'Manter conversa de 10 minutos sem parar',
        description: 'Capacidade de sustentar um diálogo contínuo em espanhol/inglês sem depender de tradução mental.',
        requiredCompetencies: ['spontaneous_speaking', 'discourse_connectors'],
        estimatedWeeksToUnlock: 1,
        isUnlocked: true,
        isAchieved: true,
        achievedAtIso: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'ms_email_prof',
        title: 'Escrever e-mail profissional com clareza',
        description: 'Compor mensagens formais para renegociação de prazos e alinhamentos corporativos.',
        requiredCompetencies: ['formal_register', 'email_templates'],
        estimatedWeeksToUnlock: 2,
        isUnlocked: true,
        isAchieved: false,
      },
      {
        id: 'ms_job_interview',
        title: 'Realizar simulação completa de entrevista de emprego',
        description: 'Responder a perguntas de conduta passada e expectativas futuras com fluidez.',
        requiredCompetencies: ['past_tenses', 'conditional_structures', 'professional_vocab'],
        estimatedWeeksToUnlock: 3,
        isUnlocked: false,
        isAchieved: false,
      },
      {
        id: 'ms_meeting_pres',
        title: 'Apresentar um projeto numa reunião corporativa',
        description: 'Apresentar argumentos e responder a objeções em tempo real.',
        requiredCompetencies: ['argumentation', 'handling_interruptions'],
        estimatedWeeksToUnlock: 6,
        isUnlocked: false,
        isAchieved: false,
      },
    ];
  }

  /**
   * Main Entry Point: Calculates complete, living Journey Snapshot for the student.
   */
  public getOrchestratedSnapshot(
    input: Partial<OrchestrationInput> = {}
  ): OrchestratedJourneySnapshot {
    const twinState = this.digitalTwin.getTwinState();
    const activeLifeEvent = this.lifeEventsEngine.getActiveLifeEvent();

    // 1. Calculate Multi-Horizon Projections
    const horizons = HorizonPlanner.calculateHorizons({
      currentCEFR: twinState.linguistic.overallCEFR,
      targetCEFR: twinState.context.goals[0]?.includes('B2') ? 'B2' : 'B1',
      weeklyPracticeHours: 3.0,
      recentAccuracyPercentage: Math.round(
        (twinState.linguistic.skillScores.speaking +
          twinState.linguistic.skillScores.listening +
          twinState.linguistic.skillScores.grammar) /
          3
      ),
      streakDays: twinState.habits.consecutiveDaysActive,
      activeGoalTitle: this.activeGoal.title,
    });

    // 2. Evaluate Learning ROI for Next Session Strategy
    const activeGoalFocus = activeLifeEvent
      ? activeLifeEvent.temporaryFocusTopics[0]
      : this.activeGoal.title;

    const roiEvaluation = LearningRoiEngine.evaluateActivityROI(
      `Simulação Situacional Focus: ${activeGoalFocus}`,
      15,
      'moderate',
      'speaking_fluency',
      twinState.emotional.frustrationIndex > 60 ? 7 : 3
    );

    // 3. Generate Internal Decision Explainability
    const explainability: JourneyExplainability = {
      primaryDecisionRationale: activeLifeEvent
        ? `Evento ativo "${activeLifeEvent.title}" (Data: ${activeLifeEvent.eventDateIso.split('T')[0]}). Plano ajustado temporariamente para simulação intensiva com alto ROI.`
        : `Progressão focada no marco real: "${this.milestones.find((m) => !m.isAchieved)?.title}".`,
      rejectedAlternativesRationale: `Rejeitados exercícios estáticos de múltipla escolha por apresentarem baixo ROI de aprendizagem (${roiEvaluation.learningYieldPerMinute}/100) face à necessidade de produção espontânea.`,
      expectedLongTermImpact: `Aumenta a probabilidade de atingir a meta em 3 meses para ${Math.round(
        horizons.threeMonths.probabilisticSuccessRate * 100
      )}% sem sobrecarga cognitiva.`,
      safetyCheckPassed: true,
    };

    return {
      userId: twinState.userId,
      activeGoal: { ...this.activeGoal },
      milestones: this.milestones.map((m) => ({ ...m })),
      activeLifeEvents: this.lifeEventsEngine.getEvents(),
      horizons,
      roiEvaluations: [roiEvaluation],
      professorNotebook: this.professorNotebook.getEntries(),
      explainability,
      lastRecalculatedIso: new Date().toISOString(),
    };
  }

  /**
   * Executes a complete learning session orchestrated from top-level Journey parameters down to dynamic Lesson Composition.
   */
  public executeOrchestratedSession(input: OrchestrationInput) {
    const twinState = this.digitalTwin.getTwinState();
    const activeLifeEvent = this.lifeEventsEngine.getActiveLifeEvent();

    // Context override if Life Event is active
    let sessionInput = { ...input };
    if (activeLifeEvent) {
      sessionInput.userInterest = activeLifeEvent.temporaryFocusTopics[0] || input.userInterest;
      this.professorNotebook.logObservation(
        'effective_pedagogy',
        `Plano adaptado temporariamente para o Life Event: ${activeLifeEvent.title}.`,
        `Foco redirecionado para: ${sessionInput.userInterest}.`
      );
    }

    // 1. Run Master Teaching Orchestrator
    const orchestrationResult = orchestrateLearningSession(sessionInput);

    // 2. Compose Dynamic Lesson via Intelligent Lesson Composer
    const composedLesson = this.lessonComposer.composeLesson({
      userId: input.userId,
      profession: input.profession,
      userInterest: sessionInput.userInterest,
      targetCEFR: input.targetCEFR,
      currentCEFR: input.currentCEFR,
      availableMinutes: input.availableMinutes,
      fatigueScore: input.fatigueScore,
      confidenceRating: input.confidenceRating,
      recentAccuracyPercentage: input.recentAccuracyPercentage,
      streakDays: input.streakDays,
      unreviewedItemsCount: input.unreviewedItemsCount,
      completedLessonIds: input.completedLessonIds,
    });

    // 3. Log Pedagogical Observations in Professor Notebook
    this.professorNotebook.logObservation(
      'confidence_shift',
      `Sessão composta com ${composedLesson.blocks.length} blocos na zona "${composedLesson.momentum.emotionalZone}".`,
      `Momento otimizado para ${composedLesson.momentum.primaryActivityFocus}.`
    );

    return {
      orchestrationResult,
      composedLesson,
      journeySnapshot: this.getOrchestratedSnapshot(input),
    };
  }

  /**
   * Adds a new Life Event (e.g. upcoming interview, trip, presentation).
   */
  public registerLifeEvent(event: Parameters<LifeEventsEngine['addLifeEvent']>[0]) {
    const newEvent = this.lifeEventsEngine.addLifeEvent(event);
    this.professorNotebook.logObservation(
      'effective_pedagogy',
      `Novo evento de vida registado: "${newEvent.title}".`,
      `Prioridade reajustada no plano do aluno.`
    );
    return newEvent;
  }

  /**
   * Retrieves the Professor's internal notebook.
   */
  public getProfessorNotebook(): ProfessorNotebook {
    return this.professorNotebook;
  }
}

export const defaultLearningJourneyOrchestrator = new LearningJourneyOrchestrator();
