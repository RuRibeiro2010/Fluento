/**
 * FLUENTO LEARNING ENGINE - LEARNING ROI
 * 
 * Computes real Learning Return on Investment (ROI) focusing on authentic
 * outcomes: Confidence Shift, Communicative Autonomy, Real-World Readiness,
 * and Willingness to Communicate (WTC).
 * Rejects vanity metrics like streaks, app time, or message counts.
 */

import { StudentLearningState, LearningRoiMetrics, FlowMetrics } from './types';

export class LearningRoiEngine {
  /**
   * Computes the real Learning ROI metrics after a session.
   */
  public evaluateLearningRoi(
    initialState: StudentLearningState,
    finalState: StudentLearningState,
    flowMetrics: FlowMetrics,
    studentTalkTimeRatio: number = 65
  ): LearningRoiMetrics {
    // 1. Confidence Delta
    const initialConfidence = initialState.confidenceScores.overall;
    const finalConfidence = finalState.confidenceScores.overall;
    const confidenceDelta = Math.round(finalConfidence - initialConfidence);

    // 2. Communicative Autonomy (based on STT ratio, low hesitation, and high flow)
    const sttBonus = Math.min(30, (studentTalkTimeRatio / 100) * 30);
    const flowBonus = (flowMetrics.flowStateIndex / 100) * 40;
    const anxietyReductionBonus = Math.max(0, (initialState.speakingAnxietyLevel - finalState.speakingAnxietyLevel) * 0.3);
    
    const communicativeAutonomyScore = Math.min(100, Math.round(sttBonus + flowBonus + anxietyReductionBonus + 30));

    // 3. Retention Efficiency (100 - cognitive overload)
    const retentionEfficiencyPercent = Math.min(100, Math.max(20, Math.round(100 - flowMetrics.cognitiveLoadScore * 0.4)));

    // 4. Real World Readiness
    const realWorldReadinessScore = Math.min(100, Math.round((communicativeAutonomyScore * 0.5) + (finalState.confidenceScores.speaking * 0.5)));

    // 5. Willingness to Communicate (WTC - MacIntyre SLA theory)
    const willingnessToCommunicate = Math.min(100, Math.max(0, Math.round(100 - finalState.speakingAnxietyLevel + (finalConfidence * 0.3))));

    // Composite ROI Score
    const overallLearningRoi = Math.round(
      (communicativeAutonomyScore * 0.35) +
      (realWorldReadinessScore * 0.30) +
      (willingnessToCommunicate * 0.20) +
      (retentionEfficiencyPercent * 0.15)
    );

    let qualitativeSummary = 'Aumento tangível de confiança oral e autonomia de comunicação.';
    if (confidenceDelta > 5) {
      qualitativeSummary = 'Evolução notável na segurança de fala e redução significativa do filtro afetivo.';
    } else if (overallLearningRoi >= 85) {
      qualitativeSummary = 'Sessão de alta performance com forte transferência para situações reais do mundo real.';
    } else if (finalState.speakingAnxietyLevel < initialState.speakingAnxietyLevel) {
      qualitativeSummary = 'Desbloqueio eficaz da ansiedade oral com ganho em prontidão comunicativa.';
    }

    return {
      confidenceDelta,
      communicativeAutonomyScore,
      retentionEfficiencyPercent,
      realWorldReadinessScore,
      willingnessToCommunicate,
      overallLearningRoi,
      qualitativeSummary
    };
  }
}

export const learningRoiEngine = new LearningRoiEngine();
