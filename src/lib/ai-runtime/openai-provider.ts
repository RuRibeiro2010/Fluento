/**
 * FLUENTO AI RUNTIME - OPENAI PROVIDER
 * 
 * Provider integration for OpenAI models (GPT-4o, GPT-4o-mini).
 */

import { AIProvider } from './provider-interface';
import { ModelRequest, ModelResponse, StreamChunk, SupportedProvider } from './types';
import { estimateCost } from './pricing';

export class OpenAIProvider implements AIProvider {
  public readonly providerName: SupportedProvider = 'openai';
  public readonly defaultModel: string = 'gpt-4o-mini';

  public async isAvailable(): Promise<boolean> {
    return !!process.env.OPENAI_API_KEY;
  }

  public async generate(request: ModelRequest): Promise<ModelResponse> {
    const startTime = Date.now();
    const model = request.modelName || this.defaultModel;
    const reqId = request.requestId || `openai_${Date.now()}`;
    const apiKey = process.env.OPENAI_API_KEY;

    let textContent = '';

    if (apiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          signal: request.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              ...(request.systemInstruction ? [{ role: 'system', content: request.systemInstruction }] : []),
              { role: 'user', content: request.prompt }
            ],
            temperature: request.temperature ?? 0.7,
            max_tokens: request.maxTokens
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        textContent = data.choices?.[0]?.message?.content || '';
      } catch (err: any) {
        throw new Error(`OpenAI API Error: ${err.message || String(err)}`);
      }
    } else {
      textContent = `[Simulated OpenAI Response]: Processed prompt "${request.prompt.substring(0, 40)}..."`;
    }

    const latencyMs = Date.now() - startTime;
    const promptTokens = Math.ceil((request.prompt.length + (request.systemInstruction?.length || 0)) / 3.8);
    const completionTokens = Math.ceil(textContent.length / 3.8);
    const totalTokens = promptTokens + completionTokens;
    const estimatedCostUsd = estimateCost(model, promptTokens, completionTokens);

    return {
      requestId: reqId,
      content: textContent,
      provider: 'openai',
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
    const reqId = request.requestId || `openai_stream_${Date.now()}`;

    // Standard non-blocking stream simulation or real fetch stream
    const res = await this.generate(request);
    const words = res.content.split(' ');
    
    for (const word of words) {
      if (request.signal?.aborted) {
        break;
      }
      onChunk({
        requestId: reqId,
        delta: word + ' ',
        done: false,
        provider: 'openai',
        modelName: model
      });
    }

    onChunk({
      requestId: reqId,
      delta: '',
      done: true,
      provider: 'openai',
      modelName: model
    });

    return {
      ...res,
      latencyMs: Date.now() - startTime
    };
  }
}

export const openAIProvider = new OpenAIProvider();
