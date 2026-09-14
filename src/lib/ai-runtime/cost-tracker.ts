/**
 * FLUENTO AI RUNTIME - COST TRACKER
 * 
 * Monitors expenditure per session/student, providing financial limits and alerts.
 */

import { tokenUsageTracker } from './token-usage-tracker';
import { SupportedProvider } from './types';

export class CostTracker {
  private sessionBudgetCapUsd: number = 0.50; // $0.50 cap per session default

  public setSessionBudgetCap(usd: number): void {
    this.sessionBudgetCapUsd = usd;
  }

  public getSessionCostUsd(sessionId: string): number {
    const records = tokenUsageTracker.getRecords().filter(r => r.sessionId === sessionId);
    return records.reduce((acc, r) => acc + r.estimatedCostUsd, 0);
  }

  public getTotalCostUsd(provider?: SupportedProvider): number {
    const records = tokenUsageTracker.getRecords();
    const filtered = provider ? records.filter(r => r.provider === provider) : records;
    return filtered.reduce((acc, r) => acc + r.estimatedCostUsd, 0);
  }

  public isSessionWithinBudget(sessionId: string): boolean {
    const cost = this.getSessionCostUsd(sessionId);
    return cost < this.sessionBudgetCapUsd;
  }

  public getCostSummaryByProvider(): Record<SupportedProvider, number> {
    const records = tokenUsageTracker.getRecords();
    const summary: Record<SupportedProvider, number> = {
      gemini: 0,
      openai: 0,
      anthropic: 0,
      mock: 0
    };

    for (const r of records) {
      if (summary[r.provider] !== undefined) {
        summary[r.provider] += r.estimatedCostUsd;
      }
    }

    return summary;
  }
}

export const costTracker = new CostTracker();
