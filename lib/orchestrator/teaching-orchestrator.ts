/**
 * AI Teaching Orchestrator (Sprint 3)
 * Master Coordinator that orchestrates the entire learning engine of Fluento.
 * Does not directly teach or construct UI; instead, evaluates student state,
 * longitudinal memory, fatigue, motivation, goals, and context to make
 * fully justified pedagogical decisions.
 */

import { evaluateStudentState, StudentLearningState } from './learning-state';
import { selectOptimalTeacherPersona, VirtualTeacherPersona } from './coaching-engine';
import { selectOptimalLessonTopic, SelectedLessonTopic } from './lesson-selector';
import { selectPedagogicalStrategy, StrategyDecision } from './strategy-selector';
import { generateSessionObjectives, LearningObjective } from './objective-engine';
import { generatePedagogicalRationale, PedagogicalRationale } from './decision-engine';
import { calculateReviewPriorities, CalculatedReviewPriority } from './review-priority';
import { generateLearningForecast, LearningForecastResult } from './learning-forecast';
import { recordDecisionEntry, DecisionJournalEntry } from './decision-journal';
import { OrchestratorConnectorsHub } from './connectors';
import { IntelligentLessonComposer } from '../composer/intelligent-lesson-composer';
import { ComposedLesson } from '../composer/lesson-composer-types';

export interface OrchestrationInput {
  userId: string;
  profession?: string;
  userInterest?: string;
  targetCEFR: string;
  currentCEFR?: string;
  availableMinutes: number;
  fatigueScore: number; // 0 (rested) to 10 (exhausted)
  confidenceRating: number; // 1 to 10
  recentAccuracyPercentage: number; // 0 to 100
  streakDays: number;
  unreviewedItemsCount: number;
  completedLessonIds: string[];
  targetLanguage?: string;
}

export type TargetCompetencyType =
  | 'speaking'
  | 'listening'
  | 'grammar'
  | 'roleplay'
  | 'pronunciation'
  | 'writing'
  | 'real_mission';

export interface PreLessonInternalDiagnostic {
  doesStudentNeedReviewFirst: boolean;
  biggestCurrentBlocker: string;
  highestPotentialImprovement: string;
  mostUrgentContent: string;
  mostUsefulContent: string;
  targetCompetency: TargetCompetencyType;
  flowStateTargetDifficulty: number; // 0.1 to 1.0
  burnoutRiskDetected: boolean;
}

export interface OrchestratedSessionPlan {
  planId: string;
  userId: string;
  timestampIso: string;
  studentState: StudentLearningState;
  diagnostic: PreLessonInternalDiagnostic;
  assignedTeacher: VirtualTeacherPersona & {
    energyLevel: 'gentle_calm' | 'balanced' | 'high_energy';
    speechTempo: 'slow_relaxed' | 'moderate' | 'natural_fast';
    correctionDensity: 'minimal' | 'selective' | 'thorough';
    exampleType: 'conversational' | 'professional_corporate' | 'cultural_informal';
  };
  selectedTopic: SelectedLessonTopic;
  strategy: StrategyDecision;
  objectives: LearningObjective[];
  rationale: PedagogicalRationale;
  reviewPriorities: CalculatedReviewPriority[];
  forecast: LearningForecastResult;
  journalEntry: DecisionJournalEntry;
  composedLesson?: ComposedLesson;
}

export interface WeeklyPlanOverview {
  userId: string;
  plannedSessionsCount: number;
  primaryWeeklyFocus: string;
  targetCompetencies: TargetCompetencyType[];
  scheduledTeacherIds: string[];
  estimatedCEFRProgressPoints: number;
}

export interface MonthlyPlanOverview {
  userId: string;
  monthlyObjective: string;
  milestoneTargetCEFR: string;
  weeklyPlanSummaries: string[];
  forecastedCompletionWeeks: number;
}

/**
 * Master Orchestrator: Calculates pre-lesson diagnostic and generates orchestrated plan.
 */
export function orchestrateLearningSession(input: OrchestrationInput): OrchestratedSessionPlan {
  const userId = input.userId || 'usr_guest';
  const profession = input.profession || 'general';
  const userInterest = input.userInterest || 'conversacao';
  const currentCEFR = input.currentCEFR || 'A2';
  const targetCEFR = input.targetCEFR || 'B2';

  // 1. Evaluate Student Cognitive & Emotional State
  const studentState = evaluateStudentState({
    fatigueScore: input.fatigueScore,
    confidenceRating: input.confidenceRating,
    recentAccuracyPercentage: input.recentAccuracyPercentage,
    streakDays: input.streakDays,
    unreviewedItemsCount: input.unreviewedItemsCount,
    daysInCurrentLevel: 12,
  });

  // 2. Pre-Lesson Internal Diagnostic Questions
  const doesStudentNeedReviewFirst =
    input.unreviewedItemsCount > 12 || studentState === 'Needs Review';

  let targetCompetency: TargetCompetencyType = 'speaking';
  if (doesStudentNeedReviewFirst) {
    targetCompetency = 'grammar';
  } else if (studentState === 'Needs Confidence') {
    targetCompetency = 'listening';
  } else if (studentState === 'Ready for Challenge' || studentState === 'Flow State') {
    targetCompetency = 'roleplay';
  } else if (input.availableMinutes <= 5) {
    targetCompetency = 'pronunciation';
  }

  // Calculate Flow State Target Difficulty (Zone of Proximal Development)
  let flowDifficulty = 0.5;
  if (studentState === 'Flow State' || studentState === 'High Performance') {
    flowDifficulty = 0.85;
  } else if (studentState === 'Ready for Challenge') {
    flowDifficulty = 0.7;
  } else if (studentState === 'Mentally Tired' || studentState === 'Burnout Risk') {
    flowDifficulty = 0.3;
  }

  const diagnostic: PreLessonInternalDiagnostic = {
    doesStudentNeedReviewFirst,
    biggestCurrentBlocker: doesStudentNeedReviewFirst
      ? 'Acúmulo de itens pendentes de revisão na curva de esquecimento'
      : input.confidenceRating <= 4
      ? 'Hesitação conversacional por receio de cometer erros'
      : 'Necessidade de estruturação de frases compostas e passado',
    highestPotentialImprovement:
      'Transição de vocabulário passivo para produção oral espontânea',
    mostUrgentContent: doesStudentNeedReviewFirst
      ? 'Conjugações do passado e conectores de discurso'
      : 'Vocabulário situational do contexto profissional/interesse',
    mostUsefulContent:
      profession === 'technology'
        ? 'Expressões de colaboração técnica e standup meetings'
        : 'Expressões de opinião, negociação e cortesia prática',
    targetCompetency,
    flowStateTargetDifficulty: flowDifficulty,
    burnoutRiskDetected: input.fatigueScore >= 8 || studentState === 'Burnout Risk',
  };

  // 3. Select Virtual Teacher Persona & Behavioral Parameters
  const baseTeacher = selectOptimalTeacherPersona(studentState, profession);
  const assignedTeacher = {
    ...baseTeacher,
    energyLevel: (studentState === 'Mentally Tired' || studentState === 'Burnout Risk'
      ? 'gentle_calm'
      : studentState === 'Ready for Challenge'
      ? 'high_energy'
      : 'balanced') as 'gentle_calm' | 'balanced' | 'high_energy',
    speechTempo: (studentState === 'Needs Confidence' || input.fatigueScore >= 6
      ? 'slow_relaxed'
      : studentState === 'Flow State'
      ? 'natural_fast'
      : 'moderate') as 'slow_relaxed' | 'moderate' | 'natural_fast',
    correctionDensity: (studentState === 'Needs Confidence'
      ? 'minimal'
      : studentState === 'Ready for Challenge'
      ? 'thorough'
      : 'selective') as 'minimal' | 'selective' | 'thorough',
    exampleType: (profession === 'technology' || profession === 'business'
      ? 'professional_corporate'
      : 'conversational') as 'conversational' | 'professional_corporate' | 'cultural_informal',
  };

  // 4. Select Lesson Topic or Review Session
  const selectedTopic = selectOptimalLessonTopic(
    {
      userInterest,
      profession,
      targetCEFR,
      completedLessonIds: input.completedLessonIds,
    },
    input.availableMinutes
  );

  // 5. Select Pedagogical Strategy
  const strategy = selectPedagogicalStrategy(studentState);

  // 6. Generate Objectives & Rationales
  const objectives = generateSessionObjectives(profession, targetCEFR, studentState);
  const rationale = generatePedagogicalRationale(
    studentState,
    selectedTopic.title,
    assignedTeacher.name,
    selectedTopic.estimatedDurationMinutes,
    targetCEFR
  );

  // 7. Calculate Review Priorities
  const sampleCandidates = [
    {
      id: 'rev_1',
      conceptName: 'Pretérito Indefinido',
      daysSinceLastReviewed: 5,
      historicalErrorRate: 0.35,
      cefrLevel: 'A2',
    },
    {
      id: 'rev_2',
      conceptName: 'Conectores Causa/Efeito',
      daysSinceLastReviewed: 8,
      historicalErrorRate: 0.2,
      cefrLevel: 'B1',
    },
  ];
  const reviewPriorities = calculateReviewPriorities(sampleCandidates);

  // 8. Generate Predictive Learning Forecast
  const forecast = generateLearningForecast({
    userId,
    currentCEFR,
    targetCEFR,
    weeklyPracticeMinutes: input.availableMinutes * 4,
    accuracyRatePercentage: input.recentAccuracyPercentage,
    fatigueScore: input.fatigueScore,
    streakDays: input.streakDays,
    unreviewedItemsCount: input.unreviewedItemsCount,
    studentState,
  });

  // 9. Record Decision into Decision Journal
  const journalEntry = recordDecisionEntry({
    userId,
    decisionType: 'session_plan',
    primaryRationale: rationale.whyThisLesson,
    stateBefore: studentState,
    actionTaken: `Atribuída aula "${selectedTopic.title}" com ${assignedTeacher.name} em modo ${selectedTopic.mode}`,
    details: {
      selectedTopic: selectedTopic.title,
      teacherPersona: assignedTeacher.name,
      mode: selectedTopic.mode,
      targetCompetency,
      newDifficulty: flowDifficulty,
      riskTriggered: diagnostic.burnoutRiskDetected ? 'Burnout Risk' : undefined,
    },
  });

  // 10. Compose Dynamic Real-Time Lesson via Intelligent Lesson Composer
  const composer = new IntelligentLessonComposer();
  const composedLesson = composer.composeLesson({
    userId,
    profession,
    userInterest,
    targetCEFR,
    currentCEFR,
    availableMinutes: input.availableMinutes,
    fatigueScore: input.fatigueScore,
    confidenceRating: input.confidenceRating,
    recentAccuracyPercentage: input.recentAccuracyPercentage,
    streakDays: input.streakDays,
    unreviewedItemsCount: input.unreviewedItemsCount,
    completedLessonIds: input.completedLessonIds,
  });

  return {
    planId: `plan_${Date.now()}`,
    userId,
    timestampIso: new Date().toISOString(),
    studentState,
    diagnostic,
    assignedTeacher,
    selectedTopic,
    strategy,
    objectives,
    rationale,
    reviewPriorities,
    forecast,
    journalEntry,
    composedLesson,
  };
}

/**
 * Mid-Session Adaptation Engine: Adjusts strategy dynamically if student performance deviates.
 */
export function adaptSessionInRealtime(
  currentPlan: OrchestratedSessionPlan,
  metrics: {
    studentFatigueObserved: boolean;
    consecutiveErrorsCount: number;
    consecutiveSuccessesCount: number;
  }
): OrchestratedSessionPlan {
  let updatedDifficulty = currentPlan.diagnostic.flowStateTargetDifficulty;
  let newAction = 'Manter estratégia atual';

  if (metrics.studentFatigueObserved || metrics.consecutiveErrorsCount >= 3) {
    updatedDifficulty = Math.max(0.2, updatedDifficulty - 0.2);
    currentPlan.assignedTeacher.speechTempo = 'slow_relaxed';
    currentPlan.assignedTeacher.correctionDensity = 'minimal';
    newAction = 'Reduzida dificuldade e desacelerado tempo de fala devido a hesitação/fadiga';
  } else if (metrics.consecutiveSuccessesCount >= 4) {
    updatedDifficulty = Math.min(0.95, updatedDifficulty + 0.15);
    currentPlan.assignedTeacher.correctionDensity = 'thorough';
    newAction = 'Aumentada dificuldade para otimizar estado de Flow e desafio';
  }

  currentPlan.diagnostic.flowStateTargetDifficulty = updatedDifficulty;

  recordDecisionEntry({
    userId: currentPlan.userId,
    decisionType: 'mid_session_adaptation',
    primaryRationale: newAction,
    stateBefore: currentPlan.studentState,
    actionTaken: newAction,
    details: {
      newDifficulty: updatedDifficulty,
      teacherPersona: currentPlan.assignedTeacher.name,
    },
  });

  return currentPlan;
}

/**
 * Recovery Strategy: Switches strategy if current pedagogical delivery is unsuited.
 */
export function executeRecoveryStrategy(
  currentPlan: OrchestratedSessionPlan,
  failureReason: string
): OrchestratedSessionPlan {
  currentPlan.strategy = {
    strategy: 'Gentle_Confidence_Building',
    pacingTempo: 'slow_relaxed',
    correctionStrictness: 'gentle_minimal',
  };

  currentPlan.assignedTeacher.energyLevel = 'gentle_calm';
  currentPlan.assignedTeacher.speechTempo = 'slow_relaxed';

  recordDecisionEntry({
    userId: currentPlan.userId,
    decisionType: 'recovery_strategy_switch',
    primaryRationale: `Ativada estratégia de recuperação por motivo: ${failureReason}`,
    stateBefore: currentPlan.studentState,
    actionTaken: 'Mudança para Gentle_Confidence_Building',
    details: {
      riskTriggered: failureReason,
    },
  });

  return currentPlan;
}

/**
 * Multi-Horizon Planning: Next Week
 */
export function planNextWeek(input: OrchestrationInput): WeeklyPlanOverview {
  return {
    userId: input.userId,
    plannedSessionsCount: 4,
    primaryWeeklyFocus: 'Fluidez em Passado Indefinido e Vocabulário de Negociação',
    targetCompetencies: ['speaking', 'listening', 'grammar', 'roleplay'],
    scheduledTeacherIds: ['teacher-sofia', 'teacher-marcos', 'teacher-lucas'],
    estimatedCEFRProgressPoints: 0.12,
  };
}

/**
 * Multi-Horizon Planning: Next Month
 */
export function planNextMonth(input: OrchestrationInput): MonthlyPlanOverview {
  return {
    userId: input.userId,
    monthlyObjective: `Atingir autonomia total no nível ${input.targetCEFR || 'B2'}`,
    milestoneTargetCEFR: input.targetCEFR || 'B2',
    weeklyPlanSummaries: [
      'Semana 1: Consolidação de Estruturas no Passado',
      'Semana 2: Simulações de Reuniões e Diálogos de Opinião',
      'Semana 3: Imersão Auditiva em Sotaques e Ritmo Real',
      'Semana 4: Missão Prática de Apresentação e Avaliação de Nível',
    ],
    forecastedCompletionWeeks: 4,
  };
}
