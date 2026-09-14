/**
 * FLUENTO AI RUNTIME - ANTHROPIC PROVIDER
 * 
 * Provider integration for Anthropic Claude models (Claude 3.5 Sonnet, Claude 3 Haiku).
 */

import { AIProvider } from './provider-interface';
import { ModelRequest, ModelResponse, StreamChunk, SupportedProvider } from './types';

export class AnthropicProvider implements AIProvider {
  public readonly providerName: SupportedProvider = 'anthropic';
  public readonly defaultModel: string = 'claude-3-haiku-20240307';

  public async isAvailable(): Promise<boolean> {
    return !!process.env.ANTHROPIC_API_KEY;
  }

  public async generate(request: ModelRequest): Promise<ModelResponse> {
    const startTime = Date.now();
    const model = request.modelName || this.defaultModel;
    const reqId = request.requestId || `anthropic_${Date.now()}`;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    let textContent = '';

    if (apiKey) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model,
            system: request.systemInstruction,
            messages: [{ role: 'user', content: request.prompt }],
            max_tokens: request.maxTokens || 1024,
            temperature: request.temperature ?? 0.7
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        textContent = data.content?.[0]?.text || '';
      } catch (err: any) {
        throw new Error(`Anthropic API Error: ${err.message || String(err)}`);
      }
    } else {
      textContent = `[Simulated Anthropic Response]: Received prompt "${request.prompt.substring(0, 40)}..."`;
    }

    const latencyMs = Date.now() - startTime;
    const promptTokens = Math.ceil((request.prompt.length + (request.systemInstruction?.length || 0)) / 3.8);
    const completionTokens = Math.ceil(textContent.length / 3.8);
    const totalTokens = promptTokens + completionTokens;
    // ~$0.00025 per 1k input, $0.00125 per 1k output for Claude Haiku
    const estimatedCostUsd = (promptTokens / 1000) * 0.00025 + (completionTokens / 1000) * 0.00125;

    return {
      requestId: reqId,
      content: textContent,
      provider: 'anthropic',
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
    const startTime = Date.now();
    const model = request.modelName || this.defaultModel;
    const reqId = request.requestId || `anthropic_stream_${Date.now()}`;

    const res = await this.generate(request);
    const words = res.content.split(' ');

    for (const word of words) {
      onChunk({
        requestId: reqId,
        delta: word + ' ',
        done: false,
        provider: 'anthropic',
        modelName: model
      });
    }

    onChunk({
      requestId: reqId,
      delta: '',
      done: true,
      provider: 'anthropic',
      modelName: model
    });

    return {
      ...res,
      latencyMs: Date.now() - startTime
    };
  }
}

export const anthropicProvider = new AnthropicProvider();
