/**
 * Hint Engine Module (Human Teaching Engine)
 * Provides progressive multi-tiered hints (Level 1: Category/Context ->
 * Level 2: First letter / Key structure -> Level 3: Sentence frame) before revealing answers.
 */

export interface HintTier {
  level: 1 | 2 | 3;
  hintTitle: string;
  hintText: string;
  audioPromptHint?: string;
}

export interface HintSequence {
  targetAnswer: string;
  conceptName: string;
  level1Category: string; // e.g., 'Verbo no passado para negociação'
  level2Structure: string; // e.g., 'Começa com "Quisi..."'
  level3PartialFrame: string; // e.g., 'Quisiera proponer una _______.'
}

export function generateProgressiveHintSequence(
  sequence: HintSequence,
  requestedLevel: 1 | 2 | 3
): HintTier {
  if (requestedLevel === 1) {
    return {
      level: 1,
      hintTitle: 'Dica de Contexto (Nível 1)',
      hintText: `Pensa no tipo de palavra necessária: ${sequence.level1Category}.`,
      audioPromptHint: `Lembra-te do contexto de ${sequence.level1Category}.`,
    };
  }

  if (requestedLevel === 2) {
    return {
      level: 2,
      hintTitle: 'Dica de Estrutura (Nível 2)',
      hintText: `Pista de formato: ${sequence.level2Structure}.`,
      audioPromptHint: `Eis uma pista: ${sequence.level2Structure}.`,
    };
  }

  return {
    level: 3,
    hintTitle: 'Frase Guiada (Nível 3)',
    hintText: `Completa a estrutura: "${sequence.level3PartialFrame}"`,
    audioPromptHint: `Quase lá! Completa a frase: ${sequence.level3PartialFrame}`,
  };
}
