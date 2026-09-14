/**
 * FLUENTO RUNTIME INTEGRATION LAYER - TYPES & INTERFACES
 * 
 * Defines the strongly-typed data structures for coordinating the complete
 * 12-stage Fluento intelligence and execution pipeline.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { LearningAnalyticsReport } from '@/src/lib/learning-analytics';
import { AdaptiveLearningPlan } from '@/src/lib/adaptive-planner';
import { LessonBlueprint, StudentLearningState } from '@/src/lib/learning-engine';
import { ComposedLesson } from '@/src/lib/lesson-composer';
import { OrchestratorActionDirective } from '@/src/lib/conversation-orchestrator';
import { TeacherDirectives } from '@/src/lib/teacher-runtime';
import { AssembledPromptResult } from '@/src/lib/prompt-builder';
import { ModelResponse } from '@/src/lib/ai-runtime';
import { SessionSnapshot } from '@/src/lib/session-runtime';
import { ThreadSnapshot } from '@/src/lib/learning-threads';
import { MemoryThreadsContext } from '@/src/lib/learning-engine';

export type PipelineStage =
  | 'student_digital_twin'
  | 'learning_analytics'
  | 'adaptive_planner'
  | 'learning_engine'
  | 'lesson_composer'
  | 'conversation_orchestrator'
  | 'teacher_runtime'
  | 'prompt_builder'
  | 'ai_runtime'
  | 'session_runtime'
  | 'learning_threads'
  | 'twin_synchronization';

export type SessionLifecycleState =
  | 'uninitialized'
  | 'twin_loaded'
  | 'analytics_ready'
  | 'plan_ready'
  | 'blueprint_ready'
  | 'lesson_composed'
  | 'conversation_configured'
  | 'teacher_configured'
  | 'prompt_ready'
  | 'ai_executing'
  | 'session_active'
  | 'session_interrupted'
  | 'session_recovering'
  | 'session_completed'
  | 'state_synchronized';

export interface PipelineExecutionOptions {
  studentId: string;
  sessionId?: string;
  userUtterance?: string;
  simulateAiFailure?: boolean;
  simulateNetworkInterruption?: boolean;
  timeoutMs?: number;
}

export interface PipelineExecutionResult {
  sessionId: string;
  studentId: string;
  lifecycleState: SessionLifecycleState;
  twinState: StudentDigitalTwinState;
  analyticsReport?: LearningAnalyticsReport;
  adaptivePlan?: AdaptiveLearningPlan;
  blueprint?: LessonBlueprint;
  composedLesson?: ComposedLesson;
  orchestratorDirective?: OrchestratorActionDirective;
  teacherDirectives?: TeacherDirectives;
  assembledPrompt?: AssembledPromptResult;
  aiResponse?: ModelResponse;
  sessionSnapshot?: SessionSnapshot;
  threadsSnapshot?: ThreadSnapshot;
  syncedTwinState?: StudentDigitalTwinState;
  stageTimingMs: Record<PipelineStage, number>;
  totalExecutionTimeMs: number;
  status: 'success' | 'recovered' | 'interrupted' | 'failed';
  recoveryAttemptsCount: number;
  errors: string[];
}

export interface PipelineTelemetryEvent {
  eventId: string;
  sessionId: string;
  studentId: string;
  timestampIso: string;
  stage?: PipelineStage;
  durationMs?: number;
  status: 'started' | 'stage_completed' | 'recovered' | 'completed' | 'failed';
  errorMessage?: string;
  details?: string;
}

export interface CheckpointData {
  sessionId: string;
  studentId: string;
  savedAtIso: string;
  lifecycleState: SessionLifecycleState;
  result: Partial<PipelineExecutionResult>;
}

export interface ContractValidationResult {
  isValid: boolean;
  stage: PipelineStage;
  missingKeys: string[];
  issues: string[];
}
