/**
 * FLUENTO CONVERSATION ORCHESTRATOR - CORRECTION MANAGER
 * 
 * Determines when and how to apply corrections during a conversation turn.
 * Implements Fluento's Recasting strategy:
 * - Never say "You made a mistake" or "That is wrong".
 * - Use natural, involuntary recasting (reformulating the student's idea with native structure).
 * - Suppress corrections during high anxiety or warm-up blocks.
 */

import { RecastingDirective, TurnEvent } from './types';
import { ComposedLesson, BlockType } from '@/src/lib/lesson-composer';
import { StudentLearningState } from '@/src/lib/learning-engine';

export class CorrectionManager {
  /**
   * Evaluates a detected error and returns a RecastingDirective.
   */
  public evaluateCorrection(
    errorEvent: TurnEvent | null,
    currentBlockType: BlockType,
    lesson: ComposedLesson,
    studentState: StudentLearningState
  ): RecastingDirective {
    const recastingMode = lesson.pedagogicalConfig.recastingMode || 'involuntary_continuous';
    const isHighAnxiety = studentState.speakingAnxietyLevel >= 65;

    // 1. Warm-up, Reflection, Closing blocks: NEVER correct
    if (currentBlockType === 'warmup' || currentBlockType === 'reflection' || currentBlockType === 'closing') {
      return {
        shouldCorrect: false,
        recastingMode,
        correctionType: 'suppress',
        rationale: `Bloco do tipo '${currentBlockType}': Correções desativadas para proteger o filtro afetivo e o foco do bloco.`
      };
    }

    // 2. High Anxiety override: Suppress corrections
    if (isHighAnxiety) {
      return {
        shouldCorrect: false,
        recastingMode,
        correctionType: 'suppress',
        rationale: `Ansiedade de fala elevada (${studentState.speakingAnxietyLevel}/100): Correções ativas suprimidas para priorizar a segurança psicológica.`
      };
    }

    // 3. No error detected
    if (!errorEvent || errorEvent.eventType !== 'error_detected') {
      return {
        shouldCorrect: false,
        recastingMode,
        correctionType: 'suppress',
        rationale: 'Nenhum erro linguístico detetado no turno atual.'
      };
    }

    // 4. Low severity error in free conversation -> Involuntary natural recasting
    if (recastingMode === 'involuntary_continuous' || errorEvent.errorSeverity === 'low') {
      return {
        shouldCorrect: true,
        recastingMode: 'involuntary_continuous',
        correctionType: 'involuntary_echo',
        originalPhrase: errorEvent.rawTextSample,
        targetFocus: errorEvent.detectedErrorCategory,
        rationale: 'Recasting involuntário: Reformular naturalmente a ideia do aluno na resposta do professor sem apontar o erro diretamente.'
      };
    }

    // 5. Selective end-of-turn correction
    if (recastingMode === 'selective_end_of_turn') {
      return {
        shouldCorrect: true,
        recastingMode: 'selective_end_of_turn',
        correctionType: 'end_of_turn_rephrase',
        originalPhrase: errorEvent.rawTextSample,
        targetFocus: errorEvent.detectedErrorCategory,
        rationale: 'Correção seletiva de fim de turno: Apresentar a forma refinada no encerramento da intervenção.'
      };
    }

    // Default fallback
    return {
      shouldCorrect: true,
      recastingMode: 'involuntary_continuous',
      correctionType: 'involuntary_echo',
      originalPhrase: errorEvent.rawTextSample,
      targetFocus: errorEvent.detectedErrorCategory,
      rationale: 'Aplicar recasting natural padrão.'
    };
  }
}

export const correctionManager = new CorrectionManager();
