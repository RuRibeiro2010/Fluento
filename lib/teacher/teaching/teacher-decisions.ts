/**
 * Teacher Decisions Module (Human Teaching Engine)
 * Central pedagogical decision engine determining real-time interventions:
 * when to correct immediately, when to wait, when to insist on guided discovery,
 * when to provide progressive hints, or when to switch strategies.
 */

export type ActionInterventionType =
  | 'CORRECT_IMMEDIATELY'
  | 'BUFFER_CORRECTION_FOR_PAUSE'
  | 'INSIST_GUIDED_DISCOVERY'
  | 'PROVIDE_PROGRESSIVE_HINT'
  | 'SWITCH_EXPLANATION_STRATEGY'
  | 'PRAISE_AND_CONTINUE';

export interface StudentInputContext {
  studentUtterance: string;
  isCorrect: boolean;
  confidenceScore: number; // 0 to 100
  responseLatencyMs: number;
  consecutiveErrorCount: number;
  isFluencyDialogueMode: boolean; // if true, prioritize conversation flow over micro-corrections
  conceptCategory: string;
}

export interface InterventionDecision {
  action: ActionInterventionType;
  rationale: string;
  pedagogicalPriority: 'high' | 'medium' | 'low';
}

export function evaluateTeacherDecision(
  context: StudentInputContext
): InterventionDecision {
  // Case 1: Student is correct with high confidence
  if (context.isCorrect && context.confidenceScore >= 75) {
    return {
      action: 'PRAISE_AND_CONTINUE',
      rationale: 'Resposta correta com elevada certeza. Manter fluência da aula.',
      pedagogicalPriority: 'low',
    };
  }

  // Case 2: Student is correct but hesitated or guessed
  if (context.isCorrect && context.confidenceScore < 60) {
    return {
      action: 'INSIST_GUIDED_DISCOVERY',
      rationale: 'Acerto com incerteza. Aplicar pergunta Socrática leve para confirmar consolidação.',
      pedagogicalPriority: 'medium',
    };
  }

  // Case 3: Multiple consecutive errors on same concept (> 2) -> Switch Strategy
  if (!context.isCorrect && context.consecutiveErrorCount >= 3) {
    return {
      action: 'SWITCH_EXPLANATION_STRATEGY',
      rationale: 'A abordagem atual está a gerar fricção. Mudar para analogia do mundo real ou ponte nativa.',
      pedagogicalPriority: 'high',
    };
  }

  // Case 4: Fluency dialogue mode -> Buffer minor corrections to preserve conversation flow
  if (!context.isCorrect && context.isFluencyDialogueMode && context.consecutiveErrorCount < 2) {
    return {
      action: 'BUFFER_CORRECTION_FOR_PAUSE',
      rationale: 'Modo de conversação ativa. Guardar correção para a pausa natural do diálogo.',
      pedagogicalPriority: 'low',
    };
  }

  // Case 5: Single error with low confidence -> Provide progressive hint
  if (!context.isCorrect && context.confidenceScore < 45) {
    return {
      action: 'PROVIDE_PROGRESSIVE_HINT',
      rationale: 'Hesitação clara. Oferecer dica de nível 1 antes de solicitar nova tentativa.',
      pedagogicalPriority: 'medium',
    };
  }

  // Case 6: Standard error in targeted drill -> Correct immediately with reframing
  return {
    action: 'CORRECT_IMMEDIATELY',
    rationale: 'Ajuste direto necessário para evitar fossilização do erro.',
    pedagogicalPriority: 'high',
  };
}
