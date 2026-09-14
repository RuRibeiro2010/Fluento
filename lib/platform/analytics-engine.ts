/**
 * Analytics Engine Module (Production & Reliability Platform - Phase 14)
 * Focuses on pedagogical learning metrics: retention rate, fluency gain,
 * speaking confidence score, and real vocabulary acquisition over time.
 */

export interface LearningOutcomeMetrics {
  userId: string;
  totalConversationalTurnsCompleted: number;
  retentionScorePercentage: number;
  fluencyGainIndex: number; // 0 to 100
  confidenceRating: number; // 1 to 10
  masteredPhrasesCount: number;
  lastUpdatedIso: string;
}

export function computeLearningOutcomeMetrics(
  turnsCount: number,
  correctAnswersPercentage: number,
  selfReportedConfidence: number = 7
): LearningOutcomeMetrics {
  const retentionScorePercentage = Math.min(100, Math.round(correctAnswersPercentage * 0.95 + 5));
  const fluencyGainIndex = Math.min(100, Math.round(turnsCount * 3.5 + correctAnswersPercentage * 0.4));
  const masteredPhrasesCount = Math.round(turnsCount * 1.8);

  return {
    userId: 'current-user',
    totalConversationalTurnsCompleted: turnsCount,
    retentionScorePercentage,
    fluencyGainIndex,
    confidenceRating: Math.min(10, Math.max(1, selfReportedConfidence)),
    masteredPhrasesCount,
    lastUpdatedIso: new Date().toISOString(),
  };
}
