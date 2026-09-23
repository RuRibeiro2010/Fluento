/**
 * FLUENTO AI RUNTIME - SECURITY TESTS
 * 
 * Verifies model allow-listing, retry policy hardening, and budget protection.
 */

import { retryManager } from '../retry-manager';
import { ApprovedModels, AiGenerationSchema } from '../../../../server/validators/ai.validator';
import { estimateCost } from '../pricing';

export async function runAISecurityTests(): Promise<{ passed: boolean; results: string[] }> {
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
    // 1. Model Allow-list Validation
    logTest(
      'Model Allow-list: Valid Model',
      AiGenerationSchema.safeParse({ prompt: 'test', modelName: 'gemini-1.5-flash' }).success
    );

    logTest(
      'Model Allow-list: Rejected Expensive Model',
      !AiGenerationSchema.safeParse({ prompt: 'test', modelName: 'gemini-1.5-pro' }).success
    );

    logTest(
      'Model Allow-list: Rejected Malicious Model',
      !AiGenerationSchema.safeParse({ prompt: 'test', modelName: 'expensive-unsupported-model' }).success
    );

    // 2. Retry Policy: Non-Retryable Errors
    const permanentError = new Error('AI_PROVIDER_NOT_CONFIGURED');
    try {
      await retryManager.executeWithRetry(async () => {
        throw permanentError;
      }, 'gemini', 'gemini-1.5-flash', { maxRetries: 2, initialDelayMs: 1 });
      logTest('Retry Policy: Do Not Retry Permanent Error', false, 'Should have failed immediately');
    } catch (err: any) {
      logTest('Retry Policy: Reject Permanent Error Immediately', err.message === 'AI_PROVIDER_NOT_CONFIGURED');
    }

    const validationError = new Error('INVALID_REQUEST');
    try {
      await retryManager.executeWithRetry(async () => {
        throw validationError;
      }, 'gemini', 'gemini-1.5-flash', { maxRetries: 2, initialDelayMs: 1 });
    } catch (err: any) {
      logTest('Retry Policy: Reject Validation Error Immediately', err.message === 'INVALID_REQUEST');
    }

    // 3. Retry Policy: Retryable Errors
    try {
      let attempts = 0;
      const res = await retryManager.executeWithRetry(async () => {
        attempts++;
        if (attempts < 2) throw new Error('Timeout');
        return 'success';
      }, 'gemini', 'gemini-1.5-flash', { maxRetries: 2, initialDelayMs: 1 });
      logTest('Retry Policy: Retry on Transient Error', res.attempts === 2);
    } catch (err: any) {
      logTest('Retry Policy: Retry on Transient Error', false, err.message);
    }

    // 4. Pricing Engine Accuracy
    const flashCost = estimateCost('gemini-1.5-flash', 1000, 1000);
    logTest('Pricing: Gemini Flash Calculation', flashCost === 0.000375); // (1 * 0.000075) + (1 * 0.0003)

    const miniCost = estimateCost('gpt-4o-mini', 1000, 1000);
    logTest('Pricing: GPT-4o-mini Calculation', miniCost === 0.00075); // (1 * 0.00015) + (1 * 0.0006)

    const gpt4Cost = estimateCost('gpt-4o', 1000, 1000);
    logTest('Pricing: GPT-4o Calculation', gpt4Cost === 0.02); // (1 * 0.005) + (1 * 0.015)

    const fallbackCost = estimateCost('unknown-model', 1000, 1000);
    logTest('Pricing: Unknown Model Fallback to Expensive', fallbackCost === 0.02);

  } catch (err: any) {
    passed = false;
    results.push(`❌ [FATAL] Security tests threw exception: ${err.message}`);
  }

  return { passed, results };
}
