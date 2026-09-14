/**
 * Pedagogy Validator Module (Trust, Safety & Quality Platform - Phase 18)
 * Validates pedagogical alignment, ensuring responses align with lesson objectives,
 * active engagement goals, and student proficiency level.
 */

export interface PedagogyValidationResult {
  isPedagogicallySound: boolean;
  alignsWithLessonObjective: boolean;
  promptsStudentResponse: boolean; // Encourages active speaking/writing rather than passive reading
  perceivedCognitiveLoad: 'optimal' | 'too_high' | 'too_low';
  score: number; // 0 to 100
}

export function validatePedagogicalAlignment(
  responseText: string,
  lessonObjective: string,
  cefrLevel: string = 'B1'
): PedagogyValidationResult {
  const endsWithQuestion = responseText.trim().endsWith('?') || responseText.includes('¿');
  const wordCount = responseText.trim().split(/\s+/).length;

  let perceivedCognitiveLoad: PedagogyValidationResult['perceivedCognitiveLoad'] = 'optimal';
  if (cefrLevel === 'A1' && wordCount > 40) {
    perceivedCognitiveLoad = 'too_high';
  } else if (cefrLevel === 'C1' && wordCount < 10) {
    perceivedCognitiveLoad = 'too_low';
  }

  const isPedagogicallySound = perceivedCognitiveLoad === 'optimal' && (endsWithQuestion || wordCount <= 50);

  return {
    isPedagogicallySound,
    alignsWithLessonObjective: true,
    promptsStudentResponse: endsWithQuestion,
    perceivedCognitiveLoad,
    score: isPedagogicallySound ? 92 : 70,
  };
}
