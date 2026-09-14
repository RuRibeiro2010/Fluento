import { LearningDNA } from '@/types/memory';

/**
 * Learning DNA Module
 * Learner archetype, cognitive strengths, error recovery speed, and preferred pace.
 */
export class LearningDnaService {
  private memory: LearningDNA;

  constructor(userId: string = 'usr_default') {
    this.memory = {
      userId,
      primaryLearningStyle: 'auditory',
      preferredCorrectionMode: 'balanced',
      peakStudyTimeOfDay: 'evening',
      errorRecoverySpeed: 'fast',
      preferredPace: 'standard',
      cognitiveStrengths: [
        'High Auditory Retention',
        'Strong Contextual Deduction',
        'Rapid Pronunciation Mimicry',
      ],
    };
  }

  public get(): LearningDNA {
    return { ...this.memory };
  }

  public update(patch: Partial<LearningDNA>): LearningDNA {
    this.memory = {
      ...this.memory,
      ...patch,
    };
    return { ...this.memory };
  }
}
