/**
 * FLUENTO AI RUNTIME - MAIN ENGINE FACADE
 * 
 * Strict infrastructural layer for LLM execution.
 * NEVER contains pedagogical decision logic or prompt modification rules.
 * Provides resilient, observable execution with retries, timeouts, rate limits,
 * provider fallbacks, token tracking, and cost monitoring.
 * 
 * In browser environments (typeof window !== 'undefined'), requests are transparently
 * proxied to the secure HTTP Express API endpoints (/api/ai/generate & /api/ai/stream).
 */

import { ModelRequest, ModelResponse, StreamChunk } from './types';
import { providerRouter } from './provider-router';
import { retryManager } from './retry-manager';
import { timeoutManager } from './timeout-manager';
import { rateLimitManager } from './rate-limit-manager';
import { fallbackManager } from './fallback-manager';
import { tokenUsageTracker } from './token-usage-tracker';
import { costTracker } from './cost-tracker';
import { telemetry } from './telemetry';

export class AIRuntime {
  /**
   * Executes a model generation request across resolved provider chains with fallback and retries.
   */
  public async execute(request: ModelRequest): Promise<ModelResponse> {
    // If executing in browser environment, proxy to secure server HTTP API endpoint
    if (typeof window !== 'undefined') {
      const { generateAiText } = await import('../api/ai-client');
      return generateAiText(request);
    }

    const startTime = Date.now();
    const reqId = request.requestId || `air_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Budget check
    if (request.sessionId && !costTracker.isSessionWithinBudget(request.sessionId)) {
      throw new Error(`Budget cap exceeded for session: ${request.sessionId}`);
    }

    const providerChain = await providerRouter.resolveProviderChain(request.providerPreference);
    if (providerChain.length === 0) {
      throw new Error('No available AI providers found');
    }

    if (request.signal?.aborted) {
      throw new Error('Request aborted');
    }

    let lastError: Error | null = null;
    let fallbackOccurred = false;

    telemetry.logEvent({
      eventType: 'request_started',
      provider: providerChain[0].providerName,
      modelName: request.modelName || providerChain[0].defaultModel,
      sessionId: request.sessionId
    });

    for (let i = 0; i < providerChain.length; i++) {
      if (request.signal?.aborted) {
        throw new Error('Request aborted');
      }
      const provider = providerChain[i];
      const providerName = provider.providerName;
      const modelName = request.modelName || provider.defaultModel;

      if (i > 0) {
        fallbackOccurred = true;
      }

      // Check rate limit
      if (!rateLimitManager.isAllowed(providerName)) {
        fallbackManager.reportFailure(providerName, 'Rate limit exceeded');
        continue;
      }

      try {
        rateLimitManager.recordRequest(providerName);

        const timeoutMs = request.timeoutMs || 10000;

        const { result: response, attempts } = await retryManager.executeWithRetry(
          async () => {
            return await timeoutManager.executeWithTimeout(
              provider.generate({ ...request, requestId: reqId, modelName }),
              timeoutMs,
              `Timeout executing request on provider ${providerName}`
            );
          },
          providerName,
          modelName
        );

        // Success path
        fallbackManager.reportSuccess(providerName);
        tokenUsageTracker.recordUsage(response, request.sessionId, request.studentId);

        telemetry.logEvent({
          eventType: 'request_success',
          provider: providerName,
          modelName,
          latencyMs: Date.now() - startTime,
          sessionId: request.sessionId
        });

        return {
          ...response,
          fallbackOccurred,
          attempts
        };
      } catch (err: any) {
        lastError = err;
        fallbackManager.reportFailure(providerName, err.message || String(err));

        telemetry.logEvent({
          eventType: 'request_failed',
          provider: providerName,
          modelName,
          latencyMs: Date.now() - startTime,
          errorDetails: err.message || String(err),
          sessionId: request.sessionId
        });
      }
    }

    throw lastError || new Error('All AI providers failed to fulfill request');
  }

  /**
   * Executes a streaming model request.
   */
  public async executeStream(
    request: ModelRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<ModelResponse> {
    // If executing in browser environment, proxy to secure server streaming SSE endpoint
    if (typeof window !== 'undefined') {
      const { streamAiText } = await import('../api/ai-client');
      return streamAiText(request, onChunk);
    }

    const providerChain = await providerRouter.resolveProviderChain(request.providerPreference);
    const provider = providerChain[0];
    const providerName = provider.providerName;
    const modelName = request.modelName || provider.defaultModel;

    if (request.signal?.aborted) {
      throw new Error('Request aborted');
    }

    try {
      rateLimitManager.recordRequest(providerName);
      const response = await provider.generateStream(request, onChunk);
      
      fallbackManager.reportSuccess(providerName);
      tokenUsageTracker.recordUsage(response, request.sessionId, request.studentId);

      return response;
    } catch (err: any) {
      fallbackManager.reportFailure(providerName, err.message || String(err));
      throw err;
    }
  }
}

export const aiRuntime = new AIRuntime();
