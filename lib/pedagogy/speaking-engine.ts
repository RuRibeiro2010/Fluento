import { PedagogicalModulePlan } from '@/types/pedagogy';

export interface SpeakingEngineParams {
  scenarioTitle: string;
  targetLanguage: string;
  nativeLanguage: string;
  durationMinutes: number;
}

/**
 * Speaking Engine
 * Generates unscripted roleplay, spontaneous conversation, and communicative fluency tasks.
 */
export class SpeakingEngine {
  public createSpeakingModule(params: SpeakingEngineParams): PedagogicalModulePlan {
    const { scenarioTitle, targetLanguage, nativeLanguage, durationMinutes } = params;

    return {
      id: `ped-speak-${Date.now()}`,
      moduleType: 'conversation',
      title: `Unscripted Roleplay: ${scenarioTitle}`,
      targetLanguage,
      nativeLanguage,
      durationMinutes,
      pedagogicalGoal: `Fostering unscripted conversational fluency, immediate response time, and natural discourse in ${targetLanguage.toUpperCase()}.`,
      instructions: `Virtual Teacher engages in interactive roleplay as persona in ${scenarioTitle}. Speaks primarily in ${targetLanguage.toUpperCase()}. Interruptions avoided during student speech; corrections delivered at natural pauses.`,
      exercises: [
        {
          prompt: `Engage in a 2-minute dialogue in ${targetLanguage.toUpperCase()} responding to your Virtual Teacher.`,
          targetResponse: `Spontaneous multi-turn verbal exchange.`,
          hints: [`Keep talking naturally without translating in your head.`],
        },
      ],
    };
  }
}

export const defaultSpeakingEngine = new SpeakingEngine();
