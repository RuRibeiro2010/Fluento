/**
 * FLUENTO SESSION RUNTIME - UNIT TESTS
 * 
 * Comprehensive test suite verifying session lifecycle, turn execution,
 * event emission, memory/progress synchronization, and error recovery.
 */

import { sessionRuntime } from '../session-runtime';
import { sessionStateManager } from '../session-state';
import { sessionValidator } from '../session-validator';
import { sessionEventEmitter } from '../session-events';
import { mockStudentStateNormal, mockComposedLesson } from '@/src/lib/conversation-orchestrator/fixtures';
import { mockMemoryThreads } from '@/src/lib/prompt-builder/fixtures';

export async function runSessionRuntimeTestSuite() {
  const results: { testName: string; passed: boolean; message: string }[] = [];

  function assert(condition: boolean, testName: string, message: string) {
    results.push({
      testName,
      passed: condition,
      message: condition ? 'PASSED' : `FAILED: ${message}`
    });
  }

  // 1. Initialize Session
  const snapshot = await sessionRuntime.initializeSession(
    mockStudentStateNormal,
    mockMemoryThreads,
    mockComposedLesson
  );

  assert(
    snapshot.sessionId.startsWith('sess_') && snapshot.status === 'created',
    'SessionRuntime - Initialization',
    'Session should initialize with status "created" and valid snapshot'
  );

  // 2. Validate Snapshot
  const val = sessionValidator.validateSession(snapshot);
  assert(
    val.isValid,
    'SessionValidator - Integrity Check',
    'Session snapshot must pass structural validation'
  );

  // 3. Start Session & Event Listener
  let eventReceived: boolean = false;
  const unsubscribe = sessionEventEmitter.subscribe((evt) => {
    if (evt.sessionId === snapshot.sessionId && evt.eventType === 'session_started') {
      eventReceived = true;
    }
  });

  sessionRuntime.startSession(snapshot.sessionId);
  assert(
    Boolean(eventReceived) && snapshot.status === 'active',
    'SessionRuntime - Session Start & Event Emission',
    'Should transition to "active" status and emit session_started event'
  );
  unsubscribe();

  // 4. Process Turn Cycle
  const turnResult = await sessionRuntime.processTurn({
    sessionId: snapshot.sessionId,
    studentInputText: 'I went to the store yesterday and bought some apples.',
    audioDurationSeconds: 8
  });

  assert(
    turnResult.teacherResponseText.length > 0 && turnResult.turnNumber >= 2,
    'SessionRuntime - Process Turn Execution',
    'Should execute complete turn cycle, generating teacher response and updating turn history'
  );

  // 5. Check Pause & Resume Recovery
  sessionRuntime.pauseSession(snapshot.sessionId);
  assert(
    snapshot.status === 'paused',
    'SessionRuntime - Pause Session',
    'Session status should transition to "paused"'
  );

  sessionRuntime.resumeSession(snapshot.sessionId);
  assert(
    snapshot.status === 'active',
    'SessionRuntime - Resume Session Recovery',
    'Interrupted or paused session should successfully resume to "active"'
  );

  // 6. Complete Session
  const completedSnapshot = sessionRuntime.completeSession(snapshot.sessionId);
  assert(
    completedSnapshot.status === 'completed' && !!completedSnapshot.completedTimeIso,
    'SessionRuntime - Session Completion',
    'Session should complete with timestamp'
  );

  return results;
}
