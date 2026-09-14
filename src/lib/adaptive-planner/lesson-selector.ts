/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - LESSON SELECTOR
 * 
 * Determines the ideal pedagogical lesson mode for the upcoming practice session.
 */

import { LearningAnalyticsReport } from '@/src/lib/learning-analytics';
import { LessonMode } from './types';

export class LessonSelector {
  public selectLessonMode(analytics?: LearningAnalyticsReport): LessonMode {
    if (!analytics) {
      return 'spontaneous_roleplay';
    }

    if (analytics.anxietyTrend.affectiveFilterStatus === 'panic' || analytics.confidence.score < 50) {
      return 'confidence_builder';
    }

    if (analytics.retention.dueReviewItemsCount >= 4 || analytics.retention.score < 55) {
      return 'vocabulary_reinforcement';
    }

    if (analytics.velocity.velocityRating === 'stalled') {
      return 'fluency_sprint';
    }

    return 'spontaneous_roleplay';
  }
}

export const lessonSelector = new LessonSelector();
