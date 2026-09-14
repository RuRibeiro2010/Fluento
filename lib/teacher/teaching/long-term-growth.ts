import { LongTermStudentInsight, TeacherInternalReflection } from '@/types/teacher';

/**
 * Long-term Growth Module (Long-Term Pedagogical Memory)
 *
 * Stores and manages discovered pedagogical strategies for each student.
 * Whenever a teacher discovers what works best for a specific student profile
 * (e.g. Socratic hints, Portuguese bridge phrases for grammar, open choice questions),
 * this knowledge is persisted so the system continuously evolves and never forgets.
 */

const STORAGE_KEY_PREFIX = 'fluento_student_insights_';

/**
 * Retrieves all long-term pedagogical insights stored for a given student.
 */
export function getLongTermStudentInsights(studentId: string = 'usr_guest'): LongTermStudentInsight[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${studentId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Updates or persists a new discovered insight from a session's AI reflection.
 */
export function saveDiscoveredInsightFromReflection(
  studentId: string = 'usr_guest',
  reflection: TeacherInternalReflection,
  targetLanguage: string = 'es'
): LongTermStudentInsight {
  const existing = getLongTermStudentInsights(studentId);

  let effectiveStyle: LongTermStudentInsight['effectiveCorrectionStyle'] = 'buffered';
  if (reflection.overCorrectionDetected) {
    effectiveStyle = 'minimal_encouragement';
  } else if (reflection.studentTalkRatioPercentage >= 70) {
    effectiveStyle = 'socratic';
  }

  const newInsight: LongTermStudentInsight = {
    studentId,
    discoveredAt: new Date().toISOString(),
    effectiveCorrectionStyle: effectiveStyle,
    anxietyTriggers: reflection.overExplanationDetected
      ? ['Explicações longas', 'Perguntas directas sob pressão']
      : [],
    bestScaffoldingStrategy: reflection.adaptationStrategyForNextSession,
    consolidatedVocabulary: [],
    recurringGrammarTraps: ['ser vs estar', 'por vs para'],
    notes: `Estratégia comprovada (${targetLanguage.toUpperCase()}): ${reflection.keyPedagogicalTakeaway}`,
  };

  const updated = [newInsight, ...existing.slice(0, 9)]; // Keep up to 10 insights

  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${studentId}`, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors gracefully
  }

  return newInsight;
}

/**
 * Generates initial adaptive guidance for the teacher based on historical long-term insights.
 */
export function getTeacherInitialGuidanceFromHistory(studentId: string = 'usr_guest'): {
  recommendedCorrectionStyle: 'buffered' | 'socratic' | 'minimal_encouragement';
  pedagogicalAdvicePrompt: string;
} {
  const insights = getLongTermStudentInsights(studentId);
  if (insights.length === 0) {
    return {
      recommendedCorrectionStyle: 'buffered',
      pedagogicalAdvicePrompt: 'Utiliza perguntas abertas e incentiva o tempo de fala do aluno (~70%).',
    };
  }

  const latest = insights[0];
  return {
    recommendedCorrectionStyle: latest.effectiveCorrectionStyle,
    pedagogicalAdvicePrompt: `Histórico comprovado: ${latest.notes}. Foco em: ${latest.bestScaffoldingStrategy}.`,
  };
}
