/**
 * Learning Momentum Engine (Sprint 5)
 * Calculates the student's real-time momentum before constructing a lesson:
 * Is the student having a good day? Tired? Motivated? Frustrated? In Flow?
 * Dynamically adjusts lesson duration, pacing, difficulty, activity focus, and correction density.
 */

import { LearningMomentumState } from './lesson-composer-types';

export interface MomentumInput {
  fatigueScore: number; // 0 (rested) to 10 (exhausted)
  confidenceRating: number; // 1 to 10
  recentAccuracyPercentage: number; // 0 to 100
  streakDays: number;
  unreviewedItemsCount: number;
  availableMinutes: number;
  perceivedFrustration?: number; // 0 to 100
}

export class LearningMomentumEngine {
  /**
   * Calculates the real-time Learning Momentum State.
   */
  public static calculateMomentum(input: MomentumInput): LearningMomentumState {
    const fatigue = Math.min(10, Math.max(0, input.fatigueScore));
    const confidence = Math.min(10, Math.max(1, input.confidenceRating));
    const accuracy = Math.min(100, Math.max(0, input.recentAccuracyPercentage));
    const frustration = input.perceivedFrustration || (fatigue >= 8 ? 65 : 15);

    // Composite momentum score (0-100)
    const rawScore =
      accuracy * 0.35 +
      confidence * 4.5 +
      Math.min(10, input.streakDays) * 2 -
      fatigue * 4.5 -
      frustration * 0.2;

    const momentumScore = Math.min(100, Math.max(10, Math.round(rawScore)));

    // Categorize emotional zone
    let emotionalZone: LearningMomentumState['emotionalZone'] = 'steady_progress';
    if (frustration >= 60 || (fatigue >= 8 && confidence <= 4)) {
      emotionalZone = 'frustrated';
    } else if (fatigue >= 7) {
      emotionalZone = 'mentally_tired';
    } else if (momentumScore >= 80 && accuracy >= 82 && confidence >= 7) {
      emotionalZone = 'flow_state';
    } else if (momentumScore >= 65 || input.streakDays >= 5) {
      emotionalZone = 'high_motivation';
    }

    // Determine adaptive parameters based on momentum
    let recommendedPacing: LearningMomentumState['recommendedPacing'] = 'standard';
    let recommendedDurationMinutes = Math.min(input.availableMinutes, 15);
    let recommendedDifficultyOffset = 0.0;
    let recommendedCorrectionDensity: LearningMomentumState['recommendedCorrectionDensity'] = 'selective';
    let primaryActivityFocus = 'Conversação Situacional Prática';

    switch (emotionalZone) {
      case 'flow_state':
        recommendedPacing = 'deep_immersion';
        recommendedDurationMinutes = Math.min(input.availableMinutes, 25);
        recommendedDifficultyOffset = +0.15;
        recommendedCorrectionDensity = 'thorough';
        primaryActivityFocus = 'Roleplay Desafiador & Produção Espontânea Avançada';
        break;

      case 'high_motivation':
        recommendedPacing = 'standard';
        recommendedDurationMinutes = Math.min(input.availableMinutes, 20);
        recommendedDifficultyOffset = +0.05;
        recommendedCorrectionDensity = 'selective';
        primaryActivityFocus = 'Conversação & Missão Situacional do Mundo Real';
        break;

      case 'steady_progress':
        recommendedPacing = 'standard';
        recommendedDurationMinutes = Math.min(input.availableMinutes, 15);
        recommendedDifficultyOffset = 0.0;
        recommendedCorrectionDensity = 'selective';
        primaryActivityFocus = 'Prática Guiada & Consolidação de Conceitos';
        break;

      case 'mentally_tired':
        recommendedPacing = 'micro';
        recommendedDurationMinutes = Math.min(input.availableMinutes, 10);
        recommendedDifficultyOffset = -0.2;
        recommendedCorrectionDensity = 'minimal';
        primaryActivityFocus = 'Listening Leve, Shadowing & Diálogos Relaxados';
        break;

      case 'frustrated':
        recommendedPacing = 'micro';
        recommendedDurationMinutes = Math.min(input.availableMinutes, 8);
        recommendedDifficultyOffset = -0.25;
        recommendedCorrectionDensity = 'minimal';
        primaryActivityFocus = 'Vitórias Rápidas, Elogios & Revisão de Tópicos Dominados';
        break;
    }

    return {
      score: momentumScore,
      emotionalZone,
      recommendedPacing,
      recommendedDurationMinutes,
      recommendedDifficultyOffset,
      recommendedCorrectionDensity,
      primaryActivityFocus,
    };
  }
}
