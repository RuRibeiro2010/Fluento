import { AiPromptContextEntity } from '../entities/ai-prompt-context.entity';

export interface IAiProviderPort {
  generateTextResponse(
    promptContext: AiPromptContextEntity,
    userUtterance: string,
    history?: { role: 'user' | 'model'; text: string }[]
  ): Promise<{
    responseText: string;
    suggestedCorrections?: string[];
    grammarScore?: number;
    latencyMs: number;
  }>;
}
