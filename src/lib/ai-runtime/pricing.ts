/**
 * FLUENTO AI RUNTIME - PRICING ENGINE
 * 
 * Centralized pricing constants and utility for estimating LLM costs.
 * All prices are in USD per 1,000 tokens.
 */

import { SupportedModel } from '../../../server/validators/ai.validator';

interface ModelPricing {
  input: number;
  output: number;
}

const PRICING_TABLE: Record<string, ModelPricing> = {
  // Gemini
  'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
  'gemini-3.6-flash': { input: 0.000075, output: 0.0003 },
  'gemini-1.5-pro':   { input: 0.0035,   output: 0.0105 },

  // OpenAI
  'gpt-4o-mini':      { input: 0.00015,  output: 0.0006 },
  'gpt-4o':           { input: 0.005,    output: 0.015 },

  // Defaults (Safety)
  'default':          { input: 0.005,    output: 0.015 } // Default to expensive to be conservative
};

/**
 * Calculates the estimated cost of an AI request.
 */
export function estimateCost(
  modelName: string,
  promptTokens: number,
  completionTokens: number
): number {
  const pricing = PRICING_TABLE[modelName] || PRICING_TABLE['default'];
  
  const inputCost = (promptTokens / 1000) * pricing.input;
  const outputCost = (completionTokens / 1000) * pricing.output;
  
  return Number((inputCost + outputCost).toFixed(8));
}
