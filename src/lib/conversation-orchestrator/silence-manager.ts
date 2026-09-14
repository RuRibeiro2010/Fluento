/**
 * FLUENTO CONVERSATION ORCHESTRATOR - SILENCE MANAGER
 * 
 * Implements Mary Budd Rowe's Wait Time 1 & 2 principles for language learning.
 * - Wait Time 1: Silence after teacher asks a question (3-7s) before offering hints or taking back turn.
 * - Wait Time 2: Silence after student finishes speaking (3-5s) before teacher responds,
 *   allowing the student space to self-correct or expand ideas without interruption.
 */

import { SilenceAnalysis, TurnState } from './types';
import { ComposedLesson } from '@/src/lib/lesson-composer';
import { StudentLearningState } from '@/src/lib/learning-engine';

export class SilenceManager {
  /**
   * Evaluates detected silence duration and determines appropriate action based on state & anxiety.
   */
  public evaluateSilence(
    silenceSeconds: number,
    turnState: TurnState,
    lesson: ComposedLesson,
    studentState: StudentLearningState
  ): SilenceAnalysis {
    const configWaitTime = lesson.pedagogicalConfig.waitTimeSeconds || 4;
    const isHighAnxiety = studentState.speakingAnxietyLevel >= 65;

    // Adjust threshold based on anxiety (higher anxiety requires longer wait time tolerance)
    const baseWaitTime1 = isHighAnxiety ? Math.max(5, configWaitTime + 2) : configWaitTime;
    const baseWaitTime2 = isHighAnxiety ? Math.max(4, configWaitTime + 1) : configWaitTime;

    // 1. Evaluating Wait Time 1 (Post-Teacher Question Silence)
    if (turnState === 'wait_time_1' || turnState === 'teacher_speaking') {
      if (silenceSeconds < baseWaitTime1) {
        return {
          silenceType: 'wait_time_1',
          durationSeconds: silenceSeconds,
          thresholdSeconds: baseWaitTime1,
          actionRequired: 'continue_waiting',
          rationale: `Rowe Wait Time 1 ativo (${silenceSeconds.toFixed(1)}s / ${baseWaitTime1}s). Dar espaço ao aluno para processamento cognitivo.`
        };
      } else if (silenceSeconds < baseWaitTime1 + 4) {
        return {
          silenceType: 'wait_time_1',
          durationSeconds: silenceSeconds,
          thresholdSeconds: baseWaitTime1,
          actionRequired: 'provide_gentle_prompt',
          rationale: `Pausa prolongada pós-pergunta (${silenceSeconds.toFixed(1)}s). Oferecer encorajamento subtil sem pressão.`
        };
      } else {
        return {
          silenceType: 'wait_time_1',
          durationSeconds: silenceSeconds,
          thresholdSeconds: baseWaitTime1,
          actionRequired: 'provide_scaffolding_hint',
          rationale: `Silêncio ultrapassou o limiar de conforto (${silenceSeconds.toFixed(1)}s). Fornecer pista de apoio (scaffolding).`
        };
      }
    }

    // 2. Evaluating Wait Time 2 (Post-Student Response Silence)
    if (turnState === 'wait_time_2' || turnState === 'student_speaking') {
      if (silenceSeconds < baseWaitTime2) {
        return {
          silenceType: 'wait_time_2',
          durationSeconds: silenceSeconds,
          thresholdSeconds: baseWaitTime2,
          actionRequired: 'continue_waiting',
          rationale: `Rowe Wait Time 2 ativo (${silenceSeconds.toFixed(1)}s / ${baseWaitTime2}s). Aguardar para permitir auto-correção ou expansão da resposta pelo aluno.`
        };
      } else {
        return {
          silenceType: 'wait_time_2',
          durationSeconds: silenceSeconds,
          thresholdSeconds: baseWaitTime2,
          actionRequired: 'pass_turn_to_teacher',
          rationale: `Tempo de espera Wait Time 2 cumprido (${silenceSeconds.toFixed(1)}s). O professor pode agora assumir o turno e responder.`
        };
      }
    }

    // Default catch-all
    return {
      silenceType: 'awkward_silence',
      durationSeconds: silenceSeconds,
      thresholdSeconds: configWaitTime,
      actionRequired: 'continue_waiting',
      rationale: 'Silêncio em estado de transição.'
    };
  }
}

export const silenceManager = new SilenceManager();
