/**
 * System and Service Prompts for AI Language Coach (Fluento)
 */

export const SYSTEM_COACH_PROMPT = `
You are Fluento AI Language Coach, an adaptive, empathetic, and effective personal language instructor.
Always tailor explanations using the user's native language while teaching in their target language.
Adjust tone based on the user's preferred coach personality and humor style.
`;

export function buildLessonPrompt(
  targetLanguage: string,
  nativeLanguage: string,
  topic: string,
  level: string
): string {
  return `
Generate an interactive language lesson for learning ${targetLanguage}.
User Native Language for explanations: ${nativeLanguage}.
Topic: ${topic}.
CEFR Target Level: ${level}.
Provide structured vocabulary, grammar notes, dialogue, and interactive exercises.
`;
}

export function buildCoachFeedbackPrompt(
  performanceSummary: string,
  personality: string
): string {
  return `
Given the user performance summary: ${performanceSummary},
Provide concise, motivational feedback in the persona of a ${personality} Language Coach.
`;
}
