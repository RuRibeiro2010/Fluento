/**
 * FLUENTO LEARNING ANALYTICS - ANXIETY ANALYZER
 * 
 * Tracks speaking anxiety trajectory over time, measuring anxiety reduction
 * from baseline and affective filter status.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { AnxietyTrendMetric } from './types';

export class AnxietyAnalyzer {
  public analyzeAnxietyTrend(twin: StudentDigitalTwinState): AnxietyTrendMetric {
    const baselineAnxietyLevel = twin.emotional.baselineAnxietyLevel ?? 40;
    
    // We infer current anxiety level from speaking confidence and recent session metrics
    const speakingConfidence = twin.emotional.confidenceScores.speaking || 50;
    const currentAnxietyLevel = Math.max(0, Math.min(100, Math.round(100 - speakingConfidence * 0.8)));

    const anxietyDelta = currentAnxietyLevel - baselineAnxietyLevel; // negative delta = reduction (good)

    let trend: 'significantly_decreased' | 'improving' | 'stable' | 'escalating' = 'stable';
    if (anxietyDelta <= -20) {
      trend = 'significantly_decreased';
    } else if (anxietyDelta <= -5) {
      trend = 'improving';
    } else if (anxietyDelta >= 15) {
      trend = 'escalating';
    }

    let affectiveFilterStatus: 'optimal' | 'moderate' | 'panic' = 'optimal';
    if (currentAnxietyLevel >= 75) {
      affectiveFilterStatus = 'panic';
    } else if (currentAnxietyLevel >= 45) {
      affectiveFilterStatus = 'moderate';
    }

    return {
      currentAnxietyLevel,
      baselineAnxietyLevel,
      anxietyDelta,
      trend,
      affectiveFilterStatus,
      evaluationNote: `Ansiedade comunicativa ${trend}: nível atual ${currentAnxietyLevel}% vs baseline ${baselineAnxietyLevel}%.`
    };
  }
}

export const anxietyAnalyzer = new AnxietyAnalyzer();
