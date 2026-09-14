/**
 * FLUENTO LEARNING ANALYTICS - ROI ANALYZER
 * 
 * Measures Learning Return on Investment (ROI) by evaluating observable progress gains
 * per active practice hour spent, ignoring empty vanity time metrics.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { ThreadSnapshot } from '@/src/lib/learning-threads';
import { LearningROIMetric } from './types';

export class ROIAnalyzer {
  public analyzeROI(
    twin: StudentDigitalTwinState,
    threads: ThreadSnapshot
  ): LearningROIMetric {
    const totalSpeakingTimeSeconds = twin.behaviour.totalSpeakingTimeSeconds || 0;
    const completedSessions = twin.behaviour.completedSessionsCount || 0;

    // Estimate total practice hours (defaulting to session estimate if speaking time not recorded)
    const totalHoursSpent = Math.max(
      0.25,
      totalSpeakingTimeSeconds > 0
        ? totalSpeakingTimeSeconds / 3600
        : (completedSessions * 15) / 60
    );

    const masteredConceptsTotal =
      threads.successes.length +
      threads.difficulties.filter(d => d.isResolved).length +
      threads.reviewItems.filter(r => r.consecutiveSuccesses >= 2).length;

    // Progress points per hour spent (e.g. 10 mastered concepts over 2 hours = 5.0)
    const progressPointsPerHoursSpent = Math.round((masteredConceptsTotal / totalHoursSpent) * 10) / 10;

    const efficiencyScore = Math.min(
      100,
      Math.round(Math.min(10, progressPointsPerHoursSpent) * 10)
    );

    let roiRating: 'exceptional' | 'high' | 'moderate' | 'suboptimal' = 'high';
    if (progressPointsPerHoursSpent >= 8.0) {
      roiRating = 'exceptional';
    } else if (progressPointsPerHoursSpent >= 4.0) {
      roiRating = 'high';
    } else if (progressPointsPerHoursSpent >= 1.5) {
      roiRating = 'moderate';
    } else {
      roiRating = 'suboptimal';
    }

    return {
      progressPointsPerHoursSpent,
      efficiencyScore,
      totalHoursSpent: Math.round(totalHoursSpent * 10) / 10,
      masteredConceptsTotal,
      roiRating,
      evaluationNote: `ROI pedagógico ${roiRating}: ${progressPointsPerHoursSpent} pontos de progresso por hora praticada.`
    };
  }
}

export const roiAnalyzer = new ROIAnalyzer();
