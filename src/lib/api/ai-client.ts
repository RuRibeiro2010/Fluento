/**
 * FLUENTO CLIENT AI API HELPER
 * 
 * Provides type-safe client methods to interact with the server's AI proxy endpoints.
 * STRICT SECURITY MANDATE:
 * - NO imports of @google/genai
 * - NO access or handling of GEMINI_API_KEY
 * - All requests are routed through Express POST /api/ai/generate or POST /api/ai/stream
 */

import { ModelRequest, ModelResponse, StreamChunk } from '../ai-runtime/types';

export interface AiClientOptions {
  baseUrl?: string;
}

export class AiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'AiClientError';
  }
}

/**
 * Sends a text generation request to the server AI endpoint.
 */
export async function generateAiText(
  request: ModelRequest,
  options?: AiClientOptions
): Promise<ModelResponse> {
  const baseUrl = options?.baseUrl || '';
  
  // Strip any accidental credential fields from client request
  const sanitizedBody = {
    prompt: request.prompt,
    systemInstruction: request.systemInstruction,
    temperature: request.temperature,
    maxTokens: request.maxTokens,
    modelName: request.modelName,
    providerPreference: request.providerPreference,
    sessionId: request.sessionId,
    studentId: request.studentId,
  };

  const response = await fetch(`${baseUrl}/api/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sanitizedBody),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new AiClientError(
      data.message || 'AI request failed on server',
      response.status,
      data.error || 'UNKNOWN_ERROR'
    );
  }

  return data as ModelResponse;
}

/**
 * Sends a streaming text generation request to the server AI streaming endpoint via SSE.
 */
export async function streamAiText(
  request: ModelRequest,
  onChunk: (chunk: StreamChunk) => void,
  options?: AiClientOptions
): Promise<ModelResponse> {
  const baseUrl = options?.baseUrl || '';

  const sanitizedBody = {
    prompt: request.prompt,
    systemInstruction: request.systemInstruction,
    temperature: request.temperature,
    maxTokens: request.maxTokens,
    modelName: request.modelName,
    providerPreference: request.providerPreference,
    sessionId: request.sessionId,
    studentId: request.studentId,
  };

  const response = await fetch(`${baseUrl}/api/ai/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sanitizedBody),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new AiClientError(
      data.message || 'AI streaming request failed on server',
      response.status,
      data.error || 'UNKNOWN_ERROR'
    );
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('ReadableStream reader not available in current environment');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';
  let lastChunk: StreamChunk | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data: ')) {
        const jsonStr = trimmed.substring(6);
        try {
          const chunkData = JSON.parse(jsonStr);
          if (chunkData.error) {
            throw new AiClientError(chunkData.message || 'Streaming error', 500, chunkData.error);
          }
          const chunk: StreamChunk = chunkData;
          lastChunk = chunk;
          if (chunk.delta) {
            fullContent += chunk.delta;
          }
          onChunk(chunk);
        } catch (err: any) {
          if (err instanceof AiClientError) throw err;
          // Ignore malformed intermediate frames
        }
      }
    }
  }

  return {
    requestId: lastChunk?.requestId || `req_${Date.now()}`,
    content: fullContent,
    provider: lastChunk?.provider || 'gemini',
    modelName: lastChunk?.modelName || 'gemini-3.6-flash',
    promptTokens: Math.ceil(request.prompt.length / 3.8),
    completionTokens: Math.ceil(fullContent.length / 3.8),
    totalTokens: Math.ceil((request.prompt.length + fullContent.length) / 3.8),
    estimatedCostUsd: 0,
    latencyMs: 0,
    fallbackOccurred: false,
    attempts: 1,
    timestampIso: new Date().toISOString(),
  };
}
