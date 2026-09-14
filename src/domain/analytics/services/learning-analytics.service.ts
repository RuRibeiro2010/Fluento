import { StudentAnalyticsEntity } from '../entities/student-analytics.entity';

export class LearningAnalyticsService {
  /**
   * Evaluates overall learning velocity based on monthly practice minutes and accuracy.
   */
  public evaluateLearningVelocity(analytics: StudentAnalyticsEntity): 'alta' | 'moderada' | 'revisar_metas' {
    const minutes = analytics.monthlyStats.totalMinutesPracticed;
    const accuracy = analytics.monthlyStats.averageAccuracyPercent;

    if (minutes >= 300 && accuracy >= 75) return 'alta';
    if (minutes >= 120 && accuracy >= 60) return 'moderada';
    return 'revisar_metas';
  }
}
