/**
 * FLUENTO STUDENT DIGITAL TWIN - BEHAVIOUR PROFILE
 * 
 * Manages behavioral traits including talk-time ratio, pause cadence, and dropoff risk metrics.
 */

import { BehaviourProfile } from './types';

export class BehaviourProfileManager {
  public createDefaultBehaviourProfile(): BehaviourProfile {
    return {
      avgTalkTimeRatio: 0.60,
      turnCadenceSeconds: 4.5,
      pauseFrequency: 'moderate',
      helpSeekingTendency: 'balanced',
      dropoffRiskScore: 20,
      completedSessionsCount: 0,
      totalSpeakingTimeSeconds: 0
    };
  }
}

export const behaviourProfileManager = new BehaviourProfileManager();
