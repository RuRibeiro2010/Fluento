/**
 * FLUENTO CONVERSATION ORCHESTRATOR - EMOTIONAL MONITOR
 * 
 * Monitors affective filter states, anxiety spikes, and hesitation signals in real time.
 * Provides adaptive tone and wait-time recommendations to keep the student safe and relaxed.
 */

import { EmotionalSignal, TurnEvent } from './types';
import { StudentLearningState, TeachingStrategy } from '@/src/lib/learning-engine';

export class EmotionalMonitor {
  /**
   * Evaluates the current emotional state of the student given recent events and state.
   */
  public evaluateEmotionalState(
    studentState: StudentLearningState,
    recentEvents: TurnEvent[] = []
  ): EmotionalSignal {
    const { speakingAnxietyLevel, fatigueScore, confidenceScores } = studentState;

    // Analyze recent hesitation counts or panic events
    let recentHesitationSum = 0;
    let panicSignalDetected = false;

    for (const ev of recentEvents) {
      if (ev.hesitationCount) {
        recentHesitationSum += ev.hesitationCount;
      }
      if (ev.eventType === 'emotion_signal' && ev.rawTextSample === 'panic') {
        panicSignalDetected = true;
      }
    }

    // Determine Affective Filter State
    let affectiveFilterState: EmotionalSignal['affectiveFilterState'] = 'optimal';
    if (panicSignalDetected || speakingAnxietyLevel >= 80) {
      affectiveFilterState = 'panic';
    } else if (speakingAnxietyLevel >= 60 || recentHesitationSum >= 5) {
      affectiveFilterState = 'heightened';
    } else if (speakingAnxietyLevel <= 30 && confidenceScores.overall >= 70) {
      affectiveFilterState = 'relaxed';
    } else {
      affectiveFilterState = 'optimal';
    }

    // Recommend tone based on affective filter state
    let recommendedTone: TeachingStrategy['tone'] = 'warm_supportive';
    let recommendedWaitTimeDeltaSeconds = 0;

    switch (affectiveFilterState) {
      case 'panic':
        recommendedTone = 'gentle_recovery';
        recommendedWaitTimeDeltaSeconds = 3; // Add +3s to wait time to eliminate urgency
        break;
      case 'heightened':
        recommendedTone = 'warm_supportive';
        recommendedWaitTimeDeltaSeconds = 1.5;
        break;
      case 'relaxed':
        recommendedTone = 'energetic_encouraging';
        recommendedWaitTimeDeltaSeconds = 0;
        break;
      case 'optimal':
      default:
        recommendedTone = 'warm_supportive';
        recommendedWaitTimeDeltaSeconds = 0;
        break;
    }

    return {
      anxietyLevel: speakingAnxietyLevel,
      fatigueScore,
      confidenceScore: confidenceScores.overall,
      affectiveFilterState,
      recommendedTone,
      recommendedWaitTimeDeltaSeconds
    };
  }
}

export const emotionalMonitor = new EmotionalMonitor();
