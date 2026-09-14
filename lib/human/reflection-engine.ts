/**
 * Reflection Engine Module (Fluento Human Experience - Phase 19)
 * Prompts post-lesson metacognitive reflection ("What went well?", "What felt challenging?",
 * "How do you feel?") and incorporates student self-assessments to improve future lessons.
 */

export interface EndOfSessionReflection {
  sessionId: string;
  perceivedEaseRating: number; // 1 (very hard) to 5 (very easy)
  selfReportedConfidence: number; // 1 to 10
  highlightMomentText?: string;
  perceivedStruggleText?: string;
  submittedIso: string;
}

export interface ReflectionPrompt {
  questionText: string;
  focusArea: 'ease' | 'confidence' | 'struggle';
}

export function generatePostLessonReflectionPrompts(): ReflectionPrompt[] {
  return [
    {
      questionText: 'Como te sentiste em relação ao ritmo da conversa de hoje?',
      focusArea: 'ease',
    },
    {
      questionText: 'Qual foi o momento em que te sentiste mais confiante a falar?',
      focusArea: 'confidence',
    },
    {
      questionText: 'Houve alguma palavra ou estrutura que tenha parecido mais desafiante?',
      focusArea: 'struggle',
    },
  ];
}
