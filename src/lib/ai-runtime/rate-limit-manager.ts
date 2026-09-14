/**
 * FLUENTO AI RUNTIME - RATE LIMIT MANAGER
 * 
 * Manages request rates per provider to prevent HTTP 429 quota exhaustion.
 */

import { SupportedProvider } from './types';
import { telemetry } from './telemetry';

export class RateLimitManager {
  private requestWindow: Map<SupportedProvider, number[]> = new Map();
  private maxRequestsPerMinute: number = 60;

  public setMaxRequestsPerMinute(limit: number): void {
    this.maxRequestsPerMinute = limit;
  }

  /**
   * Checks if a request is allowed under current rate limits.
   */
  public isAllowed(provider: SupportedProvider): boolean {
    const now = Date.now();
    const windowStart = now - 60000;

    let timestamps = this.requestWindow.get(provider) || [];
    // Remove timestamps older than 1 minute
    timestamps = timestamps.filter(ts => ts > windowStart);
    this.requestWindow.set(provider, timestamps);

    if (timestamps.length >= this.maxRequestsPerMinute) {
      telemetry.logEvent({
        eventType: 'rate_limit_exceeded',
        provider,
        modelName: 'unknown',
        errorDetails: `Rate limit of ${this.maxRequestsPerMinute} req/min exceeded`
      });
      return false;
    }

    return true;
  }

  /**
   * Records a request timestamp for the provider.
   */
  public recordRequest(provider: SupportedProvider): void {
    const timestamps = this.requestWindow.get(provider) || [];
    timestamps.push(Date.now());
    this.requestWindow.set(provider, timestamps);
  }
}

export const rateLimitManager = new RateLimitManager();
