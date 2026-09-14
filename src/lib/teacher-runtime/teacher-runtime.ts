/**
 * FLUENTO TEACHER RUNTIME - MAIN ENGINE FACADE
 * 
 * Central coordinator responsible for maintaining the invariant Virtual Teacher Personality
 * across all AI model backends.
 * 
 * STRICT MANDATES:
 * - NO pedagogical decision logic (handled by Learning Engine).
 * - NO lesson composition (handled by Lesson Composer).
 * - NO conversation state machine (handled by Conversation Orchestrator).
 * - NO raw LLM prompt text rendering (handled by Prompt Builder).
 * - NO model calls (handled by AI Runtime).
 * - Outputs ONLY structured `TeacherDirectives` for consumption downstream.
 */

import { TeacherDirectives, TeacherEvaluationInput, TeacherProfile } from './types';
import { teacherProfileManager } from './teacher-profile';
import { teacherPersonality } from './teacher-personality';
import { teacherTone } from './teacher-tone';
import { teacherLanguage } from './teacher-language';
import { teacherPresence } from './teacher-presence';
import { teacherEmpathy } from './teacher-empathy';
import { teacherFeedback } from './teacher-feedback';
import { teacherResponseStyle } from './teacher-response-style';
import { teacherGuardrails } from './teacher-guardrails';
import { teacherValidator } from './teacher-validator';

export class TeacherRuntime {
  /**
   * Generates complete structured TeacherDirectives for a turn.
   */
  public generateDirectives(
    input: TeacherEvaluationInput,
    profileOverride?: Partial<TeacherProfile>
  ): TeacherDirectives {
    const profile = profileOverride
      ? teacherProfileManager.createCustomProfile(profileOverride)
      : teacherProfileManager.getDefaultProfile();

    const personality = teacherPersonality.computeTraits(input);
    const tone = teacherTone.computeTone(input);
    const language = teacherLanguage.computeLanguageDirective(input);
    const presence = teacherPresence.computePresence(input);
    const empathy = teacherEmpathy.computeEmpathy(input);
    const feedback = teacherFeedback.computeFeedback(input);
    const responseStyle = teacherResponseStyle.computeResponseStyle(input);
    const guardrails = teacherGuardrails.computeGuardrails(input);

    const directives: TeacherDirectives = {
      profile,
      personality,
      tone,
      language,
      presence,
      empathy,
      feedback,
      responseStyle,
      guardrails,
      generatedTimestampIso: new Date().toISOString()
    };

    const validation = teacherValidator.validateDirectives(directives);
    if (!validation.isValid) {
      console.warn(`[TeacherRuntime Warning] Directives validation issues: ${validation.issues.join('; ')}`);
    }

    return directives;
  }
}

export const teacherRuntime = new TeacherRuntime();
