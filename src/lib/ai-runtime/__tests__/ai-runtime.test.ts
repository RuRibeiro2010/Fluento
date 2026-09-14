/**
 * FLUENTO AI RUNTIME - UNIT TESTS
 * 
 * Verifies core runtime contracts, resilience patterns, cost/token tracking,
 * retries, and provider fallback mechanism.
 */

import { AIRuntime, aiRuntime } from '../ai-runtime';
import { geminiProvider } from '../gemini-provider';
import { openAIProvider } from '../openai-provider';
import { anthropicProvider } from '../anthropic-provider';
import { providerRouter } from '../provider-router';
import { retryManager } from '../retry-manager';
import { timeoutManager } from '../timeout-manager';
import { rateLimitManager } from '../rate-limit-manager';
import { fallbackManager } from '../fallback-manager';
import { tokenUsageTracker } from '../token-usage-tracker';
import { costTracker } from '../cost-tracker';
import { telemetry } from '../telemetry';
import { mockModelRequest } from '../fixtures';

export function runAIRuntimeTests(): { passed: boolean; results: string[] } {
  const results: string[] = [];
  let passed = true;

  const logTest = (name: string, condition: boolean, detail?: string) => {
    if (condition) {
      results.push(`✅ [PASS] ${name}`);
    } else {
      passed = false;
      results.push(`❌ [FAIL] ${name}${detail ? ` - ${detail}` : ''}`);
    }
  };

  try {
    // Test 1: Provider Availability & Registration
    logTest(
      'Provider Registration',
      !!providerRouter.getProvider('gemini') && !!providerRouter.getProvider('openai') && !!providerRouter.getProvider('anthropic')
    );

    // Test 2: Rate Limiter
    rateLimitManager.setMaxRequestsPerMinute(10);
    const initialAllowed = rateLimitManager.isAllowed('gemini');
    logTest('Rate Limit Allowed Initially', initialAllowed);

    // Test 3: Fallback Manager Reset & Health
    fallbackManager.resetHealth();
    const healthStatus = fallbackManager.getHealthStatus();
    logTest('Fallback Manager Health Reset', healthStatus.length >= 3 && healthStatus.every(h => h.isHealthy));

    // Test 4: Retry Manager
    let attemptsCount = 0;
    retryManager.executeWithRetry(async (attempt) => {
      attemptsCount = attempt;
      if (attempt < 2) throw new Error('Transient error');
      return 'success';
    }, 'mock', 'test-model', { maxRetries: 2, initialDelayMs: 10 }).then(res => {
      logTest('Retry Manager Backoff Success', res.result === 'success' && res.attempts === 2);
    }).catch(() => {
      logTest('Retry Manager Backoff Success', false, 'Promise rejected unexpectedly');
    });

    // Test 5: Timeout Manager
    const fastPromise = new Promise(resolve => setTimeout(() => resolve('fast'), 20));
    timeoutManager.executeWithTimeout(fastPromise, 200).then(res => {
      logTest('Timeout Manager Success within Window', res === 'fast');
    }).catch(() => {
      logTest('Timeout Manager Success within Window', false);
    });

    // Test 6: Cost and Token Tracking
    tokenUsageTracker.clear();
    const testResponse = {
      requestId: 'test_req',
      content: 'Sample response text',
      provider: 'gemini' as const,
      modelName: 'gemini-3.6-flash',
      promptTokens: 20,
      completionTokens: 30,
      totalTokens: 50,
      estimatedCostUsd: 0.0001,
      latencyMs: 150,
      fallbackOccurred: false,
      attempts: 1,
      timestampIso: new Date().toISOString()
    };
    tokenUsageTracker.recordUsage(testResponse, 'sess_test', 'student_test');
    const totalTokens = tokenUsageTracker.getTotalTokens({ sessionId: 'sess_test' });
    logTest('Token Tracker Recording', totalTokens.totalTokens === 50);

    const sessionCost = costTracker.getSessionCostUsd('sess_test');
    logTest('Cost Tracker Calculation', sessionCost === 0.0001);

    // Test 7: AIRuntime Synchronous Execution
    aiRuntime.execute({
      ...mockModelRequest,
      sessionId: 'sess_exec_test',
      timeoutMs: 3000
    }).then(res => {
      logTest('AI Runtime Execution Facade', !!res.content && res.provider === 'gemini');
    }).catch(err => {
      logTest('AI Runtime Execution Facade', false, err.message);
    });

    // Test 8: Telemetry Logging
    const events = telemetry.getEvents();
    logTest('Telemetry Logging Events', events.length > 0);

  } catch (err: any) {
    passed = false;
    results.push(`❌ [FATAL] Test runner threw exception: ${err.message}`);
  }

  return { passed, results };
}
