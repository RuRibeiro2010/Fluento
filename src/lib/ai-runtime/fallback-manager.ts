/**
 * FLUENTO AI RUNTIME - FALLBACK MANAGER
 * 
 * Manages provider health states, cooldown timers, and automatic failovers
 * between AI providers (Gemini -> OpenAI -> Anthropic).
 */

import { ProviderHealth, SupportedProvider } from './types';
import { telemetry } from './telemetry';

export class FallbackManager {
  private healthMap: Map<SupportedProvider, ProviderHealth> = new Map();
  private cooldownDurationMs: number = 30000; // 30 seconds cooldown after 3 consecutive failures

  constructor() {
    this.resetHealth();
  }

  public resetHealth(): void {
    const providers: SupportedProvider[] = ['gemini', 'openai', 'anthropic', 'mock'];
    for (const p of providers) {
      this.healthMap.set(p, {
        provider: p,
        isHealthy: true,
        consecutiveFailures: 0
      });
    }
  }

  /**
   * Reports a successful request to a provider, resetting its failure count.
   */
  public reportSuccess(provider: SupportedProvider): void {
    const health = this.healthMap.get(provider) || { provider, isHealthy: true, consecutiveFailures: 0 };
    health.isHealthy = true;
    health.consecutiveFailures = 0;
    health.cooldownUntilIso = undefined;
    this.healthMap.set(provider, health);
  }

  /**
   * Reports a failure, triggering cooldown if threshold is breached.
   */
  public reportFailure(provider: SupportedProvider, errorMsg: string): void {
    const health = this.healthMap.get(provider) || { provider, isHealthy: true, consecutiveFailures: 0 };
    health.consecutiveFailures += 1;
    health.lastFailureTimeIso = new Date().toISOString();

    if (health.consecutiveFailures >= 3) {
      health.isHealthy = false;
      const cooldownUntil = new Date(Date.now() + this.cooldownDurationMs).toISOString();
      health.cooldownUntilIso = cooldownUntil;

      telemetry.logEvent({
        eventType: 'fallback_triggered',
        provider,
        modelName: 'unknown',
        errorDetails: `Provider placed on cooldown until ${cooldownUntil}: ${errorMsg}`
      });
    }

    this.healthMap.set(provider, health);
  }

  /**
   * Checks if a provider is healthy and not currently in cooldown.
   */
  public isHealthy(provider: SupportedProvider): boolean {
    const health = this.healthMap.get(provider);
    if (!health) return true;

    if (!health.isHealthy && health.cooldownUntilIso) {
      if (new Date().toISOString() > health.cooldownUntilIso) {
        // Cooldown expired, mark healthy again
        health.isHealthy = true;
        health.consecutiveFailures = 0;
        health.cooldownUntilIso = undefined;
        this.healthMap.set(provider, health);
        return true;
      }
      return false;
    }

    return health.isHealthy;
  }

  public getHealthStatus(): ProviderHealth[] {
    return Array.from(this.healthMap.values());
  }
}

export const fallbackManager = new FallbackManager();
