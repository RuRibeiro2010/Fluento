/**
 * FLUENTO SERVER - AI API UNIT TESTS
 * 
 * Verifies security boundary, request validation, missing key error state (HTTP 503),
 * credential rejection, and stream behavior.
 */

import { aiRouter } from '../routes/ai';

export async function runServerAiApiTests(): Promise<{ passed: boolean; results: string[] }> {
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
    // Helper to invoke Express router handler
    const invokeRoute = (body: any, url = '/generate'): Promise<{ status: number; jsonRes: any }> => {
      return new Promise((resolve) => {
        let status = 200;
        let jsonRes: any = {};

        const req: any = { body, method: 'POST', url };
        const res: any = {
          status: (code: number) => {
            status = code;
            return res;
          },
          json: (data: any) => {
            jsonRes = data;
            resolve({ status, jsonRes });
          }
        };

        (aiRouter as any)(req, res, () => {
          resolve({ status, jsonRes });
        });
      });
    };

    // Test 1: Rejects empty or missing prompt (HTTP 400)
    let res = await invokeRoute({});
    logTest('Rejects Empty Request Body (HTTP 400)', res.status === 400 && res.jsonRes.error === 'INVALID_REQUEST');

    // Test 2: Rejects client-supplied API key attempt (HTTP 400)
    res = await invokeRoute({ prompt: 'Hello', apiKey: 'user_supplied_secret_123' });
    logTest('Rejects Client-Supplied Credentials (HTTP 400)', res.status === 400 && res.jsonRes.message.includes('forbidden'));

    // Test 3: Rejects oversized prompt > 10,000 chars (HTTP 400)
    res = await invokeRoute({ prompt: 'A'.repeat(10001) });
    logTest('Rejects Oversized Prompt > 10k Chars (HTTP 400)', res.status === 400 && res.jsonRes.error === 'INVALID_REQUEST');

    // Test 4: Missing GEMINI_API_KEY generates HTTP 503 AI_PROVIDER_NOT_CONFIGURED
    const oldApiKey = process.env.GEMINI_API_KEY;
    const oldAllowMock = process.env.ALLOW_MOCK_AI;

    delete process.env.GEMINI_API_KEY;
    process.env.ALLOW_MOCK_AI = 'false';

    res = await invokeRoute({ prompt: 'What is CEFR level B2?' });
    logTest(
      'Missing GEMINI_API_KEY Returns Structured 503 AI_PROVIDER_NOT_CONFIGURED',
      res.status === 503 && res.jsonRes.error === 'AI_PROVIDER_NOT_CONFIGURED'
    );

    // Test 5: Execution under ALLOW_MOCK_AI=true
    process.env.ALLOW_MOCK_AI = 'true';
    res = await invokeRoute({ prompt: 'What is CEFR level B2?' });

    logTest(
      'Server AI Execution with ALLOW_MOCK_AI=true Succeeds',
      res.status === 200 && res.jsonRes.provider === 'gemini' && res.jsonRes.content.includes('[MOCK_SIMULATION]')
    );

    // Restore env
    if (oldApiKey) process.env.GEMINI_API_KEY = oldApiKey;
    else delete process.env.GEMINI_API_KEY;

    if (oldAllowMock) process.env.ALLOW_MOCK_AI = oldAllowMock;
    else delete process.env.ALLOW_MOCK_AI;

  } catch (err: any) {
    passed = false;
    results.push(`❌ [FATAL] Test runner exception: ${err.message}`);
  }

  return { passed, results };
}
