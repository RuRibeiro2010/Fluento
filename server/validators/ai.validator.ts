import { z } from 'zod';

/**
 * AI REQUEST VALIDATOR
 * 
 * Strict schemas for AI generation requests.
 * Enforces size limits and type safety at the server boundary.
 */

export const ApprovedModels = [
  'gemini-1.5-flash',
  'gemini-3.6-flash', // Current default in GeminiProvider
  'gpt-4o-mini',      // Current default in OpenAIProvider
  'gpt-4o'
] as const;

export type SupportedModel = typeof ApprovedModels[number];

export const AiGenerationSchema = z.object({
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(10000, 'Prompt exceeds maximum length of 10,000 characters'),
  systemInstruction: z.string()
    .max(5000, 'System instruction exceeds maximum length of 5,000 characters')
    .optional(),
  modelName: z.enum(ApprovedModels, {
    message: 'Invalid or unapproved model requested'
  }).optional(),
  temperature: z.number()
    .min(0)
    .max(2)
    .optional(),
  maxTokens: z.number()
    .min(1)
    .max(4096)
    .optional(),
  requestId: z.string()
    .max(100)
    .optional(),
  // Prepare for future quota/session tracking
  sessionId: z.string().max(100).optional(),
  studentId: z.string().max(100).optional(),
  providerPreference: z.array(z.enum(['gemini', 'openai', 'anthropic', 'mock'])).optional(),
});

export type AiGenerationRequest = z.infer<typeof AiGenerationSchema>;

/**
 * Standardized Error Response Contract
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export const createApiError = (code: string, message: string, details?: any): ApiErrorResponse => ({
  error: { code, message, details }
});
