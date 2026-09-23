/**
 * FLUENTO SERVER - AI ROUTES
 * 
 * Secure API endpoints proxying AI generation and streaming requests to AI Runtime.
 * All requests are executed on the server, enforcing GEMINI_API_KEY security.
 */

import { Router, Request, Response } from 'express';
import { aiRuntime } from '../../src/lib/ai-runtime/ai-runtime';
import { AiGenerationSchema, createApiError } from '../validators/ai.validator';

export const aiRouter = Router();

/**
 * TRANSITIONAL SECURITY PROTECTION
 * 
 * Ensures the request originates from the Fluento application itself.
 * This is a first-line defense before full session-based authentication is implemented.
 */
const verifyInternalRequest = (req: Request, res: Response): boolean => {
  // Guard for non-Express requests (e.g. some mock testing environments)
  if (typeof req.get !== 'function') return true;

  const origin = req.get('origin');
  const host = req.get('host');
  const isDev = process.env.NODE_ENV !== 'production';

  // 1. Mandatory Origin in Production
  if (!isDev && !origin) {
    res.status(403).json(createApiError('ACCESS_FORBIDDEN', 'Origin header is required.'));
    return false;
  }

  // 2. Exact Origin Matching
  if (origin) {
    // In production, we expect the Origin to exactly match the current Host with HTTPS
    const expectedOrigin = isDev ? `http://${host}` : `https://${host}`;
    
    // Whitelist for development
    const allowedDevOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      `http://${host}`
    ];

    if (isDev) {
      if (!allowedDevOrigins.includes(origin)) {
        res.status(403).json(createApiError('ACCESS_FORBIDDEN', 'Invalid request origin.'));
        return false;
      }
    } else {
      // Strict check in production: must be EXACT match
      if (origin !== expectedOrigin) {
        res.status(403).json(createApiError('ACCESS_FORBIDDEN', 'Cross-origin request denied.'));
        return false;
      }
    }
  }

  return true;
};

/**
 * POST /api/ai/generate
 */
aiRouter.post('/generate', async (req: Request, res: Response): Promise<void> => {
  // 1. Internal Origin Protection
  if (!verifyInternalRequest(req, res)) return;

  // 2. Validation (Zod)
  const validation = AiGenerationSchema.safeParse(req.body);
  
  if (!validation.success) {
    res.status(400).json(createApiError(
      'INVALID_REQUEST',
      'The request payload is invalid or exceeds allowed limits.',
      validation.error.format()
    ));
    return;
  }

  const request = validation.data;

  // 2. Provider Check (Pre-execution)
  if (!process.env.GEMINI_API_KEY && process.env.ALLOW_MOCK_AI !== 'true') {
    res.status(503).json(createApiError(
      'AI_PROVIDER_NOT_CONFIGURED',
      'The AI service is currently unavailable or unconfigured on the server.'
    ));
    return;
  }

  try {
    // 3. Execution (Standard AIRuntime Facade)
    const result = await aiRuntime.execute(request);
    
    // 4. Response (Sanitized via AIRuntime response model)
    res.status(200).json(result);
  } catch (err: any) {
    const errorMessage = err.message || String(err);

    // 5. Error Sanitization & Standardized Contract
    if (errorMessage.includes('GEMINI_API_KEY_MISSING')) {
      res.status(503).json(createApiError('AI_PROVIDER_NOT_CONFIGURED', 'AI credentials missing.'));
    } else if (errorMessage.includes('Timeout')) {
      res.status(504).json(createApiError('AI_TIMEOUT', 'The AI request timed out.'));
    } else if (errorMessage.includes('Rate limit')) {
      res.status(429).json(createApiError('AI_RATE_LIMIT_EXCEEDED', 'Rate limit exceeded. Please try again later.'));
    } else if (errorMessage.includes('Budget cap')) {
      res.status(403).json(createApiError('AI_BUDGET_EXCEEDED', 'Session AI budget limit reached.'));
    } else {
      res.status(500).json(createApiError('AI_INTERNAL_ERROR', 'An unexpected error occurred during generation.'));
    }
  }
});

/**
 * POST /api/ai/stream
 */
aiRouter.post('/stream', async (req: Request, res: Response): Promise<void> => {
  // 1. Internal Origin Protection
  if (!verifyInternalRequest(req, res)) return;

  // 2. Validation (Zod)
  const validation = AiGenerationSchema.safeParse(req.body);
  
  if (!validation.success) {
    res.status(400).json(createApiError(
      'INVALID_REQUEST',
      'The request payload is invalid.',
      validation.error.format()
    ));
    return;
  }

  const request = validation.data;

  if (!process.env.GEMINI_API_KEY && process.env.ALLOW_MOCK_AI !== 'true') {
    res.status(503).json(createApiError('AI_PROVIDER_NOT_CONFIGURED', 'AI service not configured.'));
    return;
  }

  // 3. Abort Handling
  const abortController = new AbortController();
  req.on('close', () => {
    abortController.abort();
  });

  // 4. Stream Setup (SSE Headers)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  try {
    // 5. Execution
    await aiRuntime.executeStream({ ...request, signal: abortController.signal }, (chunk) => {
      if (abortController.signal.aborted) return;
      // 6. Streaming Output (Standardized Chunks)
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    });
    res.end();
  } catch (err: any) {
    if (abortController.signal.aborted) {
      res.end();
      return;
    }
    // 7. Stream Error Handling
    const errorMessage = err.message || String(err);
    const errorResponse = createApiError(
      errorMessage.includes('GEMINI_API_KEY_MISSING') ? 'AI_PROVIDER_NOT_CONFIGURED' : 'AI_STREAM_ERROR',
      'An error occurred during the AI stream.'
    );
    
    res.write(`data: ${JSON.stringify({ ...errorResponse, done: true })}\n\n`);
    res.end();
  }
});
