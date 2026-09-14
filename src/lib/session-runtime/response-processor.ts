/**
 * FLUENTO SESSION RUNTIME - RESPONSE PROCESSOR
 * 
 * Processes raw model outputs from AI Runtime, strips metadata flags if present,
 * validates content formatting, and produces clean teacher response text.
 */

import { ModelResponse } from '@/src/lib/ai-runtime';

export class ResponseProcessor {
  /**
   * Cleans and sanitizes teacher text from an AI Runtime response.
   */
  public processModelResponse(modelResponse: ModelResponse): string {
    let rawText = modelResponse.content || '';

    // Remove system tag prefixes or markdown block wrappers if present
    rawText = rawText.replace(/^\[TEACHER\]:\s*/i, '');
    rawText = rawText.replace(/^```(markdown|text)?\n/i, '').replace(/\n```$/i, '');

    const cleanText = rawText.trim();
    if (!cleanText) {
      return 'Percebi o que disseste! Vamos continuar o nosso exercício?';
    }

    return cleanText;
  }
}

export const responseProcessor = new ResponseProcessor();
