/**
 * Lesson Quality Evaluator Engine (Sprint 5)
 * Calculates the internal "Lesson Quality Score" across 8 key pedagogical criteria:
 * 1. Learning Effectiveness (0-100)
 * 2. Long-term Retention Potential (0-100)
 * 3. Confidence Growth (0-100)
 * 4. Post-Session Motivation (0-100)
 * 5. Conversational Naturalness (0-100)
 * 6. Student Talk Time Ratio (0-100)
 * 7. Micro-Goal Achievement (0-100)
 * 8. Flow State Index (0-100)
 *
 * CRITICAL RULE: This score is used purely internally to optimize future lessons
 * and is NEVER shown directly as a grade to the end user.
 */

import { LessonQualityScore, ComposedLesson } from './lesson-composer-types';

export interface LessonTelemetry {
  overallScore: number; // 0-100
  speakingDurationSeconds: number;
  teacherDurationSeconds: number;
  userConfidenceDelta: number; // e.g. +5 or -2
  userFrustrationLevel: number; // 0-100
  completedBlockCount: number;
  totalBlockCount: number;
  wordsLearnedCount: number;
  accuracyPercentage: number;
}

export class LessonQualityEngine {
  /**
   * Evaluates session telemetry and calculates the internal Lesson Quality Score.
   */
  public static evaluateQuality(
    lesson: ComposedLesson,
    telemetry: LessonTelemetry
  ): LessonQualityScore {
    // 1. Student Talk Time Score
    const totalTalkSeconds = telemetry.speakingDurationSeconds + telemetry.teacherDurationSeconds;
    const studentTalkRatio = totalTalkSeconds > 0
      ? (telemetry.speakingDurationSeconds / totalTalkSeconds) * 100
      : 50;
    
    // Ideal student talk time is >= 60%
    const studentTalkTimeScore = Math.min(100, Math.round((studentTalkRatio / 65) * 100));

    // 2. Micro-Goal Achievement
    const completionRatio = telemetry.totalBlockCount > 0
      ? telemetry.completedBlockCount / telemetry.totalBlockCount
      : 1;
    const objectiveMetScore = Math.round(telemetry.accuracyPercentage * 0.6 + completionRatio * 40);

    // 3. Learning Effectiveness
    const learningScore = Math.round(
      telemetry.accuracyPercentage * 0.5 +
      Math.min(100, telemetry.wordsLearnedCount * 15) * 0.3 +
      objectiveMetScore * 0.2
    );

    // 4. Retention Potential
    const retentionScore = Math.round(
      learningScore * 0.6 +
      (lesson.memoryThreads.length > 0 ? 30 : 10) +
      (telemetry.accuracyPercentage >= 75 ? 10 : 0)
    );

    // 5. Confidence Growth
    const confidenceScore = Math.min(100, Math.max(10, Math.round(60 + telemetry.userConfidenceDelta * 4)));

    // 6. Post-Session Motivation
    const motivationScore = Math.min(
      100,
      Math.max(10, Math.round(80 - telemetry.userFrustrationLevel * 0.5 + telemetry.userConfidenceDelta * 2))
    );

    // 7. Conversational Naturalness
    const naturalnessScore = Math.round(
      studentTalkTimeScore * 0.4 +
      (telemetry.teacherDurationSeconds < 300 ? 30 : 15) +
      30
    );

    // 8. Flow State Index
    const flowStateIndex = Math.round(
      (learningScore + motivationScore + studentTalkTimeScore) / 3 - telemetry.userFrustrationLevel * 0.3
    );

    // Weighted Overall Composite (Internal System Metric)
    const overallQualityScore = Math.min(
      100,
      Math.max(
        10,
        Math.round(
          learningScore * 0.20 +
          retentionScore * 0.15 +
          confidenceScore * 0.15 +
          motivationScore * 0.15 +
          naturalnessScore * 0.10 +
          studentTalkTimeScore * 0.10 +
          objectiveMetScore * 0.15
        )
      )
    );

    const evaluationRationale = `Pontuação de Qualidade Global: ${overallQualityScore}/100. Tempo de fala do aluno: ${Math.round(
      studentTalkRatio
    )}%. Aprendizagem: ${learningScore}%. Flow: ${flowStateIndex}%.`;

    return {
      learningScore,
      retentionScore,
      confidenceScore,
      motivationScore,
      naturalnessScore,
      studentTalkTimeScore: Math.round(studentTalkRatio),
      objectiveMetScore,
      flowStateIndex: Math.max(0, flowStateIndex),
      overallQualityScore,
      evaluationRationale,
    };
  }
}
