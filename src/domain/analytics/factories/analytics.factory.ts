import { StudentAnalyticsEntity } from '../entities/student-analytics.entity';
import { PeriodStats } from '../value-objects/period-stats.vo';
import { FluencyIndex } from '../value-objects/fluency-index.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';

export class AnalyticsFactory {
  public static createDefaultAnalytics(studentId: string): StudentAnalyticsEntity {
    return StudentAnalyticsEntity.create(`anl_${studentId}`, {
      studentId,
      weeklyStats: PeriodStats.create({
        sessionsCompleted: 4,
        totalMinutesPracticed: 85,
        wordsLearnedCount: 28,
        grammarRulesMasteredCount: 3,
        averageAccuracyPercent: 88,
      }),
      monthlyStats: PeriodStats.create({
        sessionsCompleted: 14,
        totalMinutesPracticed: 290,
        wordsLearnedCount: 94,
        grammarRulesMasteredCount: 11,
        averageAccuracyPercent: 86,
      }),
      fluencyIndex: FluencyIndex.create(78, 82, 74),
      lastCalculatedAt: TimeStamp.now(),
    });
  }
}
