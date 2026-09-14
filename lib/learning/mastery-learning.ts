/**
 * Módulo 12: Mastery Learning Engine
 * Prevents premature classification of mastery. Requires verified multi-context consistency
 * and error-free streaks before marking any rule or vocabulary item as "Mastered".
 */

import { getLearningScienceConfig } from './science-config';

export interface ConceptMasteryRecord {
  conceptId: string;
  conceptName: string;
  successfulAttemptsCount: number;
  distinctContextsCount: number;
  recentErrorCount: number;
  lastConfidenceScore: number;
  isMastered: boolean;
}

export function evaluateConceptMastery(record: ConceptMasteryRecord): ConceptMasteryRecord {
  const criteria = getLearningScienceConfig().masteryCriteria;

  const hasEnoughAttempts = record.successfulAttemptsCount >= criteria.minStreakWithoutErrors;
  const hasEnoughContexts = record.distinctContextsCount >= criteria.requiredSuccessfulContextsCount;
  const hasEnoughConfidence = record.lastConfidenceScore >= criteria.requiredConfidenceScore;
  const zeroRecentErrors = record.recentErrorCount === 0;

  const isMastered = hasEnoughAttempts && hasEnoughContexts && hasEnoughConfidence && zeroRecentErrors;

  return {
    ...record,
    isMastered,
  };
}
