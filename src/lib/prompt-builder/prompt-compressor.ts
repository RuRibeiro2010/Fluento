/**
 * FLUENTO PROMPT BUILDER - PROMPT COMPRESSOR
 * 
 * Compresses prompt sections into high-density, concise directives
 * to reduce token consumption while preserving critical pedagogical guardrails.
 */

import { PromptContextPackage } from './types';

export class PromptCompressor {
  /**
   * Compresses a full PromptContextPackage into a high-density string representation.
   */
  public compressContext(pkg: PromptContextPackage): string {
    const { teacherSection, studentSection, lessonSection, conversationSection, memorySection, safetySection } = pkg;

    const compressedParts: string[] = [
      `[TEACHER]: ${teacherSection.roleIdentity} | Tone: ${teacherSection.toneAndEmpathyGuidelines}`,
      `[FORBIDDEN]: ${teacherSection.forbiddenBehaviours.join('; ')}`,
      `[STUDENT]: ${studentSection.studentProfileSummary} | CEFR: ${studentSection.currentCefrLevel} | Emotion: ${studentSection.emotionalStateAndAnxiety}`,
      `[BLOCK]: ${lessonSection.activeBlockTitle} (${lessonSection.interactionPattern}) | Scaffolding: ${lessonSection.scaffoldingLevel} | STT Target: ${lessonSection.targetStudentTalkTimeRatio}`,
      `[TURN DIRECTIVE]: Speaker=${conversationSection.nextSpeaker} | WaitTime=${conversationSection.waitTimeInstruction} | Recasting=${conversationSection.recastingDirectiveText}`,
      `[SAFETY]: ${safetySection.affectiveFilterProtectionRules.join('; ')}`
    ];

    if (memorySection.scheduledReviewItemsText.length > 0) {
      compressedParts.push(`[SRS REVIEWS]: ${memorySection.scheduledReviewItemsText.join(', ')}`);
    }

    if (memorySection.permanentTraumasAndBlocks.length > 0) {
      compressedParts.push(`[SENSITIVE TOPICS]: ${memorySection.permanentTraumasAndBlocks.join(', ')}`);
    }

    return compressedParts.join('\n');
  }
}

export const promptCompressor = new PromptCompressor();
