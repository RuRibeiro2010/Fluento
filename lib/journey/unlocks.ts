import { UnlockedFeature } from '@/types/journey';
import { StudentModel } from '@/types/brain';

export const ALL_UNLOCKABLE_FEATURES: UnlockedFeature[] = [
  {
    id: 'unl-scen-barcelona',
    type: 'scenario',
    title: 'Barcelona Tapas Bar Roleplay',
    description: 'Immersive Spanish food & wine ordering roleplay with local bartender.',
    unlockedAt: '',
    iconName: 'Utensils',
  },
  {
    id: 'unl-teacher-elena',
    type: 'teacher_persona',
    title: 'Elena (Corporate Negotiations Lead)',
    description: 'High-level business English and formal Spanish negotiation mentor.',
    unlockedAt: '',
    iconName: 'UserCheck',
  },
  {
    id: 'unl-chal-rapid-accent',
    type: 'challenge',
    title: '60-Second Rapid Accent Drill',
    description: 'Timed pronunciation match challenge targeting rolled Rs and nasal vowels.',
    unlockedAt: '',
    iconName: 'Zap',
  },
  {
    id: 'unl-miss-london',
    type: 'mission',
    title: 'Mission London: Airport to Hotel Journey',
    description: '6-part multi-block mission through Heathrow Airport, Tube, Hotel, and Dining.',
    unlockedAt: '',
    iconName: 'Compass',
  },
  {
    id: 'unl-type-socratic-debate',
    type: 'lesson_type',
    title: 'Socratic Debate & Argumentation',
    description: 'Advanced unscripted debate format with AI challenging your premises in real time.',
    unlockedAt: '',
    iconName: 'ShieldAlert',
  },
];

export class UnlockEngine {
  private unlockedFeaturesMap: Map<string, UnlockedFeature> = new Map();

  constructor() {
    // Default unlocked items on day 1
    const defaultUnlocked: UnlockedFeature = {
      id: 'unl-scen-barcelona',
      type: 'scenario',
      title: 'Barcelona Tapas Bar Roleplay',
      description: 'Immersive Spanish food & wine ordering roleplay with local bartender.',
      unlockedAt: new Date().toISOString(),
      iconName: 'Utensils',
    };
    this.unlockedFeaturesMap.set(defaultUnlocked.id, defaultUnlocked);
  }

  /**
   * Evaluates student model, level, and milestones to unlock new features
   */
  public evaluateUnlocks(
    studentModel: StudentModel,
    unlockedMilestoneIds: string[] = []
  ): UnlockedFeature[] {
    const now = new Date().toISOString();
    const milSet = new Set(unlockedMilestoneIds);

    // Level B1+ unlocks Elena & Socratic Debate
    if (studentModel.currentCefr === 'B1' || studentModel.currentCefr === 'B2' || studentModel.currentCefr === 'C1' || studentModel.currentCefr === 'C2') {
      this.unlockIfNew('unl-teacher-elena', now);
      this.unlockIfNew('unl-type-socratic-debate', now);
    }

    // 100 words milestone unlocks Mission London
    if (milSet.has('ms-100-words') || milSet.has('ms-first-chat')) {
      this.unlockIfNew('unl-miss-london', now);
    }

    // 7-day streak unlocks Rapid Accent challenge
    if (milSet.has('ms-7-streak') || studentModel.consistencyScore >= 75) {
      this.unlockIfNew('unl-chal-rapid-accent', now);
    }

    return Array.from(this.unlockedFeaturesMap.values());
  }

  private unlockIfNew(featureId: string, unlockedAt: string): void {
    if (!this.unlockedFeaturesMap.has(featureId)) {
      const feature = ALL_UNLOCKABLE_FEATURES.find((f) => f.id === featureId);
      if (feature) {
        this.unlockedFeaturesMap.set(featureId, {
          ...feature,
          unlockedAt,
        });
      }
    }
  }

  public getUnlockedFeatures(): UnlockedFeature[] {
    return Array.from(this.unlockedFeaturesMap.values());
  }
}

export const defaultUnlockEngine = new UnlockEngine();
