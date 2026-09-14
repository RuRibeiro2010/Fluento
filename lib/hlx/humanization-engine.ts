/**
 * Humanization Engine Module (Human Learning Experience - HLX)
 * Ensures the virtual teacher exhibits natural human cadence, organic speech variation,
 * conversational pause rhythms, empathetic listening cues, and warmth (never acting like a robotic LLM).
 */

export interface HumanSpeechRhythm {
  wpmRate: number; // Words per minute
  preUtterancePauseMs: number; // Thoughtful pause before speaking
  empatheticListeningCue: string; // e.g. "Compreendo...", "Exatamente...", "Claro..."
  tonalInflection: 'warm_encouraging' | 'thoughtful' | 'enthusiastic' | 'gentle';
  hasHumorTouch: boolean;
}

export function computeHumanSpeechRhythm(
  cefrLevel: string,
  turnNumber: number,
  isUserHesitating: boolean = false
): HumanSpeechRhythm {
  const cues = ['Compreendo perfeitamente...', 'Exatamente!', 'Claro...', 'Faz todo o sentido...', 'Excelente ponto...'];
  const cue = cues[turnNumber % cues.length];

  let wpm = 130;
  let pauseMs = 650;

  if (cefrLevel === 'A1' || cefrLevel === 'A2') {
    wpm = 110;
    pauseMs = 850;
  } else if (cefrLevel === 'B2' || cefrLevel === 'C1') {
    wpm = 145;
    pauseMs = 500;
  }

  if (isUserHesitating) {
    pauseMs += 300; // Extra patient pause when student is thinking
  }

  return {
    wpmRate: wpm,
    preUtterancePauseMs: pauseMs,
    empatheticListeningCue: cue,
    tonalInflection: isUserHesitating ? 'thoughtful' : 'warm_encouraging',
    hasHumorTouch: turnNumber > 3 && turnNumber % 5 === 0,
  };
}

export function filterOutRoboticPhrases(text: string): string {
  // Replace generic robotic LLM phrases with natural human expressions
  return text
    .replace(/Como um modelo de IA,/gi, '')
    .replace(/Enquanto tutor de inteligência artificial,/gi, '')
    .replace(/Como seu assistente,/gi, '')
    .replace(/Certamente! Aqui está/gi, 'Com certeza! Vamos a isso')
    .replace(/Espero que esta explicação tenha sido útil\./gi, 'Faz sentido para ti?')
    .trim();
}
