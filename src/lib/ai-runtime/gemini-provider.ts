/**
 * FLUENTO AI RUNTIME - GEMINI PROVIDER
 * 
 * Server-side integration for Google Gemini models using `@google/genai` SDK.
 * Follows server-side safety standards and dynamic SDK loading.
 */

import { AIProvider } from './provider-interface';
import { ModelRequest, ModelResponse, StreamChunk, SupportedProvider } from './types';
import { estimateCost } from './pricing';

export class GeminiProvider implements AIProvider {
  public readonly providerName: SupportedProvider = 'gemini';
  public readonly defaultModel: string = 'gemini-3.6-flash';

  private async getClient() {
    // Strict security: Never initialize Google GenAI SDK in browser context
    if (typeof window !== 'undefined') {
      return null;
    }
    const apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined;
    if (!apiKey) return null;

    try {
      // Dynamic evaluation to avoid bundler packaging SDK into browser chunks
      const dynamicImport = new Function('specifier', 'return import(specifier)');
      const { GoogleGenAI } = await dynamicImport('@google/genai');
      return new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (err) {
      console.error('[GeminiProvider] Failed to initialize server @google/genai SDK:', err);
      return null;
    }
  }

  public async isAvailable(): Promise<boolean> {
    if (typeof window !== 'undefined') return false;
    return !!(typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);
  }

  public async generate(request: ModelRequest): Promise<ModelResponse> {
    if (typeof window !== 'undefined') {
      throw new Error('CLIENT_EXECUTION_FORBIDDEN: GeminiProvider cannot be executed in the browser. Use server HTTP API /api/ai/generate.');
    }
    const startTime = Date.now();
    const model = request.modelName || this.defaultModel;
    const reqId = request.requestId || `gemini_${Date.now()}`;

    const apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined;
    const allowMock = typeof process !== 'undefined' && process.env?.ALLOW_MOCK_AI === 'true';

    if (!apiKey && !allowMock) {
      throw new Error('GEMINI_API_KEY_MISSING: GEMINI_API_KEY environment variable is not configured on the server.');
    }

    const client = await this.getClient();
    let textContent = '';

    if (client) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: request.prompt,
          config: {
            systemInstruction: request.systemInstruction,
            temperature: request.temperature ?? 0.7,
            maxOutputTokens: request.maxTokens
          }
        });
        textContent = response.text || '';
      } catch (err: any) {
        throw new Error(`Gemini API Error: ${err.message || String(err)}`);
      }
    } else if (allowMock) {
      textContent = `[MOCK_SIMULATION] Simulated response for prompt: "${request.prompt.substring(0, 40)}..."`;
    } else {
      throw new Error('GEMINI_API_KEY_MISSING: GEMINI_API_KEY environment variable is not configured on the server.');
    }

    const latencyMs = Date.now() - startTime;
    const promptTokens = Math.ceil((request.prompt.length + (request.systemInstruction?.length || 0)) / 3.8);
    const completionTokens = Math.ceil(textContent.length / 3.8);
    const totalTokens = promptTokens + completionTokens;
    const estimatedCostUsd = estimateCost(model, promptTokens, completionTokens);

    return {
      requestId: reqId,
      content: textContent,
      provider: 'gemini',
      modelName: model,
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCostUsd,
      latencyMs,
      fallbackOccurred: false,
      attempts: 1,
      timestampIso: new Date().toISOString()
    };
  }

  public async generateStream(
    request: ModelRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<ModelResponse> {
    if (typeof window !== 'undefined') {
      throw new Error('CLIENT_EXECUTION_FORBIDDEN: GeminiProvider cannot be executed in the browser. Use server HTTP API /api/ai/stream.');
    }
    const startTime = Date.now();
    const model = request.modelName || this.defaultModel;
    const reqId = request.requestId || `gemini_stream_${Date.now()}`;

    const apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined;
    const allowMock = typeof process !== 'undefined' && process.env?.ALLOW_MOCK_AI === 'true';

    if (!apiKey && !allowMock) {
      throw new Error('GEMINI_API_KEY_MISSING: GEMINI_API_KEY environment variable is not configured on the server.');
    }

    const client = await this.getClient();
    let fullContent = '';

    if (client) {
      try {
        const responseStream = await client.models.generateContentStream({
          model,
          contents: request.prompt,
          config: {
            systemInstruction: request.systemInstruction,
            temperature: request.temperature ?? 0.7,
            maxOutputTokens: request.maxTokens
          }
        });

        for await (const chunk of responseStream) {
          if (request.signal?.aborted) {
            break;
          }
          const delta = chunk.text || '';
          fullContent += delta;
          onChunk({
            requestId: reqId,
            delta,
            done: false,
            provider: 'gemini',
            modelName: model
          });
        }
      } catch (err: any) {
        throw new Error(`Gemini Stream Error: ${err.message || String(err)}`);
      }
    } else if (allowMock) {
      const simulatedText = `[MOCK_SIMULATION] Streamed answer for "${request.prompt.substring(0, 30)}..."`;
      const words = simulatedText.split(' ');
      for (const word of words) {
        const delta = word + ' ';
        fullContent += delta;
        onChunk({
          requestId: reqId,
          delta,
          done: false,
          provider: 'gemini',
          modelName: model
        });
      }
    } else {
      throw new Error('GEMINI_API_KEY_MISSING: GEMINI_API_KEY environment variable is not configured on the server.');
    }

    onChunk({
      requestId: reqId,
      delta: '',
      done: true,
      provider: 'gemini',
      modelName: model
    });

    const latencyMs = Date.now() - startTime;
    const promptTokens = Math.ceil((request.prompt.length + (request.systemInstruction?.length || 0)) / 3.8);
    const completionTokens = Math.ceil(fullContent.length / 3.8);
    const totalTokens = promptTokens + completionTokens;
    const estimatedCostUsd = estimateCost(model, promptTokens, completionTokens);

    return {
      requestId: reqId,
      content: fullContent,
      provider: 'gemini',
      modelName: model,
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCostUsd,
      latencyMs,
      fallbackOccurred: false,
      attempts: 1,
      timestampIso: new Date().toISOString()
    };
  }
}

export const geminiProvider = new GeminiProvider();
