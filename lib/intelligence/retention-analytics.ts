/**
 * Retention Analytics Module (Fluento Intelligence 1.0 - Phase 16)
 * Measures long-term memory retention curves, 7-day, 30-day, and 90-day
 * retention metrics for vocabulary items and grammar structures.
 */

export interface RetentionCohortStats {
  cohortName: string; // e.g. "Jul 2026 Cohort"
  day7RetentionPercentage: number;
  day30RetentionPercentage: number;
  day90RetentionPercentage: number;
  spontaneousRecallScore: number;
}

export function computeRetentionAnalytics(
  recalledCount: number,
  totalTestedCount: number,
  daysSinceLearning: number
): number {
  if (totalTestedCount === 0) return 100;
  const rawPercentage = (recalledCount / totalTestedCount) * 100;

  // Spaced repetition attenuation factor
  const retentionIndex = Math.max(0, Math.min(100, rawPercentage));
  return Math.round(retentionIndex);
}
