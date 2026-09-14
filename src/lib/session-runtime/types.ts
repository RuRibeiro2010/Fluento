/**
 * FLUENTO SESSION RUNTIME - TYPES & INTERFACES
 * 
 * Defines core lifecycle models, session snapshots, turn execution contracts,
 * event payload definitions, and status enums for managing complete Fluento learning sessions.
 */

import { StudentLearningState, MemoryThreadsContext } from '@/src/lib/learning-engine';
import { ComposedLesson, LessonBlock } from '@/src/lib/lesson-composer';
import { OrchestratorActionDirective, TurnEvent } from '@/src/lib/conversation-orchestrator';
import { AssembledPromptResult } from '@/src/lib/prompt-builder';
import { ModelResponse } from '@/src/lib/ai-runtime';

export type { OrchestratorActionDirective, TurnEvent };

export type SessionStatus = 'created' | 'active' | 'paused' | 'interrupted' | 'completed' | 'failed';

export interface TurnRecord {
  turnId: string;
  turnNumber: number;
  speaker: 'student' | 'teacher';
  text: string;
  timestampIso: string;
  durationSeconds?: number;
  orchestratorDirective?: OrchestratorActionDirective;
  assembledPrompt?: AssembledPromptResult;
  modelResponse?: ModelResponse;
}

export interface SessionSnapshot {
  sessionId: string;
  studentId: string;
  status: SessionStatus;
  startTimeIso: string;
  lastActiveTimeIso: string;
  completedTimeIso?: string;
  activeBlockIndex: number;
  studentState: StudentLearningState;
  memoryThreads: MemoryThreadsContext;
  lesson: ComposedLesson;
  turns: TurnRecord[];
  totalStudentTalkTimeSeconds: number;
  totalTeacherTalkTimeSeconds: number;
  totalSilenceSeconds: number;
  checkpointStateIso: string;
}

export interface ProcessTurnInput {
  sessionId: string;
  studentInputText?: string;
  audioDurationSeconds?: number;
  turnEventType?: TurnEvent['eventType'];
}

export interface ProcessTurnResult {
  sessionId: string;
  turnNumber: number;
  teacherResponseText: string;
  nextTurnState: string;
  directive: OrchestratorActionDirective;
  promptResult: AssembledPromptResult;
  modelResponse: ModelResponse;
  sessionSnapshot: SessionSnapshot;
}

export interface SessionValidationResult {
  isValid: boolean;
  sessionId: string;
  issues: string[];
}
