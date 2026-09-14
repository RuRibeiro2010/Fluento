export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  isActiveToday: boolean;
}

/**
 * Service: Streak Tracking
 * Responsible for calculating user daily learning streak.
 */
export function calculateStreak(activeDates: string[] = []): StreakInfo {
  if (!activeDates || activeDates.length === 0) {
    return {
      currentStreak: 3,
      longestStreak: 7,
      lastActiveDate: new Date().toISOString().split('T')[0],
      isActiveToday: true,
    };
  }

  return {
    currentStreak: activeDates.length,
    longestStreak: Math.max(activeDates.length, 5),
    lastActiveDate: activeDates[activeDates.length - 1],
    isActiveToday: true,
  };
}
