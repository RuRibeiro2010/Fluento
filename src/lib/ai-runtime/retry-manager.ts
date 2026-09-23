/**
 * FLUENTO AI RUNTIME - RETRY MANAGER
 * 
 * Executes model request tasks with configurable exponential backoff retry logic.
 */

import { RetryConfig } from './types';
import { telemetry } from './telemetry';

export class RetryManager {
  private defaultConfig: RetryConfig = {
    maxRetries: 2,
    initialDelayMs: 300,
    backoffFactor: 2.0
  };

  /**
   * Executes an async operation with exponential backoff retries.
   * Only retries on transient errors (timeouts, rate limits, server errors).
   */
  public async executeWithRetry<T>(
    operation: (attempt: number) => Promise<T>,
    providerName: string,
    modelName: string,
    config?: Partial<RetryConfig>
  ): Promise<{ result: T; attempts: number }> {
    const finalConfig: RetryConfig = { ...this.defaultConfig, ...config };
    let lastError: any = null;

    for (let attempt = 1; attempt <= finalConfig.maxRetries + 1; attempt++) {
      try {
        if (attempt > 1) {
          // If not retryable, throw immediately without further attempts
          if (!this.isRetryable(lastError)) {
            throw lastError;
          }

          telemetry.logEvent({
            eventType: 'retry_attempted',
            provider: providerName as any,
            modelName,
            attemptNumber: attempt,
            errorDetails: lastError?.message || String(lastError)
          });

          const delay = finalConfig.initialDelayMs * Math.pow(finalConfig.backoffFactor, attempt - 2);
          await this.delay(delay);
        }

        const result = await operation(attempt);
        return { result, attempts: attempt };
      } catch (err: any) {
        lastError = err;
        
        // If this was the last attempt, or the error is definitively non-retryable,
        // we'll break/throw after this loop iteration.
        if (!this.isRetryable(err)) {
          break; 
        }
      }
    }

    throw lastError || new Error(`Operation failed after ${finalConfig.maxRetries + 1} attempts`);
  }

  /**
   * Determines if an error is transient and should be retried.
   */
  private isRetryable(err: any): boolean {
    if (!err) return false;
    const msg = (err.message || String(err)).toLowerCase();

    // 1. Permanent Configuration/Auth Failures (DO NOT RETRY)
    if (msg.includes('not_configured') || 
        msg.includes('unauthorized') || 
        msg.includes('forbidden') || 
        msg.includes('api_key_missing') ||
        msg.includes('invalid_request') ||
        msg.includes('unsupported model')) {
      return false;
    }

    // 2. Transient Failures (RETRY)
    if (msg.includes('timeout') || 
        msg.includes('rate limit') || 
        msg.includes('500') || 
        msg.includes('502') || 
        msg.includes('503') || 
        msg.includes('504') ||
        msg.includes('overloaded') ||
        msg.includes('deadline exceeded')) {
      return true;
    }

    // Default to false for unknown errors to be safe
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const retryManager = new RetryManager();
