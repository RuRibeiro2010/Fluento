/**
 * FLUENTO AI RUNTIME - PROVIDER ROUTER
 * 
 * Determines provider prioritization and failover order based on request preferences,
 * API availability, and health monitoring.
 */

import { AIProvider } from './provider-interface';
import { geminiProvider } from './gemini-provider';
import { openAIProvider } from './openai-provider';
import { anthropicProvider } from './anthropic-provider';
import { fallbackManager } from './fallback-manager';
import { SupportedProvider } from './types';

export class ProviderRouter {
  private providers: Map<SupportedProvider, AIProvider> = new Map();

  constructor() {
    this.registerProvider(geminiProvider);
    this.registerProvider(openAIProvider);
    this.registerProvider(anthropicProvider);
  }

  public registerProvider(provider: AIProvider): void {
    this.providers.set(provider.providerName, provider);
  }

  public getProvider(name: SupportedProvider): AIProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Resolves an ordered sequence of providers to try for a request.
   */
  public async resolveProviderChain(preferences?: SupportedProvider[]): Promise<AIProvider[]> {
    const defaultOrder: SupportedProvider[] = ['gemini', 'openai', 'anthropic'];
    const candidates = preferences && preferences.length > 0 ? preferences : defaultOrder;

    const chain: AIProvider[] = [];

    for (const name of candidates) {
      const provider = this.providers.get(name);
      if (provider && fallbackManager.isHealthy(name)) {
        chain.push(provider);
      }
    }

    // If all preferred providers are unhealthy or unavailable, fallback to any registered provider or Gemini
    if (chain.length === 0) {
      for (const [name, provider] of this.providers.entries()) {
        if (!chain.includes(provider)) {
          chain.push(provider);
        }
      }
    }

    return chain;
  }
}

export const providerRouter = new ProviderRouter();
