/**
 * Freeze Detection Module (Live Experience Engine)
 * Detects student hesitations, long silences, and verbal freezes,
 * offering scaffolded hints and gentle encouragement instead of revealing direct answers.
 */

export interface FreezeAnalysisInput {
  silenceDurationMs: number;
  partialUtteranceText?: string;
  hesitationMarkersCount: number; // e.g. "euh...", "hum...", "bueno..."
  currentConceptTarget?: string;
  nativeLanguage: string;
  targetLanguage: string;
}

export interface FreezeIntervention {
  isFreezeDetected: boolean;
  freezeType: 'extended_silence' | 'verbal_hesitation' | 'searching_for_word' | 'none';
  interventionAction: 'wait_patiently' | 'gentle_nudge' | 'scaffolded_hint' | 'socratic_question';
  suggestedTeacherSpeech: string;
  audioToneHint: 'patient_calm' | 'warm_supportive' | 'curious';
}

export function analyzeStudentFreeze(input: FreezeAnalysisInput): FreezeIntervention {
  const { silenceDurationMs, partialUtteranceText = '', hesitationMarkersCount, currentConceptTarget, targetLanguage } = input;

  // Case 1: Short silence (< 3.5s) -> Wait patiently without interruption
  if (silenceDurationMs < 3500 && hesitationMarkersCount === 0) {
    return {
      isFreezeDetected: false,
      freezeType: 'none',
      interventionAction: 'wait_patiently',
      suggestedTeacherSpeech: '',
      audioToneHint: 'patient_calm',
    };
  }

  // Case 2: Verbal hesitation / searching for word (3.5s - 6s or hesitation markers present)
  if (silenceDurationMs < 6000 || hesitationMarkersCount > 0) {
    const conceptHint = currentConceptTarget ? `Pensas em algo relacionado com ${currentConceptTarget}?` : 'Toma o teu tempo, estás a estruturar uma boa ideia.';
    return {
      isFreezeDetected: true,
      freezeType: 'searching_for_word',
      interventionAction: 'gentle_nudge',
      suggestedTeacherSpeech: `${conceptHint} Como dirias essa primeira parte em ${targetLanguage}?`,
      audioToneHint: 'warm_supportive',
    };
  }

  // Case 3: Extended silence (> 6s) -> Provide scaffolded Socratic hint
  return {
    isFreezeDetected: true,
    freezeType: 'extended_silence',
    interventionAction: 'scaffolded_hint',
    suggestedTeacherSpeech: `Sem pressa! Vamos construir juntos. Começa com a ideia principal: como começarias a frase?`,
    audioToneHint: 'patient_calm',
  };
}
