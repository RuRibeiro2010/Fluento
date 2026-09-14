/**
 * Retry Engine Module (Production & Reliability Platform - Phase 14)
 * Executes transient operation retries with exponential backoff and jitter
 * to recover from network hiccups or brief server unresponsiveness.
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
}

export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const initialDelayMs = options.initialDelayMs ?? 500;
  const maxDelayMs = options.maxDelayMs ?? 5000;
  const backoffFactor = options.backoffFactor ?? 2;

  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt <= maxRetries) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      if (attempt > maxRetries) {
        throw error;
      }

      // Calculate exponential backoff with slight jitter
      const jitter = Math.random() * 200;
      const currentDelay = Math.min(maxDelayMs, delay * Math.pow(backoffFactor, attempt - 1) + jitter);

      console.warn(`[RetryEngine] Attempt ${attempt} failed. Retrying in ${Math.round(currentDelay)}ms...`);
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
    }
  }

  throw new Error('[RetryEngine] Max retries exceeded.');
}
