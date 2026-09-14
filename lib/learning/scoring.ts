export interface ScoreBreakdown {
  accuracy: number;
  speedBonus: number;
  finalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export function calculateScore(
  correctAnswers: number,
  totalQuestions: number,
  timeSeconds?: number
): ScoreBreakdown {
  if (totalQuestions <= 0) {
    return { accuracy: 0, speedBonus: 0, finalScore: 0, grade: 'F' };
  }

  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  let speedBonus = 0;

  if (timeSeconds && timeSeconds < totalQuestions * 10) {
    speedBonus = 10;
  }

  const finalScore = Math.min(100, accuracy + speedBonus);

  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (finalScore >= 90) grade = 'A';
  else if (finalScore >= 80) grade = 'B';
  else if (finalScore >= 70) grade = 'C';
  else if (finalScore >= 60) grade = 'D';

  return {
    accuracy,
    speedBonus,
    finalScore,
    grade,
  };
}
