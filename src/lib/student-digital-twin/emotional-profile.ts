/**
 * FLUENTO STUDENT DIGITAL TWIN - EMOTIONAL PROFILE
 * 
 * Manages baseline anxiety, affective filter sensitivity, confidence scores, and stress triggers.
 */

import { EmotionalProfile } from './types';

export class EmotionalProfileManager {
  public createDefaultEmotionalProfile(): EmotionalProfile {
    return {
      baselineAnxietyLevel: 35,
      affectiveFilterSensitivity: 'moderate',
      confidenceScores: {
        speaking: 55,
        listening: 70,
        vocabulary: 65,
        grammar: 60,
        pronunciation: 68,
        overall: 63
      },
      knownStressTriggers: ['rapid_native_speech', 'public_presentation'],
      primaryMotivationDrivers: ['career_advancement', 'travel_confidence']
    };
  }
}

export const emotionalProfileManager = new EmotionalProfileManager();
