/**
 * FLUENTO LEARNING ANALYTICS - CONFIDENCE ANALYZER
 * 
 * Analyzes communication confidence based on domain confidence scores,
 * recent successes, and self-efficacy metrics from Digital Twin & Threads.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { ThreadSnapshot } from '@/src/lib/learning-threads';
import { ConfidenceMetric } from './types';

export class ConfidenceAnalyzer {
  public analyzeConfidence(
    twin: StudentDigitalTwinState,
    threads: ThreadSnapshot
  ): ConfidenceMetric {
    const scores = twin.emotional.confidenceScores;
    const speakingConfidence = scores.speaking;
    const listeningConfidence = scores.listening;
    const grammarConfidence = scores.grammar;
    const pronunciationConfidence = scores.pronunciation;

    // Weighted overall calculation
    const compositeScore = Math.round(
      speakingConfidence * 0.4 +
      listeningConfidence * 0.2 +
      grammarConfidence * 0.2 +
      pronunciationConfidence * 0.2
    );

    // Boost score based on permanent success memories count
    const recentSuccessesCount = threads.successes.length;
    const successBonus = Math.min(10, recentSuccessesCount * 2);
    const finalScore = Math.min(100, compositeScore + successBonus);

    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (finalScore >= 70 && recentSuccessesCount >= 2) {
      trend = 'improving';
    } else if (finalScore < 45) {
      trend = 'declining';
    }

    return {
      score: finalScore,
      speakingConfidence,
      listeningConfidence,
      grammarConfidence,
      pronunciationConfidence,
      trend,
      evaluationNote: `Confiança comunicativa calculada em ${finalScore}/100 com tendência ${trend}.`
    };
  }
}

export const confidenceAnalyzer = new ConfidenceAnalyzer();
