/**
 * FLUENTO STUDENT DIGITAL TWIN - FIXTURES
 * 
 * Mock fixtures and sample data for Student Digital Twin testing and demonstration.
 */

import { StudentDigitalTwinState } from './types';
import { identityProfileManager } from './identity-profile';
import { learningProfileManager } from './learning-profile';
import { languageProfileManager } from './language-profile';
import { emotionalProfileManager } from './emotional-profile';
import { behaviourProfileManager } from './behaviour-profile';
import { goalProfileManager } from './goal-profile';
import { memoryProfileManager } from './memory-profile';
import { recommendationProfileManager } from './recommendation-profile';

export const mockStudentDigitalTwinNormal: StudentDigitalTwinState = {
  identity: identityProfileManager.createDefaultIdentity('std_normal_123', 'João Silva', 'joao.silva@fluento.pt'),
  learning: learningProfileManager.createDefaultLearningProfile(),
  language: languageProfileManager.createDefaultLanguageProfile(),
  emotional: emotionalProfileManager.createDefaultEmotionalProfile(),
  behaviour: behaviourProfileManager.createDefaultBehaviourProfile(),
  goal: goalProfileManager.createDefaultGoalProfile(),
  memory: memoryProfileManager.createDefaultMemoryProfile(),
  recommendation: recommendationProfileManager.createDefaultRecommendationProfile(),
  revision: 1,
  lastUpdatedIso: new Date().toISOString()
};

export const mockStudentDigitalTwinAnxious: StudentDigitalTwinState = {
  ...mockStudentDigitalTwinNormal,
  identity: identityProfileManager.createDefaultIdentity('std_anxious_456', 'Ana Costa', 'ana.costa@fluento.pt'),
  emotional: {
    ...emotionalProfileManager.createDefaultEmotionalProfile(),
    baselineAnxietyLevel: 75,
    affectiveFilterSensitivity: 'high',
    confidenceScores: {
      speaking: 35,
      listening: 60,
      vocabulary: 50,
      grammar: 45,
      pronunciation: 50,
      overall: 48
    }
  },
  revision: 1,
  lastUpdatedIso: new Date().toISOString()
};
