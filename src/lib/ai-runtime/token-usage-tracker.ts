/**
 * FLUENTO AI RUNTIME - TOKEN USAGE TRACKER
 * 
 * Tracks token consumption across providers, models, sessions, and students.
 */

import { TokenUsageRecord, ModelResponse, SupportedProvider } from './types';

export class TokenUsageTracker {
  private records: TokenUsageRecord[] = [];

  public recordUsage(
    response: ModelResponse,
    sessionId?: string,
    studentId?: string
  ): TokenUsageRecord {
    const record: TokenUsageRecord = {
      recordId: `tok_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestampIso: new Date().toISOString(),
      provider: response.provider,
      modelName: response.modelName,
      promptTokens: response.promptTokens,
      completionTokens: response.completionTokens,
      estimatedCostUsd: response.estimatedCostUsd,
      sessionId,
      studentId
    };

    this.records.push(record);
    return record;
  }

  public getRecords(): TokenUsageRecord[] {
    return [...this.records];
  }

  public getTotalTokens(filter?: { provider?: SupportedProvider; sessionId?: string; studentId?: string }): {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  } {
    let filtered = this.records;
    if (filter?.provider) filtered = filtered.filter(r => r.provider === filter.provider);
    if (filter?.sessionId) filtered = filtered.filter(r => r.sessionId === filter.sessionId);
    if (filter?.studentId) filtered = filtered.filter(r => r.studentId === filter.studentId);

    const promptTokens = filtered.reduce((acc, r) => acc + r.promptTokens, 0);
    const completionTokens = filtered.reduce((acc, r) => acc + r.completionTokens, 0);

    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    };
  }

  public clear(): void {
    this.records = [];
  }
}

export const tokenUsageTracker = new TokenUsageTracker();
