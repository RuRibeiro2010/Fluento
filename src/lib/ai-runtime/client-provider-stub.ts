/**
 * FLUENTO CLIENT AI PROVIDER STUB
 * 
 * Safe browser placeholder for server-side AI providers.
 * Enforces zero-exposure of:
 * - @google/genai
 * - GEMINI_API_KEY
 * - Server-side provider implementations
 * 
 * Browser AI interactions MUST be performed via HTTP client proxy (/src/lib/api/ai-client).
 */

import { AIProvider } from './provider-interface';
import { ModelRequest, ModelResponse, StreamChunk, SupportedProvider } from './types';

class ClientAIProviderStub implements AIProvider {
  constructor(public readonly providerName: SupportedProvider) {}
  public readonly defaultModel = 'server-proxy';

  public async isAvailable(): Promise<boolean> {
    return false;
  }

  public async generate(request: ModelRequest): Promise<ModelResponse> {
    throw new Error(
      `[SecurityViolation] Direct execution of provider '${this.providerName}' in browser is blocked. Route AI calls via server HTTP proxy /api/ai/generate.`
    );
  }

  public async generateStream(
    request: ModelRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<ModelResponse> {
    throw new Error(
      `[SecurityViolation] Direct streaming of provider '${this.providerName}' in browser is blocked. Route AI calls via server HTTP proxy /api/ai/stream.`
    );
  }
}

export const geminiProvider = new ClientAIProviderStub('gemini');
export const openAIProvider = new ClientAIProviderStub('openai');
export const anthropicProvider = new ClientAIProviderStub('anthropic');
export class GeminiProvider extends ClientAIProviderStub {
  constructor() {
    super('gemini');
  }
}
