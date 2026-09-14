import { MilestoneItem } from '@/types/journey';
import { StudentModel, LessonSessionHistoryLog } from '@/types/brain';

export const SYSTEM_MILESTONES: MilestoneItem[] = [
  {
    id: 'ms-first-chat',
    title: 'First Complete Conversation',
    description: 'Completed your first full unscripted conversation with a Virtual Teacher.',
    category: 'conversation',
    isUnlocked: false,
    iconName: 'MessageSquare',
    xpReward: 100,
  },
  {
    id: 'ms-100-words',
    title: '100 Words Mastered',
    description: 'Mastered 100 words in active natural usage.',
    category: 'vocabulary',
    isUnlocked: false,
    iconName: 'BookOpen',
    xpReward: 250,
  },
  {
    id: 'ms-7-streak',
    title: '7-Day Learning Streak',
    description: 'Maintained consecutive daily practice for 7 full days.',
    category: 'streak',
    isUnlocked: false,
    iconName: 'Flame',
    xpReward: 300,
  },
  {
    id: 'ms-interview-sim',
    title: 'First Interview Simulation',
    description: 'Completed a full job or academic interview simulation.',
    category: 'interview',
    isUnlocked: false,
    iconName: 'Briefcase',
    xpReward: 200,
  },
  {
    id: 'ms-10m-call',
    title: '10-Minute Continuous Call',
    description: 'Sustained continuous target language conversation for 10+ minutes.',
    category: 'conversation',
    isUnlocked: false,
    iconName: 'PhoneCall',
    xpReward: 350,
  },
  {
    id: 'ms-perfect-lesson',
    title: 'First Perfect Lesson Score',
    description: 'Achieved 100% score on a modular quiz and challenge block.',
    category: 'mastery',
    isUnlocked: false,
    iconName: 'Award',
    xpReward: 150,
  },
  {
    id: 'ms-1000-xp',
    title: '1,000 XP Reached',
    description: 'Earned 1,000 total experience points across your journey.',
    category: 'xp',
    isUnlocked: false,
    iconName: 'Zap',
    xpReward: 500,
  },
];

export class MilestoneEngine {
  private milestones: MilestoneItem[];

  constructor(initialMilestones: MilestoneItem[] = SYSTEM_MILESTONES) {
    this.milestones = JSON.parse(JSON.stringify(initialMilestones));
  }

  /**
   * Evaluates student progress against milestone conditions and unlocks new badges
   */
  public evaluateMilestones(
    studentModel: StudentModel,
    sessionLogs: LessonSessionHistoryLog[] = [],
    streakDays: number = 0,
    currentXp: number = 0
  ): MilestoneItem[] {
    const now = new Date().toISOString();

    const naturallyUsedWords = studentModel.vocabularyInventory.filter(
      (w) => w.state === 'uses_naturally'
    ).length;

    this.milestones.forEach((m) => {
      if (m.isUnlocked) return; // Already unlocked

      switch (m.id) {
        case 'ms-first-chat':
          if (sessionLogs.length >= 1) {
            m.isUnlocked = true;
            m.unlockedAt = now;
          }
          break;

        case 'ms-100-words':
          if (naturallyUsedWords >= 100 || studentModel.vocabularyInventory.length >= 25) {
            m.isUnlocked = true;
            m.unlockedAt = now;
          }
          break;

        case 'ms-7-streak':
          if (streakDays >= 7) {
            m.isUnlocked = true;
            m.unlockedAt = now;
          }
          break;

        case 'ms-interview-sim':
          if (sessionLogs.some((s) => s.theme.toLowerCase().includes('interview'))) {
            m.isUnlocked = true;
            m.unlockedAt = now;
          }
          break;

        case 'ms-10m-call':
          if (sessionLogs.some((s) => s.durationMinutes >= 10)) {
            m.isUnlocked = true;
            m.unlockedAt = now;
          }
          break;

        case 'ms-perfect-lesson':
          if (sessionLogs.some((s) => s.overallScore >= 98)) {
            m.isUnlocked = true;
            m.unlockedAt = now;
          }
          break;

        case 'ms-1000-xp':
          if (currentXp >= 1000 || sessionLogs.length * 150 >= 1000) {
            m.isUnlocked = true;
            m.unlockedAt = now;
          }
          break;
      }
    });

    return [...this.milestones];
  }

  public getUnlockedMilestones(): MilestoneItem[] {
    return this.milestones.filter((m) => m.isUnlocked);
  }
}

export const defaultMilestoneEngine = new MilestoneEngine();
