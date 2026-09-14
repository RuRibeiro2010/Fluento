/**
 * FLUENTO STUDENT DIGITAL TWIN - GOAL PROFILE
 * 
 * Manages goals, target deadlines, weekly minute commitments, and professional focus domains.
 */

import { GoalProfile } from './types';

export class GoalProfileManager {
  public createDefaultGoalProfile(): GoalProfile {
    return {
      targetCefrGoal: 'B2',
      primaryMotivation: 'Fluência no Contexto Profissional',
      professionalDomain: 'Engenharia & Tecnologia',
      weeklyMinutesGoal: 45,
      completedMinutesThisWeek: 0
    };
  }
}

export const goalProfileManager = new GoalProfileManager();
