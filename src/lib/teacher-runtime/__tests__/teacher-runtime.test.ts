/**
 * FLUENTO TEACHER RUNTIME - UNIT TESTS
 * 
 * Verifies invariant Virtual Teacher personality, guardrail enforcement,
 * high-anxiety de-escalation, language scaffolding, and directive validation.
 */

import { teacherRuntime } from '../teacher-runtime';
import { teacherValidator } from '../teacher-validator';
import { mockTeacherEvaluationInputNormal, mockTeacherEvaluationInputHighAnxiety } from '../fixtures';

export async function runTeacherRuntimeTestSuite() {
  const results: { testName: string; passed: boolean; message: string }[] = [];

  function assert(condition: boolean, testName: string, message: string) {
    results.push({
      testName,
      passed: condition,
      message: condition ? 'PASSED' : `FAILED: ${message}`
    });
  }

  // 1. Generate Directives for Normal Input
  const normalDirectives = teacherRuntime.generateDirectives(mockTeacherEvaluationInputNormal);

  assert(
    normalDirectives.profile.name === 'Sofia' && normalDirectives.tone.primaryTone === 'warm_supportive',
    'TeacherRuntime - Normal Directive Generation',
    'Should generate valid directives with default Sofia profile and warm_supportive tone'
  );

  // 2. Validate Directive Constraints
  const valResult = teacherValidator.validateDirectives(normalDirectives);
  assert(
    valResult.isValid,
    'TeacherValidator - Directive Validation',
    'Generated directives must pass structural validation'
  );

  // 3. Low Anxiety Feedback Guardrails
  assert(
    normalDirectives.feedback.maxCorrectionsPerTurn <= 1 && normalDirectives.responseStyle.maxSentenceCount <= 3,
    'TeacherRuntime - Response Length & Correction Guardrails',
    'Max corrections per turn must be <= 1 and max sentence count <= 3'
  );

  // 4. High Anxiety / Panic Adaptation
  const panicDirectives = teacherRuntime.generateDirectives(mockTeacherEvaluationInputHighAnxiety);

  assert(
    panicDirectives.tone.primaryTone === 'calm_reassuring' &&
    panicDirectives.empathy.affectiveFilterAction === 'deescalate' &&
    panicDirectives.feedback.maxCorrectionsPerTurn === 0 &&
    panicDirectives.guardrails.safetyOverride === true,
    'TeacherRuntime - High Anxiety / Panic De-escalation',
    'Panic state must set calm_reassuring tone, zero corrections, de-escalation empathy, and safety override'
  );

  // 5. Language Scaffolding Ratio Shift
  assert(
    panicDirectives.language.portugueseScaffoldingLevel === 'high' &&
    panicDirectives.language.targetLanguageRatio < normalDirectives.language.targetLanguageRatio,
    'TeacherRuntime - Portuguese Scaffolding Adaptation',
    'Panic state must increase Portuguese scaffolding level to high and lower English ratio'
  );

  return results;
}
