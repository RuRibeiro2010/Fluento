import { PedagogicalModulePlan } from '@/types/pedagogy';

export interface PronunciationEngineParams {
  focusPhonemesOrWords: string[];
  targetLanguage: string;
  nativeLanguage: string;
  durationMinutes: number;
}

/**
 * Pronunciation Engine
 * Generates language-agnostic phonetic discrimination and articulation drills.
 */
export class PronunciationEngine {
  public createPronunciationModule(params: PronunciationEngineParams): PedagogicalModulePlan {
    const { focusPhonemesOrWords, targetLanguage, nativeLanguage, durationMinutes } = params;

    const focusStr = focusPhonemesOrWords.length > 0 ? focusPhonemesOrWords.join(', ') : 'Vowel & Accent Clarity';

    return {
      id: `ped-pron-${Date.now()}`,
      moduleType: 'pronunciation',
      title: `Phonetic Accuracy & Accent Drill: ${focusStr}`,
      targetLanguage,
      nativeLanguage,
      durationMinutes,
      pedagogicalGoal: `Sharpening accent clarity, mouth articulation, and native speed rhythm in ${targetLanguage.toUpperCase()}.`,
      instructions: `Teacher demonstrates mouth shape and native pitch curve. Student repeats target phrase with open audio feedback.`,
      exercises: [
        {
          prompt: `Repeat aloud: "${focusStr}" at 1.0x native speed with clear rhythm.`,
          targetResponse: `Clear vocal reproduction matching target cadence.`,
          hints: [`Focus on smooth vowel connections.`],
        },
      ],
    };
  }
}

export const defaultPronunciationEngine = new PronunciationEngine();
