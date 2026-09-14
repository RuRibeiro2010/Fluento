/**
 * FLUENTO SESSION RUNTIME - SESSION MANAGER
 * 
 * Manages initial session creation, loading student learning state and memory threads from Learning Engine,
 * generating composed lessons via Lesson Composer, initializing Conversation Orchestrator,
 * and handling pause/resume/recovery flows.
 */

import { StudentLearningState, MemoryThreadsContext, learningEngine } from '@/src/lib/learning-engine';
import { ComposedLesson, lessonComposer } from '@/src/lib/lesson-composer';
import { conversationOrchestrator } from '@/src/lib/conversation-orchestrator';
import { SessionSnapshot, SessionStatus } from './types';
import { sessionStateManager } from './session-state';
import { sessionValidator } from './session-validator';
import { sessionEventEmitter } from './session-events';
import { sessionTelemetry } from './telemetry';

export class SessionManager {
  /**
   * Initializes a brand new Fluento learning session for a student.
   */
  public async createSession(
    studentState: StudentLearningState,
    memoryThreads: MemoryThreadsContext,
    customLesson?: ComposedLesson
  ): Promise<SessionSnapshot> {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // 1. Compose lesson if not provided
    const { blueprint } = learningEngine.prepareSession({
      studentState,
      memoryThreads,
      userRequestedMode: 'auto'
    });
    const lesson = customLesson || lessonComposer.composeLesson(blueprint);

    // 2. Start Conversation Orchestrator session
    conversationOrchestrator.startSession(lesson, studentState);

    // 3. Assemble initial SessionSnapshot
    const nowIso = new Date().toISOString();
    const snapshot: SessionSnapshot = {
      sessionId,
      studentId: studentState.studentId,
      status: 'created',
      startTimeIso: nowIso,
      lastActiveTimeIso: nowIso,
      activeBlockIndex: 0,
      studentState,
      memoryThreads,
      lesson,
      turns: [],
      totalStudentTalkTimeSeconds: 0,
      totalTeacherTalkTimeSeconds: 0,
      totalSilenceSeconds: 0,
      checkpointStateIso: nowIso
    };

    // 4. Validate
    const val = sessionValidator.validateSession(snapshot);
    if (!val.isValid) {
      throw new Error(`Invalid session configuration: ${val.issues.join('; ')}`);
    }

    sessionStateManager.createSession(snapshot);

    const event = sessionEventEmitter.emit({
      sessionId,
      eventType: 'session_created',
      snapshot
    });
    sessionTelemetry.recordEvent(event);

    return snapshot;
  }

  /**
   * Starts an existing session.
   */
  public startSession(sessionId: string): SessionSnapshot {
    const updated = sessionStateManager.setSessionStatus(sessionId, 'active');

    const event = sessionEventEmitter.emit({
      sessionId,
      eventType: 'session_started',
      snapshot: updated
    });
    sessionTelemetry.recordEvent(event);

    return updated;
  }

  /**
   * Pauses an active session.
   */
  public pauseSession(sessionId: string): SessionSnapshot {
    const updated = sessionStateManager.setSessionStatus(sessionId, 'paused');

    const event = sessionEventEmitter.emit({
      sessionId,
      eventType: 'session_paused',
      snapshot: updated
    });
    sessionTelemetry.recordEvent(event);

    return updated;
  }

  /**
   * Resumes a paused or interrupted session.
   */
  public resumeSession(sessionId: string): SessionSnapshot {
    const updated = sessionStateManager.resumeSession(sessionId);

    const event = sessionEventEmitter.emit({
      sessionId,
      eventType: 'session_resumed',
      snapshot: updated
    });
    sessionTelemetry.recordEvent(event);

    return updated;
  }

  /**
   * Completes a session successfully.
   */
  public completeSession(sessionId: string): SessionSnapshot {
    const updated = sessionStateManager.setSessionStatus(sessionId, 'completed');

    const event = sessionEventEmitter.emit({
      sessionId,
      eventType: 'session_completed',
      snapshot: updated
    });
    sessionTelemetry.recordEvent(event);

    return updated;
  }
}

export const sessionManager = new SessionManager();
