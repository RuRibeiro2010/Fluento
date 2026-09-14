/**
 * Prediction Engine Module (Fluento Intelligence 1.0 - Phase 16)
 * Forecasts churn risk, forgetting probability, ideal review timing,
 * next challenge timing, and optimal teacher persona assignment.
 */

export interface PredictiveForecasting {
  churnRiskPercentage: number;
  forgettingRiskScore: number; // 0 to 100
  recommendedNextReviewWindowHours: number;
  readyForNextChallenge: boolean;
  idealNextLessonMinutes: number;
  predictedTeacherPersonaId: string;
}

export function generatePredictiveForecasting(input: {
  daysSinceLastSession: number;
  recentStreakDays: number;
  averageAccuracy: number;
  perceivedFatigueScore: number;
}): PredictiveForecasting {
  // Churn Risk
  let churnRiskPercentage = 10;
  if (input.daysSinceLastSession >= 3) churnRiskPercentage += 30;
  if (input.daysSinceLastSession >= 7) churnRiskPercentage += 40;
  if (input.recentStreakDays === 0) churnRiskPercentage += 15;
  churnRiskPercentage = Math.min(99, churnRiskPercentage);

  // Forgetting Risk based on spaced repetition decay
  const forgettingRiskScore = Math.min(100, Math.round(input.daysSinceLastSession * 18 + (100 - input.averageAccuracy) * 0.4));

  // Ideal next review window
  const recommendedNextReviewWindowHours = forgettingRiskScore > 60 ? 12 : 24;

  // Challenge readiness
  const readyForNextChallenge = input.averageAccuracy >= 85 && input.perceivedFatigueScore <= 4 && input.daysSinceLastSession <= 2;

  // Lesson duration
  let idealNextLessonMinutes = 15;
  if (input.perceivedFatigueScore >= 7) idealNextLessonMinutes = 5;
  else if (readyForNextChallenge) idealNextLessonMinutes = 20;

  // Preferred Teacher Persona
  let predictedTeacherPersonaId = 'teacher-lucas';
  if (churnRiskPercentage > 50 || input.perceivedFatigueScore >= 7) {
    predictedTeacherPersonaId = 'teacher-sofia'; // Calmer, empathetic
  } else if (readyForNextChallenge) {
    predictedTeacherPersonaId = 'teacher-marcos'; // Demanding
  }

  return {
    churnRiskPercentage,
    forgettingRiskScore,
    recommendedNextReviewWindowHours,
    readyForNextChallenge,
    idealNextLessonMinutes,
    predictedTeacherPersonaId,
  };
}
