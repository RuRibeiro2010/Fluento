/**
 * FLUENTO STUDENT DIGITAL TWIN - PROFILE MERGER
 * 
 * Safely applies immutable deep merges of partial profile updates without state loss or array wiping.
 */

import { StudentDigitalTwinState, PartialStudentDigitalTwinState } from './types';

export class ProfileMerger {
  /**
   * Immutably updates a StudentDigitalTwinState with partial profile changes.
   */
  public mergeProfiles(
    currentState: StudentDigitalTwinState,
    partial: PartialStudentDigitalTwinState
  ): StudentDigitalTwinState {
    const updatedState: StudentDigitalTwinState = {
      ...currentState,
      identity: partial.identity ? { ...currentState.identity, ...partial.identity } : { ...currentState.identity },
      learning: partial.learning ? { ...currentState.learning, ...partial.learning } : { ...currentState.learning },
      language: partial.language ? { ...currentState.language, ...partial.language } : { ...currentState.language },
      emotional: partial.emotional
        ? {
            ...currentState.emotional,
            ...partial.emotional,
            confidenceScores: partial.emotional.confidenceScores
              ? { ...currentState.emotional.confidenceScores, ...partial.emotional.confidenceScores }
              : { ...currentState.emotional.confidenceScores }
          }
        : { ...currentState.emotional },
      behaviour: partial.behaviour ? { ...currentState.behaviour, ...partial.behaviour } : { ...currentState.behaviour },
      goal: partial.goal ? { ...currentState.goal, ...partial.goal } : { ...currentState.goal },
      memory: partial.memory ? { ...currentState.memory, ...partial.memory } : { ...currentState.memory },
      recommendation: partial.recommendation
        ? { ...currentState.recommendation, ...partial.recommendation }
        : { ...currentState.recommendation },
      revision: currentState.revision + 1,
      lastUpdatedIso: new Date().toISOString()
    };

    return updatedState;
  }
}

export const profileMerger = new ProfileMerger();
