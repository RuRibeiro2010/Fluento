import { PedagogicalModulePlan } from '@/types/pedagogy';

export interface ListeningEngineParams {
  dialogueContext: string;
  targetLanguage: string;
  nativeLanguage: string;
  durationMinutes: number;
}

/**
 * Listening Engine
 * Generates listening comprehension scenarios, audio discrimination, and native speed calibration.
 */
export class ListeningEngine {
  public createListeningModule(params: ListeningEngineParams): PedagogicalModulePlan {
    const { dialogueContext, targetLanguage, nativeLanguage, durationMinutes } = params;

    return {
      id: `ped-list-${Date.now()}`,
      moduleType: 'listening',
      title: `Native Listening Discrimination: ${dialogueContext}`,
      targetLanguage,
      nativeLanguage,
      durationMinutes,
      pedagogicalGoal: `Developing rapid listening comprehension and word boundary recognition in ${targetLanguage.toUpperCase()}.`,
      instructions: `Listen to audio segment set in ${dialogueContext}. Identify key information without reading text first.`,
      exercises: [
        {
          prompt: `What was the main request made by the speaker in the ${dialogueContext} dialogue?`,
          targetResponse: `Key detail summary in ${targetLanguage.toUpperCase()}.`,
          hints: [`Listen for tone and key verb markers.`],
        },
      ],
    };
  }
}

export const defaultListeningEngine = new ListeningEngine();
