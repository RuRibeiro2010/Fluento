import { PedagogicalModulePlan } from '@/types/pedagogy';

export interface VocabularyEngineParams {
  targetWords: string[];
  targetLanguage: string;
  nativeLanguage: string;
  durationMinutes: number;
}

/**
 * Vocabulary Engine
 * Escalates passive word recognition into active natural conversational deployment.
 */
export class VocabularyEngine {
  public createVocabularyModule(params: VocabularyEngineParams): PedagogicalModulePlan {
    const { targetWords, targetLanguage, nativeLanguage, durationMinutes } = params;

    const wordsList = targetWords.length > 0 ? targetWords.join(', ') : 'Essential Focus Vocabulary';

    return {
      id: `ped-vocab-${Date.now()}`,
      moduleType: 'vocabulary',
      title: `Vocabulary Escalation: ${wordsList}`,
      targetLanguage,
      nativeLanguage,
      durationMinutes,
      pedagogicalGoal: `Escalating passive word recognition (${wordsList}) into spontaneous active usage in ${targetLanguage.toUpperCase()}.`,
      instructions: `Introduce target words through context sentences in ${targetLanguage.toUpperCase()}. Ask student to create original workplace or daily life examples.`,
      exercises: targetWords.map((word) => ({
        prompt: `Use "${word}" in a natural sentence describing your day.`,
        targetResponse: `A natural sentence in ${targetLanguage.toUpperCase()} containing "${word}".`,
        hints: [`Context example: How would you express this to a native speaker?`],
      })),
    };
  }
}

export const defaultVocabularyEngine = new VocabularyEngine();
