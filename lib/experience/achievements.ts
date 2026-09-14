import { AdultAchievement } from '@/types/experience';
import { StudentModel } from '@/types/brain';

export const INITIAL_ADULT_ACHIEVEMENTS: AdultAchievement[] = [
  {
    id: 'ach-const-7',
    title: '7-Day Immersion Consistency',
    description: 'Completed at least one 15-minute immersion session for 7 consecutive days.',
    category: 'consistency',
    isUnlocked: false,
    metricCriteria: '7 consecutive streak days',
    professionalBadgeTitle: 'Disciplined Practitioner',
  },
  {
    id: 'ach-pron-85',
    title: 'Phonetic Accuracy Milestone',
    description: 'Achieved an average pronunciation accuracy score of 85%+ in native dialogue.',
    category: 'pronunciation',
    isUnlocked: false,
    metricCriteria: '85%+ speaking mastery score',
    professionalBadgeTitle: 'Acoustic Precisionist',
  },
  {
    id: 'ach-conf-b2',
    title: 'Conversational Autonomy',
    description: 'Maintained 15 minutes of unscripted conversation with zero native fallback requests.',
    category: 'confidence',
    isUnlocked: false,
    metricCriteria: '100% target language imersion in B2 session',
    professionalBadgeTitle: 'Autonomous Speaker',
  },
  {
    id: 'ach-vocab-200',
    title: '200 Active Vocabulary Milestone',
    description: 'Successfully deployed 200 distinct words in active conversational contexts.',
    category: 'vocabulary',
    isUnlocked: false,
    metricCriteria: '200 active vocabulary items mastered',
    professionalBadgeTitle: 'Lexical Architect',
  },
  {
    id: 'ach-goal-work',
    title: 'Workplace Simulation Master',
    description: 'Completed 5 professional workplace scenarios without critical syntax errors.',
    category: 'goals',
    isUnlocked: false,
    metricCriteria: '5 workplace scenarios completed',
    professionalBadgeTitle: 'Executive Communicator',
  },
];

/**
 * Achievement Service
 * Evaluates professional adult milestones based on real performance metrics.
 */
export class AchievementService {
  private achievements: AdultAchievement[];

  constructor(initialAchievements: AdultAchievement[] = INITIAL_ADULT_ACHIEVEMENTS) {
    this.achievements = [...initialAchievements];
  }

  /**
   * Checks student state and unlocks newly eligible achievements.
   */
  public evaluateAchievements(
    studentModel: StudentModel,
    streakDays: number,
    completedSessionsCount: number
  ): {
    unlockedAchievements: AdultAchievement[];
    allAchievements: AdultAchievement[];
  } {
    const newlyUnlocked: AdultAchievement[] = [];

    this.achievements = this.achievements.map((ach) => {
      if (ach.isUnlocked) return ach;

      let unlock = false;

      if (ach.id === 'ach-const-7' && streakDays >= 7) unlock = true;
      if (ach.id === 'ach-pron-85' && studentModel.speakingMasteryPercent >= 85) unlock = true;
      if (ach.id === 'ach-conf-b2' && studentModel.confidenceScore >= 80 && studentModel.currentCefr !== 'A1') unlock = true;
      if (ach.id === 'ach-vocab-200' && studentModel.vocabularyMasteryPercent >= 75) unlock = true;
      if (ach.id === 'ach-goal-work' && completedSessionsCount >= 5 && studentModel.grammarMasteryPercent >= 70) unlock = true;

      if (unlock) {
        const updated = {
          ...ach,
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
        };
        newlyUnlocked.push(updated);
        return updated;
      }

      return ach;
    });

    return {
      unlockedAchievements: newlyUnlocked,
      allAchievements: [...this.achievements],
    };
  }

  public getAchievements(): AdultAchievement[] {
    return [...this.achievements];
  }
}

export const defaultAchievementService = new AchievementService();
