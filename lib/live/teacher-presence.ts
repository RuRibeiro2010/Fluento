/**
 * Teacher Presence Module (Live Experience Engine)
 * Controls the persona and conversational behavior of the virtual teacher to ensure a natural,
 * patient, warm, and encouraging interaction (like a high-empathy human tutor).
 *
 * Enforces key pedagogical rules:
 * - Never interrupt constantly.
 * - Explain concepts simply.
 * - When student asks for help, explain first in the target language; if doubts persist,
 *   use a temporary native language bridge before immediately returning to target language.
 */

export interface TeacherPersonaConfig {
  teacherName: string;
  patienceLevel: 'high' | 'maximum';
  warmthIndex: number; // 0 to 100
  speechRateWpm: number; // e.g. 110 wpm for A1 up to 150 wpm for C1
  conversationalPauseMs: number; // e.g. 800ms natural pause before responding
  praiseFrequency: 'subtle_authentic' | 'encouraging_frequent';
  humorStyle: 'gentle_warm' | 'professional_courteous';
}

export interface HelpExplanationRequest {
  concept: string;
  studentTargetLanguage: string;
  studentNativeLanguage: string;
  attemptNumber: number; // 1 = Target language explanation, 2 = Native bridge contrast
}

export interface StructuredTeacherExplanation {
  explanationText: string;
  languageUsed: 'target_language' | 'native_bridge_hybrid';
  returnToTargetPrompt: string;
  audioToneMood: 'patient_gentle' | 'clear_supportive';
}

export function getDefaultTeacherPersona(
  studentCEFRLevel: string = 'B1'
): TeacherPersonaConfig {
  const wpmMap: Record<string, number> = {
    A1: 105,
    A2: 120,
    B1: 135,
    B2: 150,
    C1: 165,
  };

  return {
    teacherName: 'Prof. Mateo',
    patienceLevel: 'maximum',
    warmthIndex: 90,
    speechRateWpm: wpmMap[studentCEFRLevel] || 130,
    conversationalPauseMs: 750,
    praiseFrequency: 'subtle_authentic',
    humorStyle: 'gentle_warm',
  };
}

export function generatePedagogicalHelpExplanation(
  request: HelpExplanationRequest
): StructuredTeacherExplanation {
  const { concept, studentTargetLanguage, studentNativeLanguage, attemptNumber } = request;

  // Attempt 1: Explain FIRST in the target language being learned
  if (attemptNumber <= 1) {
    return {
      explanationText: `Em ${studentTargetLanguage.toUpperCase()}: "${concept}" usa-se para expressar ideias com clareza e elegância natural.`,
      languageUsed: 'target_language',
      returnToTargetPrompt: `Tenta usar agora "${concept}" numa frase simples!`,
      audioToneMood: 'patient_gentle',
    };
  }

  // Attempt 2: If doubts persist, provide temporary native bridge before returning to target language
  return {
    explanationText: `Ponte de apoio (${studentNativeLanguage.toUpperCase()}): Em português, "${concept}" equivale exatamente a expressar uma opinião com cortesia. Regressando ao ${studentTargetLanguage.toUpperCase()}: vamos praticar diretamente!`,
    languageUsed: 'native_bridge_hybrid',
    returnToTargetPrompt: `Como dirias esta ideia na nossa conversa?`,
    audioToneMood: 'clear_supportive',
  };
}
