/**
 * FLUENTO SESSION RUNTIME - MAIN ENGINE FACADE
 * 
 * Central coordinator for executing complete Fluento learning sessions.
 * Integrates:
 * - Learning Engine (Student State & Memory Threads)
 * - Lesson Composer (Lesson Structure)
 * - Conversation Orchestrator (Turn Rules & Directives)
 * - Prompt Builder (LLM Context Format)
 * - AI Runtime (Model Execution & Resilience)
 * 
 * STRICT MANDATES:
 * - NO pedagogical decision logic.
 * - NO prompt generation logic.
 * - NO direct UI coupling or rendered markup.
 * - Purely coordinates execution lifecycle, events, checkpoints, and recovery.
 */

import { StudentLearningState, MemoryThreadsContext } from '@/src/lib/learning-engine';
import { ComposedLesson } from '@/src/lib/lesson-composer';
import { TurnEvent } from '@/src/lib/conversation-orchestrator';
import { SessionSnapshot, ProcessTurnResult, ProcessTurnInput } from './types';
import { sessionManager } from './session-manager';
import { turnExecutor } from './turn-executor';
import { lessonExecutor } from './lesson-executor';
import { sessionStateManager } from './session-state';
import { sessionEventEmitter } from './session-events';
import { sessionTelemetry } from './telemetry';

export class SessionRuntime {
  /**
   * Initializes a new session.
   */
  public async initializeSession(
    studentState: StudentLearningState,
    memoryThreads: MemoryThreadsContext,
    lesson?: ComposedLesson
  ): Promise<SessionSnapshot> {
    return sessionManager.createSession(studentState, memoryThreads, lesson);
  }

  /**
   * Starts or activates a session.
   */
  public startSession(sessionId: string): SessionSnapshot {
    return sessionManager.startSession(sessionId);
  }

  /**
   * Processes a turn input from the student or silence trigger.
   */
  public async processTurn(input: ProcessTurnInput): Promise<ProcessTurnResult> {
    const snapshot = sessionStateManager.getSession(input.sessionId);
    if (!snapshot) {
      throw new Error(`Session ${input.sessionId} not found in SessionStateManager`);
    }

    if (snapshot.status !== 'active') {
      // Auto-start or resume if paused/created
      sessionManager.startSession(input.sessionId);
    }

    try {
      sessionEventEmitter.emit({
        sessionId: input.sessionId,
        eventType: 'turn_started',
        snapshot
      });

      // 1. Execute Turn Cycle
      const turnResult = await turnExecutor.executeTurn(
        snapshot,
        input.studentInputText,
        input.audioDurationSeconds || 0,
        input.turnEventType || 'speech_ended'
      );

      // 2. Evaluate Block Advancement
      const blockNav = lessonExecutor.evaluateBlockAdvancement(snapshot);
      if (blockNav.isLessonCompleted) {
        sessionManager.completeSession(input.sessionId);
      }

      // 3. Persist Updated Snapshot
      sessionStateManager.updateSession(snapshot);

      const turnCompletedEvent = sessionEventEmitter.emit({
        sessionId: input.sessionId,
        eventType: 'turn_completed',
        snapshot,
        turn: snapshot.turns[snapshot.turns.length - 1]
      });
      sessionTelemetry.recordEvent(turnCompletedEvent);

      return turnResult;
    } catch (err: any) {
      sessionEventEmitter.emit({
        sessionId: input.sessionId,
        eventType: 'error_occurred',
        snapshot,
        errorMessage: err.message || String(err)
      });
      throw err;
    }
  }

  /**
   * Pauses an active session.
   */
  public pauseSession(sessionId: string): SessionSnapshot {
    return sessionManager.pauseSession(sessionId);
  }

  /**
   * Resumes an interrupted or paused session.
   */
  public resumeSession(sessionId: string): SessionSnapshot {
    return sessionManager.resumeSession(sessionId);
  }

  /**
   * Completes a session.
   */
  public completeSession(sessionId: string): SessionSnapshot {
    return sessionManager.completeSession(sessionId);
  }

  /**
   * Gets current snapshot for a session.
   */
  public getSessionSnapshot(sessionId: string): SessionSnapshot | undefined {
    return sessionStateManager.getSession(sessionId);
  }
}

export const sessionRuntime = new SessionRuntime();
