/**
 * FLUENTO TEACHER RUNTIME - TEACHER VALIDATOR
 * 
 * Validates generated TeacherDirectives against invariant Teacher DNA standards
 * and guardrail rules before passing directives to Prompt Builder.
 */

import { TeacherDirectives, TeacherValidationResult } from './types';

export class TeacherValidator {
  /**
   * Validates a TeacherDirectives instance.
   */
  public validateDirectives(directives: TeacherDirectives): TeacherValidationResult {
    const issues: string[] = [];

    if (!directives.profile || !directives.profile.name) {
      issues.push('Missing or invalid TeacherProfile.');
    }

    if (directives.feedback.maxCorrectionsPerTurn > 1) {
      issues.push(`maxCorrectionsPerTurn (${directives.feedback.maxCorrectionsPerTurn}) exceeds maximum allowed of 1.`);
    }

    if (directives.responseStyle.maxSentenceCount > 3) {
      issues.push(`maxSentenceCount (${directives.responseStyle.maxSentenceCount}) exceeds maximum allowed of 3.`);
    }

    if (directives.responseStyle.targetWordCountLimit > 50) {
      issues.push(`targetWordCountLimit (${directives.responseStyle.targetWordCountLimit}) exceeds maximum allowed of 50 words.`);
    }

    if (!directives.guardrails || directives.guardrails.forbiddenBehaviors.length === 0) {
      issues.push('TeacherGuardrailDirective is missing or contains no forbidden behaviors.');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

export const teacherValidator = new TeacherValidator();
