/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - TIME PLANNER
 * 
 * Recommends optimal session duration based on student habits, preferred practice duration,
 * and current cognitive capacity/anxiety levels.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { LearningAnalyticsReport } from '@/src/lib/learning-analytics';

export class TimePlanner {
  public planDuration(
    twin: StudentDigitalTwinState,
    analytics?: LearningAnalyticsReport
  ): number {
    const preferredMinutes = twin.recommendation.recommendedSessionDurationMinutes || 15;

    // Reduce duration if affective filter is panic or confidence is very low to prevent burnout
    if (analytics && analytics.anxietyTrend.affectiveFilterStatus === 'panic') {
      return 10;
    }

    // High velocity & high confidence -> option for fuller 20 min session
    if (analytics && analytics.velocity.velocityRating === 'accelerated' && analytics.confidence.score > 80) {
      return Math.min(25, Math.max(15, preferredMinutes));
    }

    return Math.max(5, Math.min(30, preferredMinutes));
  }
}

export const timePlanner = new TimePlanner();
