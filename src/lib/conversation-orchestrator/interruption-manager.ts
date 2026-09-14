/**
 * FLUENTO CONVERSATION ORCHESTRATOR - INTERRUPTION MANAGER
 * 
 * Regulates interruption rules during live interaction.
 * Key Golden Rule:
 * - Student interruptions during teacher speech are ALWAYS allowed and welcomed (yield floor instantly).
 * - Teacher interruptions during student speech are strictly FORBIDDEN by default to preserve
 *   the student's train of thought and lower speaking anxiety.
 */

import { InterruptionEvaluation, SpeakerRole, TurnState } from './types';
import { StudentLearningState } from '@/src/lib/learning-engine';

export class InterruptionManager {
  /**
   * Evaluates an interruption attempt and decides if it is permissible.
   */
  public evaluateInterruption(
    attemptedBy: SpeakerRole,
    currentTurnState: TurnState,
    studentState: StudentLearningState,
    isPanicSignal: boolean = false
  ): InterruptionEvaluation {
    // 1. Student interrupting Teacher
    if (attemptedBy === 'student' && currentTurnState === 'teacher_speaking') {
      return {
        isInterruptionAttempt: true,
        attemptedBy: 'student',
        allowed: true,
        reason: 'O aluno assumiu a palavra. O professor deve ceder o turno imediatamente para priorizar o tempo de fala do aluno.',
        suggestedAction: 'yield_floor_to_student'
      };
    }

    // 2. Emergency Panic Signal from Student (or System)
    if (isPanicSignal || studentState.speakingAnxietyLevel >= 90) {
      return {
        isInterruptionAttempt: true,
        attemptedBy,
        allowed: true,
        reason: 'Sinal de pânico/ansiedade extrema detetado. Intervenção de acolhimento imediato necessária.',
        suggestedAction: 'emergency_deescalation'
      };
    }

    // 3. Teacher attempting to interrupt Student
    if (attemptedBy === 'teacher' && (currentTurnState === 'student_speaking' || currentTurnState === 'wait_time_2')) {
      return {
        isInterruptionAttempt: true,
        attemptedBy: 'teacher',
        allowed: false,
        reason: 'PROIBIDO: O professor não deve interromper o aluno enquanto este está a produzir discurso ou na pausa de reflexão.',
        suggestedAction: 'ignore'
      };
    }

    // Default neutral evaluation
    return {
      isInterruptionAttempt: false,
      attemptedBy,
      allowed: true,
      reason: 'Sem conflito de turno.',
      suggestedAction: 'ignore'
    };
  }
}

export const interruptionManager = new InterruptionManager();
