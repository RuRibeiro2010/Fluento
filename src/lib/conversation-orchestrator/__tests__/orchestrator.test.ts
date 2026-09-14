/**
 * FLUENTO CONVERSATION ORCHESTRATOR - UNIT TESTS & VALIDATION
 * 
 * Comprehensive tests for the Conversation Orchestrator and its sub-managers.
 */

import { conversationOrchestrator } from '../conversation-orchestrator';
import { silenceManager } from '../silence-manager';
import { interruptionManager } from '../interruption-manager';
import { correctionManager } from '../correction-manager';
import { speakingRatioManager } from '../speaking-ratio-manager';
import { emotionalMonitor } from '../emotional-monitor';
import { pacingManager } from '../pacing-manager';
import { mockComposedLesson, mockStudentStateNormal, mockStudentStateHighAnxiety } from '../fixtures';
import { TurnEvent, OrchestratorContext } from '../types';

export function runOrchestratorTestSuite() {
  const results: { testName: string; passed: boolean; message: string }[] = [];

  function assert(condition: boolean, testName: string, message: string) {
    results.push({
      testName,
      passed: condition,
      message: condition ? 'PASSED' : `FAILED: ${message}`
    });
  }

  // -------------------------------------------------------------
  // Test 1: Silence Manager (Wait Time 1 & Wait Time 2)
  // -------------------------------------------------------------
  const wt1Analysis = silenceManager.evaluateSilence(2.0, 'wait_time_1', mockComposedLesson, mockStudentStateNormal);
  assert(
    wt1Analysis.actionRequired === 'continue_waiting',
    'SilenceManager - Wait Time 1 Active',
    'Should continue waiting when silence is less than threshold'
  );

  const wt1Exceeded = silenceManager.evaluateSilence(9.0, 'wait_time_1', mockComposedLesson, mockStudentStateNormal);
  assert(
    wt1Exceeded.actionRequired === 'provide_scaffolding_hint',
    'SilenceManager - Wait Time 1 Exceeded',
    'Should provide scaffolding hint when silence exceeds comfort threshold'
  );

  const wt2Fulfilled = silenceManager.evaluateSilence(4.5, 'wait_time_2', mockComposedLesson, mockStudentStateNormal);
  assert(
    wt2Fulfilled.actionRequired === 'pass_turn_to_teacher',
    'SilenceManager - Wait Time 2 Fulfilled',
    'Should pass turn to teacher when Wait Time 2 is fulfilled'
  );

  // -------------------------------------------------------------
  // Test 2: Interruption Manager Rules
  // -------------------------------------------------------------
  const studentInterruptsTeacher = interruptionManager.evaluateInterruption(
    'student',
    'teacher_speaking',
    mockStudentStateNormal
  );
  assert(
    studentInterruptsTeacher.allowed === true && studentInterruptsTeacher.suggestedAction === 'yield_floor_to_student',
    'InterruptionManager - Student Priority',
    'Student interrupting teacher MUST always be allowed and yield floor'
  );

  const teacherInterruptsStudent = interruptionManager.evaluateInterruption(
    'teacher',
    'student_speaking',
    mockStudentStateNormal
  );
  assert(
    teacherInterruptsStudent.allowed === false,
    'InterruptionManager - Teacher Interruption Prohibited',
    'Teacher interrupting student MUST be prohibited'
  );

  // -------------------------------------------------------------
  // Test 3: Speaking Ratio Manager (STT > 60%)
  // -------------------------------------------------------------
  speakingRatioManager.reset();
  speakingRatioManager.recordSpeech('student', 70);
  speakingRatioManager.recordSpeech('teacher', 30);
  const ratioMetrics = speakingRatioManager.calculateMetrics(mockComposedLesson);

  assert(
    ratioMetrics.studentTalkTimeRatio === 70 && ratioMetrics.isCompliant === true,
    'SpeakingRatioManager - STT Compliance',
    'STT > 60% should be compliant'
  );

  // -------------------------------------------------------------
  // Test 4: Correction Manager & Recasting Policy
  // -------------------------------------------------------------
  const errorInWarmup = correctionManager.evaluateCorrection(
    {
      eventId: 'ev_err_1',
      timestampIso: new Date().toISOString(),
      speaker: 'student',
      eventType: 'error_detected',
      detectedErrorCategory: 'grammar',
      rawTextSample: 'I goes to work yesterday'
    },
    'warmup',
    mockComposedLesson,
    mockStudentStateNormal
  );
  assert(
    errorInWarmup.shouldCorrect === false && errorInWarmup.correctionType === 'suppress',
    'CorrectionManager - Warmup Suppression',
    'Errors in warmup block MUST be suppressed'
  );

  const errorInHighAnxiety = correctionManager.evaluateCorrection(
    {
      eventId: 'ev_err_2',
      timestampIso: new Date().toISOString(),
      speaker: 'student',
      eventType: 'error_detected',
      detectedErrorCategory: 'grammar',
      rawTextSample: 'He do not like coffee'
    },
    'conversation',
    mockComposedLesson,
    mockStudentStateHighAnxiety
  );
  assert(
    errorInHighAnxiety.shouldCorrect === false,
    'CorrectionManager - High Anxiety Suppression',
    'Errors during high anxiety MUST be suppressed to protect affective filter'
  );

  const errorInConversation = correctionManager.evaluateCorrection(
    {
      eventId: 'ev_err_3',
      timestampIso: new Date().toISOString(),
      speaker: 'student',
      eventType: 'error_detected',
      detectedErrorCategory: 'grammar',
      rawTextSample: 'She go to store'
    },
    'conversation',
    mockComposedLesson,
    mockStudentStateNormal
  );
  assert(
    errorInConversation.shouldCorrect === true && errorInConversation.correctionType === 'involuntary_echo',
    'CorrectionManager - Involuntary Recasting',
    'Errors in conversation should trigger natural involuntary recasting'
  );

  // -------------------------------------------------------------
  // Test 5: Emotional Monitor
  // -------------------------------------------------------------
  const emotionalPanic = emotionalMonitor.evaluateEmotionalState(mockStudentStateHighAnxiety, [
    {
      eventId: 'ev_panic',
      timestampIso: new Date().toISOString(),
      speaker: 'student',
      eventType: 'emotion_signal',
      rawTextSample: 'panic'
    }
  ]);
  assert(
    emotionalPanic.affectiveFilterState === 'panic' && emotionalPanic.recommendedTone === 'gentle_recovery',
    'EmotionalMonitor - Panic De-escalation',
    'Panic signals should switch tone to gentle_recovery and increase wait time'
  );

  // -------------------------------------------------------------
  // Test 6: Pacing Manager
  // -------------------------------------------------------------
  const pacingState = pacingManager.evaluatePacing(1, 450, mockComposedLesson); // 450s = 7.5 mins in a 7 min block
  assert(
    pacingState.recommendedPacingAction === 'wrap_up_block' || pacingState.recommendedPacingAction === 'advance_to_next_block',
    'PacingManager - Block Wrap Up',
    'Should recommend wrap up or advance when block time is exceeded'
  );

  // -------------------------------------------------------------
  // Test 7: Full Conversation Orchestrator Integration
  // -------------------------------------------------------------
  conversationOrchestrator.startSession(mockComposedLesson, mockStudentStateNormal);
  const context: OrchestratorContext = {
    lesson: mockComposedLesson,
    studentState: mockStudentStateNormal,
    activeBlockIndex: 1
  };

  const turnEvent: TurnEvent = {
    eventId: 'ev_speech_end',
    timestampIso: new Date().toISOString(),
    speaker: 'student',
    eventType: 'speech_ended',
    durationSeconds: 12
  };

  const directive = conversationOrchestrator.processEvent(turnEvent, context, 120);
  assert(
    directive.currentTurnState === 'wait_time_2' && directive.guidelinesForNextTurn.length > 0,
    'ConversationOrchestrator - Full Flow Integration',
    'Should produce a valid OrchestratorActionDirective with active guidelines'
  );

  return results;
}
