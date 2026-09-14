import { MotivationMemory } from '@/types/memory';

/**
 * Motivation Memory Module
 * Manages daily commitments, streak history, goals, and coach encouragement preferences.
 */
export class MotivationMemoryService {
  private memory: MotivationMemory;

  constructor(userId: string = 'usr_default') {
    this.memory = {
      userId,
      primaryMotivation: 'Travel & Relocation Confidence',
      dailyCommitmentMinutes: 15,
      currentStreakDays: 5,
      longestStreakDays: 12,
      coachPersonalityPreference: 'Empathetic & Structured',
      lastActiveDate: new Date().toISOString(),
      milestonesUnlocked: [
        'First Conversation Completed',
        '5-Day Practice Streak',
        'A2 Level Milestone',
      ],
    };
  }

  public get(): MotivationMemory {
    return { ...this.memory };
  }

  public registerActivity(): { streakUpdated: boolean; currentStreak: number } {
    const now = new Date();
    const lastActive = new Date(this.memory.lastActiveDate);

    const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 3600);

    let streakUpdated = false;
    if (diffHours >= 18 && diffHours <= 48) {
      this.memory.currentStreakDays += 1;
      if (this.memory.currentStreakDays > this.memory.longestStreakDays) {
        this.memory.longestStreakDays = this.memory.currentStreakDays;
      }
      streakUpdated = true;
    } else if (diffHours > 48) {
      this.memory.currentStreakDays = 1;
      streakUpdated = true;
    }

    this.memory.lastActiveDate = now.toISOString();
    return { streakUpdated, currentStreak: this.memory.currentStreakDays };
  }

  public unlockMilestone(milestoneName: string): boolean {
    if (!this.memory.milestonesUnlocked.includes(milestoneName)) {
      this.memory.milestonesUnlocked.push(milestoneName);
      return true;
    }
    return false;
  }
}
