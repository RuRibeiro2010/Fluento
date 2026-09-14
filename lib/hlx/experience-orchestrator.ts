/**
 * Experience Orchestrator Module (Human Learning Experience - HLX)
 * The master coordination engine that synthesizes the AI Brain, Pedagogical Engine,
 * Live Engine, Virtual Teacher Presence, Emotional Memory, and Relationship Engine
 * into a seamless, deeply empathetic human-like learning journey before, during, and after each session.
 */

import {
  StudentEmotionalState,
  createInitialEmotionalState,
  recordEmotionalMilestone,
} from './emotional-memory';

import {
  TeacherStudentRapport,
  initializeTeacherRapport,
  advanceRapportSession,
  generateSpontaneousRapportCallback,
} from './relationship-engine';

import {
  LinguisticStyleConfig,
  createInitialStyleConfig,
  generateVariedPraise,
} from './conversation-style';

import { selectRelevantCulturalInsight, CulturalContextItem } from './cultural-engine';

import { triggerMicroMoment, MicroMoment } from './micro-moments';

import {
  SessionGoalsManifest,
  createInvisibleGoalsForSession,
  evaluateInvisibleGoalProgress,
} from './goal-engine';

import { generateMonthlyRoadmap, MonthlyRoadmapPlan } from './monthly-roadmap';

import { computeHumanSpeechRhythm, filterOutRoboticPhrases } from './humanization-engine';

export interface IntegratedHLXSessionState {
  sessionId: string;
  userId: string;
  targetLanguage: string;
  nativeLanguage: string;
  cefrLevel: string;
  emotionalState: StudentEmotionalState;
  rapport: TeacherStudentRapport;
  styleConfig: LinguisticStyleConfig;
  goalsManifest: SessionGoalsManifest;
  monthlyRoadmap: MonthlyRoadmapPlan;
  activeCulturalInsight: CulturalContextItem | null;
  sessionTurnCount: number;
}

export function initializeHLXSession(
  userId: string,
  targetLanguage: string = 'Espanhol',
  nativeLanguage: string = 'Português',
  cefrLevel: string = 'B1'
): IntegratedHLXSessionState {
  const sessionId = `hlx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const emotionalState = createInitialEmotionalState(userId);
  const rapport = initializeTeacherRapport('Prof. Mateo');
  const styleConfig = createInitialStyleConfig();
  const goalsManifest = createInvisibleGoalsForSession(sessionId, ['grammar']);
  const monthlyRoadmap = generateMonthlyRoadmap(userId, targetLanguage, cefrLevel);
  const activeCulturalInsight = selectRelevantCulturalInsight(targetLanguage, cefrLevel);

  return {
    sessionId,
    userId,
    targetLanguage,
    nativeLanguage,
    cefrLevel,
    emotionalState,
    rapport,
    styleConfig,
    goalsManifest,
    monthlyRoadmap,
    activeCulturalInsight,
    sessionTurnCount: 0,
  };
}

export interface OrchestratedTeacherTurnResponse {
  updatedHLXState: IntegratedHLXSessionState;
  sanitizedTeacherSpeech: string;
  empatheticListeningCue: string;
  preUtterancePauseMs: number;
  wpmRate: number;
  microMomentToTrigger: MicroMoment | null;
  praisePhraseUsed?: string;
  goalProgressPercentage: number;
}

export function processHLXTeacherTurn(
  hlxState: IntegratedHLXSessionState,
  rawTeacherSpeech: string,
  userUtteranceText: string,
  isUserGrammaticallyCorrect: boolean
): OrchestratedTeacherTurnResponse {
  const newTurnCount = hlxState.sessionTurnCount + 1;

  // 1. Sanitize teacher speech to eradicate robotic tropes
  let speech = filterOutRoboticPhrases(rawTeacherSpeech);

  // 2. Evaluate invisible goals progress
  const updatedGoals = evaluateInvisibleGoalProgress(
    hlxState.goalsManifest,
    userUtteranceText,
    isUserGrammaticallyCorrect
  );

  // 3. Human speech rhythm computation
  const speechRhythm = computeHumanSpeechRhythm(
    hlxState.cefrLevel,
    newTurnCount,
    false
  );

  // 4. Trigger micro moments if applicable
  const microMomentResult = triggerMicroMoment(newTurnCount);

  // 5. Generate varied praise if user performed well
  let praisePhraseUsed: string | undefined;
  let updatedStyle = hlxState.styleConfig;

  if (isUserGrammaticallyCorrect && userUtteranceText.split(' ').length >= 5) {
    const praiseResult = generateVariedPraise(updatedStyle, 'high_performance');
    praisePhraseUsed = praiseResult.phrase;
    updatedStyle = praiseResult.updatedConfig;
    speech = `${praiseResult.phrase} ${speech}`;
  }

  // 6. Check for spontaneous rapport callback
  if (newTurnCount === 2) {
    const callbackResult = generateSpontaneousRapportCallback(
      hlxState.rapport,
      hlxState.emotionalState
    );
    if (callbackResult.shouldIncludeCallback) {
      speech = `${callbackResult.callbackText} ${speech}`;
    }
  }

  const updatedHLXState: IntegratedHLXSessionState = {
    ...hlxState,
    sessionTurnCount: newTurnCount,
    goalsManifest: updatedGoals,
    styleConfig: updatedStyle,
  };

  return {
    updatedHLXState,
    sanitizedTeacherSpeech: speech,
    empatheticListeningCue: speechRhythm.empatheticListeningCue,
    preUtterancePauseMs: speechRhythm.preUtterancePauseMs,
    wpmRate: speechRhythm.wpmRate,
    microMomentToTrigger: microMomentResult.moment,
    praisePhraseUsed,
    goalProgressPercentage: updatedGoals.overallProgressPercentage,
  };
}

export function finalizeHLXSession(
  hlxState: IntegratedHLXSessionState
): IntegratedHLXSessionState {
  const updatedRapport = advanceRapportSession(hlxState.rapport);
  const updatedEmotional = recordEmotionalMilestone(hlxState.emotionalState, {
    type: 'breakthrough_victory',
    conceptOrTopic: hlxState.targetLanguage,
    contextDescription: `Sessão de conversa concluída com ${hlxState.goalsManifest.overallProgressPercentage}% das metas invisíveis atingidas.`,
    emotionalSentimentScore: 0.85,
  });

  return {
    ...hlxState,
    rapport: updatedRapport,
    emotionalState: updatedEmotional,
  };
}
