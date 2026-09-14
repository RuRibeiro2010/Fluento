import { PedagogicalModulePlan } from '@/types/pedagogy';

export interface GrammarEngineParams {
  grammarTopic: string;
  targetLanguage: string;
  nativeLanguage: string;
  durationMinutes: number;
}

/**
 * Grammar Engine
 * Generates structured Socratic grammar instruction plans and exercises for any target language.
 */
export class GrammarEngine {
  public createGrammarModule(params: GrammarEngineParams): PedagogicalModulePlan {
    const { grammarTopic, targetLanguage, nativeLanguage, durationMinutes } = params;

    return {
      id: `ped-gram-${Date.now()}`,
      moduleType: 'grammar',
      title: `Socratic Syntax Mastery: ${grammarTopic}`,
      targetLanguage,
      nativeLanguage,
      durationMinutes,
      pedagogicalGoal: `Mastering construction and context of ${grammarTopic} in ${targetLanguage.toUpperCase()} without direct rote translation.`,
      instructions: `Teacher explains ${grammarTopic} using simple context sentences in ${targetLanguage.toUpperCase()}. Uses ${nativeLanguage.toUpperCase()} only for brief structural comparison if needed.`,
      exercises: [
        {
          prompt: `Complete the sentence with correct ${grammarTopic} form: "Ayer yo (hablar / parler / speak) ..."`,
          targetResponse: `Correct conjugated form in ${targetLanguage.toUpperCase()}`,
          hints: [`Think about completed past vs ongoing habit.`],
        },
      ],
    };
  }
}

export const defaultGrammarEngine = new GrammarEngine();
