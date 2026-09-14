/**
 * FLUENTO SERVER - AI ROUTES
 * 
 * Secure API endpoints proxying AI generation and streaming requests to AI Runtime.
 * All requests are executed on the server, enforcing GEMINI_API_KEY security.
 */

import { Router, Request, Response } from 'express';
import { aiRuntime } from '../../src/lib/ai-runtime/ai-runtime';
import { ModelRequest } from '../../src/lib/ai-runtime/types';

export const aiRouter = Router();

/**
 * Input validation and sanitization for AI requests.
 */
function validateAiRequest(body: any): { valid: boolean; error?: string; request?: ModelRequest } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a valid JSON object.' };
  }

  // Reject client attempts to pass API keys or credentials
  if (body.apiKey || body.credentials || body.secret) {
    return { valid: false, error: 'Client-supplied credentials or API keys are strictly forbidden.' };
  }

  if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
    return { valid: false, error: 'Field "prompt" is required and must be a non-empty string.' };
  }

  if (body.prompt.length > 10000) {
    return { valid: false, error: 'Field "prompt" exceeds maximum allowed length of 10,000 characters.' };
  }

  if (body.systemInstruction && (typeof body.systemInstruction !== 'string' || body.systemInstruction.length > 5000)) {
    return { valid: false, error: 'Field "systemInstruction" must be a string under 5,000 characters.' };
  }

  if (body.temperature !== undefined) {
    if (typeof body.temperature !== 'number' || body.temperature < 0 || body.temperature > 1) {
      return { valid: false, error: 'Field "temperature" must be a number between 0 and 1.' };
    }
  }

  if (body.maxTokens !== undefined) {
    if (typeof body.maxTokens !== 'number' || body.maxTokens < 1 || body.maxTokens > 8192) {
      return { valid: false, error: 'Field "maxTokens" must be a number between 1 and 8192.' };
    }
  }

  const sanitizedRequest: ModelRequest = {
    prompt: body.prompt.trim(),
    systemInstruction: body.systemInstruction ? body.systemInstruction.trim() : undefined,
    temperature: body.temperature,
    maxTokens: body.maxTokens,
    modelName: body.modelName ? String(body.modelName) : undefined,
    providerPreference: Array.isArray(body.providerPreference) ? body.providerPreference : undefined,
    sessionId: body.sessionId ? String(body.sessionId).substring(0, 100) : undefined,
    studentId: body.studentId ? String(body.studentId).substring(0, 100) : undefined,
  };

  return { valid: true, request: sanitizedRequest };
}

/**
 * POST /api/ai/generate
 */
aiRouter.post('/generate', async (req: Request, res: Response): Promise<void> => {
  const { valid, error, request } = validateAiRequest(req.body);

  if (!valid || !request) {
    res.status(400).json({
      error: 'INVALID_REQUEST',
      message: error || 'Invalid request payload.',
      status: 400
    });
    return;
  }

  if (!process.env.GEMINI_API_KEY && process.env.ALLOW_MOCK_AI !== 'true') {
    res.status(503).json({
      error: 'AI_PROVIDER_NOT_CONFIGURED',
      message: 'AI Provider is not configured. GEMINI_API_KEY is missing on the server.',
      status: 503
    });
    return;
  }

  try {
    const result = await aiRuntime.execute(request);
    res.status(200).json(result);
  } catch (err: any) {
    const errorMessage = err.message || String(err);

    if (errorMessage.includes('GEMINI_API_KEY_MISSING')) {
      res.status(503).json({
        error: 'AI_PROVIDER_NOT_CONFIGURED',
        message: 'AI Provider is not configured. GEMINI_API_KEY is missing on the server.',
        status: 503
      });
      return;
    }

    if (errorMessage.includes('Timeout')) {
      res.status(504).json({
        error: 'AI_TIMEOUT',
        message: 'AI request timed out.',
        status: 504
      });
      return;
    }

    if (errorMessage.includes('Rate limit')) {
      res.status(429).json({
        error: 'AI_RATE_LIMIT_EXCEEDED',
        message: 'AI rate limit exceeded. Please retry later.',
        status: 429
      });
      return;
    }

    res.status(500).json({
      error: 'AI_PROVIDER_FAILURE',
      message: 'Failed to process AI generation request.',
      status: 500
    });
  }
});

/**
 * POST /api/ai/stream
 */
aiRouter.post('/stream', async (req: Request, res: Response): Promise<void> => {
  const { valid, error, request } = validateAiRequest(req.body);

  if (!valid || !request) {
    res.status(400).json({
      error: 'INVALID_REQUEST',
      message: error || 'Invalid request payload.',
      status: 400
    });
    return;
  }

  if (!process.env.GEMINI_API_KEY && process.env.ALLOW_MOCK_AI !== 'true') {
    res.status(503).json({
      error: 'AI_PROVIDER_NOT_CONFIGURED',
      message: 'AI Provider is not configured. GEMINI_API_KEY is missing on the server.',
      status: 503
    });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  try {
    await aiRuntime.executeStream(request, (chunk) => {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    });
    res.end();
  } catch (err: any) {
    const errorMessage = err.message || String(err);
    const errorChunk = {
      error: 'AI_STREAM_FAILURE',
      message: errorMessage.includes('GEMINI_API_KEY_MISSING')
        ? 'GEMINI_API_KEY is missing on server'
        : 'Error occurred during streaming generation.',
      done: true
    };
    res.write(`data: ${JSON.stringify(errorChunk)}\n\n`);
    res.end();
  }
});
