/**
 * FLUENTO PROMPT BUILDER - TOKEN BUDGET MANAGER
 * 
 * Monitors and enforces token budgets for system prompts and conversation contexts.
 * Ensures compatibility across Gemini, OpenAI, Claude, and local models without exceeding window limits.
 */

import { TokenBudgetConfig } from './types';

export class TokenBudgetManager {
  private defaultConfig: TokenBudgetConfig = {
    maxTotalTokens: 4096,
    systemPromptReserveTokens: 1200,
    historyReserveTokens: 2000,
    responseReserveTokens: 500
  };

  /**
   * Estimates token count for a string using a standard 3.8 - 4.0 chars per token heuristic.
   */
  public estimateTokenCount(text: string): number {
    if (!text) return 0;
    // Heuristic: ~3.8 characters per token for multilingual (EN/PT) prompt content
    return Math.ceil(text.length / 3.8);
  }

  /**
   * Checks if the given prompt text exceeds the specified token budget.
   */
  public isWithinBudget(text: string, budgetLimit: number): boolean {
    const estimated = this.estimateTokenCount(text);
    return estimated <= budgetLimit;
  }

  /**
   * Creates a resolved TokenBudgetConfig merging defaults with custom limits.
   */
  public resolveBudgetConfig(customBudget?: Partial<TokenBudgetConfig>): TokenBudgetConfig {
    return {
      ...this.defaultConfig,
      ...customBudget
    };
  }
}

export const tokenBudgetManager = new TokenBudgetManager();
