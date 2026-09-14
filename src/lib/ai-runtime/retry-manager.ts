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
      }
    }

    throw lastError || new Error(`Operation failed after ${finalConfig.maxRetries + 1} attempts`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const retryManager = new RetryManager();
