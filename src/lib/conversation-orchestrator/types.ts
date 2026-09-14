/**
 * FLUENTO CONVERSATION ORCHESTRATOR - TYPES & INTERFACES
 * 
 * Defines data structures and event types for real-time conversation control.
 * Strictly implements parameters defined in FLUENTO_PLAYBOOK.md,
 * TEACHER_GUIDELINES.md, and FLUENTO_LEARNING_ENGINE.md.
 */

import { ComposedLesson, LessonBlock } from '@/src/lib/lesson-composer';
import { StudentLearningState, TeachingStrategy } from '@/src/lib/learning-engine';

export type SpeakerRole = 'student' | 'teacher' | 'system';

export type TurnState = 
  | 'idle'
  | 'teacher_speaking'
  | 'student_speaking'
  | 'wait_time_1' // Post-question silence (waiting for student to begin)
  | 'wait_time_2' // Post-response silence (waiting to see if student elaborates)
  | 'interruption_evaluated'
  | 'transitioning';

export interface TurnEvent {
  eventId: string;
  timestampIso: string;
  speaker: SpeakerRole;
  eventType: 'speech_started' | 'speech_ended' | 'silence_detected' | 'interruption_attempt' | 'emotion_signal' | 'error_detected';
  durationSeconds?: number;
  utteranceLengthWords?: number;
  hesitationCount?: number;
  detectedErrorCategory?: 'grammar' | 'vocabulary' | 'pronunciation';
  errorSeverity?: 'low' | 'medium' | 'high';
  rawTextSample?: string;
}

export interface SilenceAnalysis {
  silenceType: 'wait_time_1' | 'wait_time_2' | 'hesitation_pause' | 'awkward_silence';
  durationSeconds: number;
  thresholdSeconds: number;
  actionRequired: 'continue_waiting' | 'provide_gentle_prompt' | 'provide_scaffolding_hint' | 'pass_turn_to_teacher';
  rationale: string;
}

export interface InterruptionEvaluation {
  isInterruptionAttempt: boolean;
  attemptedBy: SpeakerRole;
  allowed: boolean;
  reason: string;
  suggestedAction: 'ignore' | 'yield_floor_to_student' | 'pause_teacher' | 'emergency_deescalation';
}

export interface RecastingDirective {
  shouldCorrect: boolean;
  recastingMode: TeachingStrategy['recastingMode'];
  correctionType: 'involuntary_echo' | 'end_of_turn_rephrase' | 'defer_to_reflection' | 'suppress';
  originalPhrase?: string;
  targetFocus?: string;
  rationale: string;
}

export interface SpeakingRatioMetrics {
  totalSessionSeconds: number;
  studentTalkSeconds: number;
  teacherTalkSeconds: number;
  silenceSeconds: number;
  studentTalkTimeRatio: number; // Percentage (e.g. 68.5%)
  teacherTalkTimeRatio: number; // Percentage
  targetStudentRatio: number; // Min e.g. 60-75%
  isCompliant: boolean;
  recommendation: 'encourage_student' | 'shorten_teacher_turns' | 'maintain_equilibrium';
}

export interface PacingState {
  currentBlockIndex: number;
  currentBlock: LessonBlock;
  elapsedBlockSeconds: number;
  allocatedBlockSeconds: number;
  isBlockOverdue: boolean;
  recommendedPacingAction: 'maintain_cadence' | 'wrap_up_block' | 'advance_to_next_block' | 'extend_block';
}

export interface EmotionalSignal {
  anxietyLevel: number; // 0 - 100
  fatigueScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  affectiveFilterState: 'relaxed' | 'optimal' | 'heightened' | 'panic';
  recommendedTone: TeachingStrategy['tone'];
  recommendedWaitTimeDeltaSeconds: number;
}

export interface OrchestratorActionDirective {
  actionId: string;
  timestampIso: string;
  currentTurnState: TurnState;
  nextSpeaker: SpeakerRole;
  allowTeacherSpeech: boolean;
  waitTimeRemainingSeconds: number;
  recastingDirective: RecastingDirective;
  speakingRatio: SpeakingRatioMetrics;
  pacing: PacingState;
  emotionalSignal: EmotionalSignal;
  guidelinesForNextTurn: string[];
}

export interface OrchestratorContext {
  lesson: ComposedLesson;
  studentState: StudentLearningState;
  activeBlockIndex: number;
}
