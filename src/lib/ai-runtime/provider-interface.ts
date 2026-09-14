/**
 * FLUENTO AI RUNTIME - PROVIDER INTERFACE
 * 
 * Abstract contract that all LLM provider integrations (Gemini, OpenAI, Anthropic, Mock)
 * must implement to ensure seamless fallback, standardized responses, and clean architecture.
 */

import { ModelRequest, ModelResponse, StreamChunk, SupportedProvider } from './types';

export interface AIProvider {
  readonly providerName: SupportedProvider;
  readonly defaultModel: string;

  /**
   * Generates a complete text response synchronously/asynchronously.
   */
  generate(request: ModelRequest): Promise<ModelResponse>;

  /**
   * Generates a streaming response, invoking onChunk for each incoming chunk.
   */
  generateStream(
    request: ModelRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<ModelResponse>;

  /**
   * Checks whether the provider API is configured and reachable.
   */
  isAvailable(): Promise<boolean>;
}
