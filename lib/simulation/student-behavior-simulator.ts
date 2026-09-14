/**
 * Student Behavior Simulator (Sprint 1)
 * Simulates real-time behavioral responses, hesitation intervals, speech production ratio,
 * cognitive fatigue accumulation, and emotional state changes during learning interactions.
 */

import { SyntheticStudentProfile, StudentSessionTelemetry } from './simulation-types';

export class StudentBehaviorSimulator {
  /**
   * Simulates student telemetry outcome for a session given student traits and teacher quality.
   */
  public static simulateSessionTelemetry(
    profile: SyntheticStudentProfile,
    sessionNumber: number,
    teacherAdaptationQuality: number // 0-100
  ): StudentSessionTelemetry {
    const { traits } = profile;

    // 1. Calculate Student Talk Time Ratio (%)
    // High anxiety/shyness depresses talk time, high teacher adaptation & confidence boosts it.
    const baseTalkTime = 65 - traits.shynessLevel * 0.3 - traits.speakingAnxietyLevel * 0.25;
    const adaptationBonus = (teacherAdaptationQuality / 100) * 20;
    const sessionExperienceBonus = Math.min(15, sessionNumber * 1.5);

    const studentTalkTimeRatio = Math.min(
      90,
      Math.max(25, Math.round(baseTalkTime + adaptationBonus + sessionExperienceBonus))
    );

    // 2. Calculate Confidence Growth (0-100)
    const rawConfidence = 50 - traits.speakingAnxietyLevel * 0.3 + (teacherAdaptationQuality - 50) * 0.4 + sessionExperienceBonus;
    const confidenceScore = Math.min(100, Math.max(15, Math.round(rawConfidence)));

    // 3. Cognitive Load (0-100)
    // Dyslexia or time constraints increase cognitive load; high learning speed decreases it.
    let baseLoad = 45 + (traits.hasDyslexia ? 20 : 0) - traits.learningSpeed * 0.2;
    if (traits.dailyAvailableMinutes <= 10) baseLoad += 15;
    const cognitiveLoadScore = Math.min(100, Math.max(10, Math.round(baseLoad)));

    // 4. Retention Score (0-100)
    const rawRetention = 80 - traits.retentionDecayRate * 0.4 + (traits.learningSpeed / 100) * 15 + (teacherAdaptationQuality > 70 ? 10 : 0);
    const retentionScore = Math.min(100, Math.max(20, Math.round(rawRetention)));

    // 5. Flow State Index (0-100)
    const flowStateIndex = Math.min(
      100,
      Math.max(
        10,
        Math.round((studentTalkTimeRatio * 0.35 + confidenceScore * 0.35 + (100 - cognitiveLoadScore) * 0.3))
      )
    );

    // 6. Learning ROI & Motivation
    const learningRoiScore = Math.min(100, Math.max(30, Math.round(retentionScore * 0.5 + studentTalkTimeRatio * 0.5)));
    const motivationScore = Math.min(100, Math.max(20, Math.round(confidenceScore * 0.6 + flowStateIndex * 0.4)));
    const naturalnessScore = Math.min(100, Math.max(20, Math.round(studentTalkTimeRatio * 0.7 + (100 - traits.speakingAnxietyLevel) * 0.3)));
    const progressScore = Math.min(100, Math.max(15, Math.round(retentionScore * 0.6 + sessionNumber * 2)));

    return {
      retentionScore,
      confidenceScore,
      studentTalkTimeRatio,
      cognitiveLoadScore,
      motivationScore,
      naturalnessScore,
      progressScore,
      learningRoiScore,
      flowStateIndex,
    };
  }
}
