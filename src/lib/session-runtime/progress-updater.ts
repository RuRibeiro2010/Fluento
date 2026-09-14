/**
 * FLUENTO SESSION RUNTIME - PROGRESS UPDATER
 * 
 * Updates student learning state parameters (confidence scores, anxiety levels,
 * energy levels) based on turn performance, speaking ratios, and session cadence.
 */

import { StudentLearningState } from '@/src/lib/learning-engine';
import { OrchestratorActionDirective } from './types';

export class ProgressUpdater {
  /**
   * Evaluates turn execution metrics and produces an updated StudentLearningState.
   */
  public updateProgress(
    currentState: StudentLearningState,
    directive: OrchestratorActionDirective,
    studentSpeechDurationSeconds: number = 0
  ): StudentLearningState {
    const updatedState: StudentLearningState = {
      ...currentState,
      confidenceScores: { ...currentState.confidenceScores }
    };

    // 1. Update oral confidence score when student speaks actively
    if (studentSpeechDurationSeconds > 5) {
      const confidenceBoost = Math.min(2, Math.ceil(studentSpeechDurationSeconds / 10));
      updatedState.confidenceScores.speaking = Math.min(100, updatedState.confidenceScores.speaking + confidenceBoost);
    }

    // 2. Adjust anxiety level based on emotional signals
    if (directive.emotionalSignal) {
      if (directive.emotionalSignal.affectiveFilterState === 'panic') {
        updatedState.speakingAnxietyLevel = Math.min(100, updatedState.speakingAnxietyLevel + 5);
      } else if (directive.emotionalSignal.affectiveFilterState === 'optimal') {
        updatedState.speakingAnxietyLevel = Math.max(0, updatedState.speakingAnxietyLevel - 2);
      }
    }

    return updatedState;
  }
}

export const progressUpdater = new ProgressUpdater();
