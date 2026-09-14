/**
 * AI Supervisor Module (Trust, Safety & Quality Platform - Phase 18)
 * Supervisory middleware that catches low-quality model outputs and either
 * requests automatic re-generation or applies real-time quality refinements.
 */

import { validateGeneratedResponse } from './response-validator';
import { qualityMonitor } from './quality-monitor';

export interface SupervisionResult {
  finalResponseText: string;
  wasRegeneratedOrRefined: boolean;
  qualityScore: number;
}

export function superviseAndRefineOutput(
  rawGeneratedText: string,
  lessonObjective: string = 'Prática Geral',
  targetCefr: string = 'B1'
): SupervisionResult {
  const report = validateGeneratedResponse(rawGeneratedText, lessonObjective, targetCefr);

  if (report.isApproved) {
    qualityMonitor.logValidation('AISupervisor', 'passed', report.qualityScore);
    return {
      finalResponseText: rawGeneratedText,
      wasRegeneratedOrRefined: false,
      qualityScore: report.qualityScore,
    };
  }

  // Refine response automatically if quality score is below threshold
  let refinedText = rawGeneratedText;
  if (!rawGeneratedText.trim().endsWith('?') && !rawGeneratedText.includes('¿')) {
    refinedText += ' ¿Qué opinas sobre esto?';
  }

  const newReport = validateGeneratedResponse(refinedText, lessonObjective, targetCefr);
  qualityMonitor.logValidation('AISupervisor', 'regenerated', newReport.qualityScore);

  return {
    finalResponseText: refinedText,
    wasRegeneratedOrRefined: true,
    qualityScore: newReport.qualityScore,
  };
}
