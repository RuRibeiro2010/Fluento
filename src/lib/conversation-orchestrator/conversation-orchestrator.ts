/**
 * FLUENTO CONVERSATION ORCHESTRATOR - MAIN ORCHESTRATOR
 * 
 * Central controller for real-time conversation orchestration.
 * Coordinates Turn, Silence, Interruption, Correction, Pacing, Speaking Ratio,
 * and Emotional Monitoring managers.
 * 
 * Strictly follows:
 * - FLUENTO_PLAYBOOK.md
 * - TEACHER_GUIDELINES.md
 * - FLUENTO_INTELLIGENCE_ARCHITECTURE.md
 * - FLUENTO_LEARNING_ENGINE.md
 * 
 * NO LLM calls or text generation. Pure structural turn & floor control.
 */

import { ComposedLesson } from '@/src/lib/lesson-composer';
import { StudentLearningState } from '@/src/lib/learning-engine';
import {
  TurnEvent,
  OrchestratorActionDirective,
  OrchestratorContext,
  SpeakerRole
} from './types';

import { turnManager } from './turn-manager';
import { silenceManager } from './silence-manager';
import { interruptionManager } from './interruption-manager';
import { correctionManager } from './correction-manager';
import { pacingManager } from './pacing-manager';
import { speakingRatioManager } from './speaking-ratio-manager';
import { emotionalMonitor } from './emotional-monitor';

export class ConversationOrchestrator {
  /**
   * Initializes or resets the orchestrator for a new lesson session.
   */
  public startSession(lesson: ComposedLesson, studentState: StudentLearningState): void {
    turnManager.reset('teacher');
    speakingRatioManager.reset();
  }

  /**
   * Processes an incoming conversation turn event and returns a comprehensive action directive.
   */
  public processEvent(
    event: TurnEvent,
    context: OrchestratorContext,
    elapsedBlockSeconds: number = 0
  ): OrchestratorActionDirective {
    const { lesson, studentState, activeBlockIndex } = context;
    const currentBlock = lesson.blocks[Math.min(activeBlockIndex, lesson.blocks.length - 1)];

    // 1. Record speech duration if applicable
    if (event.durationSeconds && event.durationSeconds > 0) {
      speakingRatioManager.recordSpeech(
        event.speaker === 'student' ? 'student' : 'teacher',
        event.durationSeconds
      );
    }

    // 2. Update Turn Manager state
    const turnState = turnManager.processTurnEvent(event);

    // 3. Evaluate Interruption if interruption attempt
    if (event.eventType === 'interruption_attempt') {
      const interpEval = interruptionManager.evaluateInterruption(
        event.speaker,
        turnState,
        studentState,
        event.rawTextSample === 'panic'
      );

      if (interpEval.allowed && interpEval.suggestedAction === 'yield_floor_to_student') {
        turnManager.setTurnState('student_speaking', 'student');
      }
    }

    // 4. Evaluate Emotional Signal
    const emotionalSignal = emotionalMonitor.evaluateEmotionalState(studentState, [event]);

    // 5. Evaluate Silence
    const silenceAnalysis = silenceManager.evaluateSilence(
      event.eventType === 'silence_detected' ? (event.durationSeconds || 0) : 0,
      turnState,
      lesson,
      studentState
    );

    // 6. Evaluate Recasting / Correction
    const recastingDirective = correctionManager.evaluateCorrection(
      event.eventType === 'error_detected' ? event : null,
      currentBlock.type,
      lesson,
      studentState
    );

    // 7. Evaluate Speaking Ratio
    const speakingRatio = speakingRatioManager.calculateMetrics(lesson);

    // 8. Evaluate Pacing
    const pacing = pacingManager.evaluatePacing(activeBlockIndex, elapsedBlockSeconds, lesson);

    // 9. Determine floor control & Next Speaker
    let nextSpeaker: SpeakerRole = turnManager.getActiveSpeaker();
    let allowTeacherSpeech = false;
    let waitTimeRemainingSeconds = Math.max(0, silenceAnalysis.thresholdSeconds - silenceAnalysis.durationSeconds);

    if (turnState === 'student_speaking') {
      nextSpeaker = 'student';
      allowTeacherSpeech = false;
    } else if (turnState === 'wait_time_1' || turnState === 'wait_time_2') {
      if (silenceAnalysis.actionRequired === 'pass_turn_to_teacher' || silenceAnalysis.actionRequired === 'provide_scaffolding_hint') {
        nextSpeaker = 'teacher';
        allowTeacherSpeech = true;
      } else {
        nextSpeaker = 'student';
        allowTeacherSpeech = false;
      }
    } else if (turnState === 'teacher_speaking') {
      nextSpeaker = 'teacher';
      allowTeacherSpeech = true;
    }

    // 10. Assemble Action Directive Guidelines
    const guidelines: string[] = [
      ...currentBlock.guidelines,
      `Student Talk Time atual: ${speakingRatio.studentTalkTimeRatio}% (Meta: >60%).`,
      `Tom recomendado: ${emotionalSignal.recommendedTone}.`
    ];

    if (!speakingRatio.isCompliant) {
      guidelines.push('ALERTA DE TALK TIME: Reduzir a extensão da resposta do professor para encorajar a fala do aluno.');
    }

    if (recastingDirective.shouldCorrect) {
      guidelines.push(`RECASTING: ${recastingDirective.rationale}`);
    }

    return {
      actionId: `action_${studentState.studentId}_${Date.now()}`,
      timestampIso: new Date().toISOString(),
      currentTurnState: turnState,
      nextSpeaker,
      allowTeacherSpeech,
      waitTimeRemainingSeconds,
      recastingDirective,
      speakingRatio,
      pacing,
      emotionalSignal,
      guidelinesForNextTurn: guidelines
    };
  }

  /**
   * Exposes sub-managers for direct query access.
   */
  public get subManagers() {
    return {
      turnManager,
      silenceManager,
      interruptionManager,
      correctionManager,
      pacingManager,
      speakingRatioManager,
      emotionalMonitor
    };
  }
}

export const conversationOrchestrator = new ConversationOrchestrator();
