import { LessonRecord } from '@/types/content';

export interface QualityMetrics {
  completionRate: number; // 0 - 100
  retentionScore: number; // 0 - 100
  improvementScore: number; // 0 - 100
  userSatisfaction: number; // 0 - 100
  coachConfidence: number; // 0 - 100
}

/**
 * Quality Score Engine
 * Evaluates lesson efficacy using a mathematical multi-factor formula.
 * Quality Score = (Completion * 0.30) + (Retention * 0.25) + (Improvement * 0.20) + (Satisfaction * 0.15) + (Confidence * 0.10)
 * Scaled strictly from 0 to 100. Premium Library threshold is >= 90.
 */
export class QualityScoreEngine {
  public static readonly PREMIUM_THRESHOLD = 90;

  /**
   * Calculates overall quality score from performance & feedback metrics
   */
  public calculateQualityScore(metrics: QualityMetrics): number {
    const {
      completionRate,
      retentionScore,
      improvementScore,
      userSatisfaction,
      coachConfidence,
    } = metrics;

    const weightedScore =
      completionRate * 0.3 +
      retentionScore * 0.25 +
      improvementScore * 0.2 +
      userSatisfaction * 0.15 +
      coachConfidence * 0.1;

    return Math.min(100, Math.max(0, Math.round(weightedScore)));
  }

  /**
   * Determines if a lesson record meets the strict Quality Threshold (>= 90)
   */
  public isEligibleForPremiumLibrary(qualityScore: number): boolean {
    return qualityScore >= QualityScoreEngine.PREMIUM_THRESHOLD;
  }

  /**
   * Updates an existing lesson record with new session outcome data
   */
  public updateRecordQuality(
    record: LessonRecord,
    newSessionMetrics: Partial<QualityMetrics>
  ): LessonRecord {
    const updatedMetrics: QualityMetrics = {
      completionRate: Math.round((record.completionRate + (newSessionMetrics.completionRate ?? record.completionRate)) / 2),
      retentionScore: Math.round((record.retentionScore + (newSessionMetrics.retentionScore ?? record.retentionScore)) / 2),
      improvementScore: Math.round((record.improvementScore + (newSessionMetrics.improvementScore ?? record.improvementScore)) / 2),
      userSatisfaction: Math.round((record.userSatisfaction + (newSessionMetrics.userSatisfaction ?? record.userSatisfaction)) / 2),
      coachConfidence: Math.round((record.coachConfidence + (newSessionMetrics.coachConfidence ?? record.coachConfidence)) / 2),
    };

    const newQualityScore = this.calculateQualityScore(updatedMetrics);
    const isPremium = this.isEligibleForPremiumLibrary(newQualityScore);

    return {
      ...record,
      ...updatedMetrics,
      qualityScore: newQualityScore,
      isPremiumLibraryMember: isPremium,
      lastUsedDate: new Date().toISOString(),
    };
  }
}

export const defaultQualityScoreEngine = new QualityScoreEngine();
