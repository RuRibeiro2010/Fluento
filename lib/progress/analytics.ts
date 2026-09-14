export interface ProgressMetrics {
  totalLessonsCompleted: number;
  totalMinutesSpent: number;
  averageAccuracy: number;
  wordsMastered: number;
}

/**
 * Service: Progress Analytics
 * Responsible for tracking user metrics and learning stats.
 */
export function getUserMetrics(userId: string): ProgressMetrics {
  return {
    totalLessonsCompleted: 4,
    totalMinutesSpent: 65,
    averageAccuracy: 88,
    wordsMastered: 42,
  };
}
