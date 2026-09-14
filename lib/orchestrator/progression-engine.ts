/**
 * Progression Engine Module (AI Teaching Orchestrator - Phase 15)
 * Dynamically updates CEFR sub-levels and mastery velocity.
 */

export interface ProgressionState {
  currentCEFR: string; // e.g. "B1.2"
  numericalScore: number; // e.g. 3.2 on a 1.0 - 6.0 scale
  velocityMultiplier: number;
}

export function calculateProgressionDelta(
  currentState: ProgressionState,
  accuracy: number,
  sessionMinutes: number
): ProgressionState {
  let delta = 0.01;

  if (accuracy >= 90) {
    delta = 0.04 * currentState.velocityMultiplier;
  } else if (accuracy < 60) {
    delta = -0.02;
  }

  const newScore = Math.max(1.0, Math.min(6.0, currentState.numericalScore + delta));

  let cefr = 'A1';
  if (newScore >= 5.0) cefr = 'C2';
  else if (newScore >= 4.5) cefr = 'C1';
  else if (newScore >= 3.5) cefr = 'B2';
  else if (newScore >= 2.5) cefr = 'B1';
  else if (newScore >= 1.8) cefr = 'A2';

  return {
    currentCEFR: cefr,
    numericalScore: Number(newScore.toFixed(2)),
    velocityMultiplier: accuracy >= 90 ? 1.1 : 1.0,
  };
}
