import { PedagogicalModulePlan } from '@/types/pedagogy';

export interface WritingEngineParams {
  compositionTopic: string;
  targetLanguage: string;
  nativeLanguage: string;
  durationMinutes: number;
}

/**
 * Writing Engine
 * Generates guided composition, workplace email drafting, and syntax construction tasks.
 */
export class WritingEngine {
  public createWritingModule(params: WritingEngineParams): PedagogicalModulePlan {
    const { compositionTopic, targetLanguage, nativeLanguage, durationMinutes } = params;

    return {
      id: `ped-writ-${Date.now()}`,
      moduleType: 'writing',
      title: `Guided Composition: ${compositionTopic}`,
      targetLanguage,
      nativeLanguage,
      durationMinutes,
      pedagogicalGoal: `Structuring clear, grammatically sound written messages in ${targetLanguage.toUpperCase()}.`,
      instructions: `Draft a concise paragraph or formal email in ${targetLanguage.toUpperCase()} addressing ${compositionTopic}. Focus on cohesive connectors and correct syntax.`,
      exercises: [
        {
          prompt: `Write 3 sentences in ${targetLanguage.toUpperCase()} regarding ${compositionTopic}.`,
          targetResponse: `Cohesive written paragraph.`,
          hints: [`Use formal connectors where appropriate.`],
        },
      ],
    };
  }
}

export const defaultWritingEngine = new WritingEngine();
