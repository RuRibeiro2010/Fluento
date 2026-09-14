/**
 * Correction Budget Module (Live Experience Engine)
 * Dynamically limits the number of real-time corrections allowed per conversational window
 * to protect student confidence and prevent cognitive overload.
 */

import { LessonMode } from './lesson-modes';

export interface CorrectionBudgetTracker {
  maxCorrectionsPerSession: number;
  maxCorrectionsPerTurn: number;
  correctionsUsedInSession: number;
  correctionsInRecentTurnsWindow: number;
  windowTurnCount: number;
  isBudgetExhausted: boolean;
}

export function initializeCorrectionBudget(
  mode: LessonMode,
  studentFrustrationLevel: number = 0 // 0 to 100
): CorrectionBudgetTracker {
  let maxSession = 8;
  let maxTurn = 1;

  if (mode === 'free_conversation' || mode === 'roleplay') {
    maxSession = 4;
    maxTurn = 1;
  } else if (mode === 'grammar_lab' || mode === 'writing') {
    maxSession = 15;
    maxTurn = 2;
  }

  // Reduce budget if student is feeling frustrated or anxious
  if (studentFrustrationLevel > 50) {
    maxSession = Math.max(2, Math.round(maxSession * 0.5));
    maxTurn = 1;
  }

  return {
    maxCorrectionsPerSession: maxSession,
    maxCorrectionsPerTurn: maxTurn,
    correctionsUsedInSession: 0,
    correctionsInRecentTurnsWindow: 0,
    windowTurnCount: 0,
    isBudgetExhausted: false,
  };
}

export function canDeliverCorrection(
  tracker: CorrectionBudgetTracker,
  errorSeverity: 'minor_nuance' | 'moderate' | 'critical_barrier'
): { allowed: boolean; reason: string } {
  // Critical barriers that prevent understanding are ALWAYS allowed
  if (errorSeverity === 'critical_barrier') {
    return { allowed: true, reason: 'Erro crítico de comunicação. Correção necessária para compreensão.' };
  }

  if (tracker.correctionsUsedInSession >= tracker.maxCorrectionsPerSession) {
    return { allowed: false, reason: 'Orçamento de correções da sessão esgotado. Preservar a fluência e confiança do aluno.' };
  }

  if (tracker.correctionsInRecentTurnsWindow >= tracker.maxCorrectionsPerTurn) {
    return { allowed: false, reason: 'Limite de correções consecutivas atingido. Aguardar ritmo natural de conversa.' };
  }

  return { allowed: true, reason: 'Dentro do orçamento pedagógico de correções.' };
}

export function consumeCorrectionBudget(
  tracker: CorrectionBudgetTracker,
  correctionsCount: number = 1
): CorrectionBudgetTracker {
  const newSessionUsed = tracker.correctionsUsedInSession + correctionsCount;
  const newWindowUsed = tracker.correctionsInRecentTurnsWindow + correctionsCount;

  return {
    ...tracker,
    correctionsUsedInSession: newSessionUsed,
    correctionsInRecentTurnsWindow: newWindowUsed,
    isBudgetExhausted: newSessionUsed >= tracker.maxCorrectionsPerSession,
  };
}

export function advanceTurnWindow(
  tracker: CorrectionBudgetTracker
): CorrectionBudgetTracker {
  const newWindowTurnCount = tracker.windowTurnCount + 1;
  // Reset recent turn window every 2 turns
  const shouldResetWindow = newWindowTurnCount >= 2;

  return {
    ...tracker,
    windowTurnCount: shouldResetWindow ? 0 : newWindowTurnCount,
    correctionsInRecentTurnsWindow: shouldResetWindow ? 0 : tracker.correctionsInRecentTurnsWindow,
  };
}
