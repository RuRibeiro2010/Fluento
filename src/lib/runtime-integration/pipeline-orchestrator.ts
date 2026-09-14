/**
 * FLUENTO RUNTIME INTEGRATION - PIPELINE ORCHESTRATOR
 * 
 * Executes the official 12-step Fluento intelligence & execution pipeline:
 * 
 * 1. Student Digital Twin
 *        ↓
 * 2. Learning Analytics Engine
 *        ↓
 * 3. Adaptive Learning Planner
 *        ↓
 * 4. Learning Engine
 *        ↓
 * 5. Lesson Composer
 *        ↓
 * 6. Conversation Orchestrator
 *        ↓
 * 7. Teacher Runtime
 *        ↓
 * 8. Prompt Builder
 *        ↓
 * 9. AI Runtime
 *        ↓
 * 10. Session Runtime
 *        ↓
 * 11. Learning Threads Runtime
 *        ↓
 * 12. Student Digital Twin (State Synchronization)
 * 
 * STRICT MANDATES:
 * - NO pedagogical decision logic (delegated to modules).
 * - NO prompt generation logic (delegated to Prompt Builder).
 * - NO direct UI coupling.
 * - Deterministic timing, contract validation, and error recovery at every stage.
 */

import { studentDigitalTwin } from '@/src/lib/student-digital-twin';
import { learningAnalyticsEngine } from '@/src/lib/learning-analytics';
import { adaptivePlanner } from '@/src/lib/adaptive-planner';
import { learningEngine, StudentLearningState } from '@/src/lib/learning-engine';
import { lessonComposer } from '@/src/lib/lesson-composer';
import { conversationOrchestrator, TurnEvent } from '@/src/lib/conversation-orchestrator';
import { teacherRuntime } from '@/src/lib/teacher-runtime';
import { promptBuilder } from '@/src/lib/prompt-builder';
import { aiRuntime } from '@/src/lib/ai-runtime';
import { sessionRuntime } from '@/src/lib/session-runtime';
import { learningThreadsRuntime } from '@/src/lib/learning-threads';

import { PipelineExecutionOptions, PipelineExecutionResult, PipelineStage, SessionLifecycleState } from './types';
import { dependencyResolver } from './dependency-resolver';
import { pipelineContractsManager } from './contracts';
import { stateSynchronizer } from './state-synchronizer';
import { lifecycleManager } from './lifecycle-manager';
import { errorRecoveryEngine } from './error-recovery';
import { runtimeIntegrationTelemetry } from './telemetry';

export class PipelineOrchestrator {
  /**
   * Executes the full 12-step pipeline sequentially with stage contract verification and error recovery.
   */
  public async executePipeline(options: PipelineExecutionOptions): Promise<PipelineExecutionResult> {
    const startTimeTotal = Date.now();
    const studentId = options.studentId;
    const sessionId = options.sessionId || `sess_pipe_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const userUtterance = options.userUtterance || 'Olá, estou pronto para praticar!';

    // 0. Verify module dependencies
    const depCheck = dependencyResolver.resolveDependencies();
    if (!depCheck.allResolved) {
      throw new Error(`Pipeline execution blocked. Missing dependencies: ${depCheck.missingDependencies.join(', ')}`);
    }

    const timingMs: Record<PipelineStage, number> = {
      student_digital_twin: 0,
      learning_analytics: 0,
      adaptive_planner: 0,
      learning_engine: 0,
      lesson_composer: 0,
      conversation_orchestrator: 0,
      teacher_runtime: 0,
      prompt_builder: 0,
      ai_runtime: 0,
      session_runtime: 0,
      learning_threads: 0,
      twin_synchronization: 0
    };

    const errors: string[] = [];
    let recoveryAttemptsCount = 0;
    let status: 'success' | 'recovered' | 'interrupted' | 'failed' = 'success';
    let currentState: SessionLifecycleState = 'uninitialized';

    const result: Partial<PipelineExecutionResult> = {
      sessionId,
      studentId,
      stageTimingMs: timingMs,
      recoveryAttemptsCount: 0,
      errors
    };

    try {
      // ----------------------------------------------------
      // STAGE 1: Student Digital Twin
      // ----------------------------------------------------
      let stgStart = Date.now();
      result.twinState = studentDigitalTwin.getOrCreateTwin(studentId);
      timingMs.student_digital_twin = Date.now() - stgStart;
      currentState = 'twin_loaded';
      this.recordAndValidate('student_digital_twin', result, timingMs.student_digital_twin, sessionId, studentId);
      lifecycleManager.saveCheckpoint(sessionId, studentId, currentState, result);

      // ----------------------------------------------------
      // STAGE 2: Learning Analytics Engine
      // ----------------------------------------------------
      stgStart = Date.now();
      result.analyticsReport = learningAnalyticsEngine.generateReport(studentId);
      timingMs.learning_analytics = Date.now() - stgStart;
      currentState = 'analytics_ready';
      this.recordAndValidate('learning_analytics', result, timingMs.learning_analytics, sessionId, studentId);
      lifecycleManager.saveCheckpoint(sessionId, studentId, currentState, result);

      // ----------------------------------------------------
      // STAGE 3: Adaptive Learning Planner
      // ----------------------------------------------------
      stgStart = Date.now();
      result.adaptivePlan = adaptivePlanner.generatePlan(studentId);
      timingMs.adaptive_planner = Date.now() - stgStart;
      currentState = 'plan_ready';
      this.recordAndValidate('adaptive_planner', result, timingMs.adaptive_planner, sessionId, studentId);
      lifecycleManager.saveCheckpoint(sessionId, studentId, currentState, result);

      // Map Digital Twin & Analytics to StudentLearningState for Learning Engine
      const studentState: StudentLearningState = {
        studentId,
        currentCefr: result.twinState.language.currentCefr,
        targetCefr: result.twinState.language.targetCefr,
        framework: 'CEFR',
        frameworkLevel: {
          framework: 'CEFR',
          levelCode: result.twinState.language.currentCefr,
          equivalentCefr: result.twinState.language.currentCefr,
          title: `Nível ${result.twinState.language.currentCefr}`,
          description: `Qualificação ${result.twinState.language.currentCefr}`
        },
        energyLevel: 8,
        motivationLevel: 8,
        speakingAnxietyLevel: result.analyticsReport.anxietyTrend.currentAnxietyLevel,
        confidenceScores: result.twinState.emotional.confidenceScores,
        fatigueScore: 20,
        availableMinutes: 15,
        daysSinceLastSession: 1,
        primaryGoal: result.twinState.goal.primaryMotivation
      };

      // Fetch memory context
      const memoryThreads = learningThreadsRuntime.exportToMemoryThreadsContext(studentId);

      // ----------------------------------------------------
      // STAGE 4: Learning Engine
      // ----------------------------------------------------
      stgStart = Date.now();
      const prepRes = learningEngine.prepareSession({
        studentState,
        memoryThreads
      });
      result.blueprint = prepRes.blueprint;
      timingMs.learning_engine = Date.now() - stgStart;
      currentState = 'blueprint_ready';
      this.recordAndValidate('learning_engine', result, timingMs.learning_engine, sessionId, studentId);
      lifecycleManager.saveCheckpoint(sessionId, studentId, currentState, result);

      // ----------------------------------------------------
      // STAGE 5: Lesson Composer
      // ----------------------------------------------------
      stgStart = Date.now();
      result.composedLesson = lessonComposer.composeLesson(result.blueprint);
      timingMs.lesson_composer = Date.now() - stgStart;
      currentState = 'lesson_composed';
      this.recordAndValidate('lesson_composer', result, timingMs.lesson_composer, sessionId, studentId);
      lifecycleManager.saveCheckpoint(sessionId, studentId, currentState, result);

      // ----------------------------------------------------
      // STAGE 6: Conversation Orchestrator
      // ----------------------------------------------------
      stgStart = Date.now();
      const turnEvent: TurnEvent = {
        eventId: `evt_pipe_${Date.now()}`,
        speaker: 'student',
        eventType: 'speech_ended',
        timestampIso: new Date().toISOString(),
        durationSeconds: 4,
        rawTextSample: userUtterance
      };

      conversationOrchestrator.startSession(result.composedLesson, studentState);
      result.orchestratorDirective = conversationOrchestrator.processEvent(
        turnEvent,
        {
          lesson: result.composedLesson,
          studentState,
          activeBlockIndex: 0
        },
        30
      );
      timingMs.conversation_orchestrator = Date.now() - stgStart;
      currentState = 'conversation_configured';
      this.recordAndValidate('conversation_orchestrator', result, timingMs.conversation_orchestrator, sessionId, studentId);
      lifecycleManager.saveCheckpoint(sessionId, studentId, currentState, result);

      // ----------------------------------------------------
      // STAGE 7: Teacher Runtime
      // ----------------------------------------------------
      stgStart = Date.now();
      result.teacherDirectives = teacherRuntime.generateDirectives({
        studentState,
        orchestratorDirective: result.orchestratorDirective
      });
      timingMs.teacher_runtime = Date.now() - stgStart;
      currentState = 'teacher_configured';
      this.recordAndValidate('teacher_runtime', result, timingMs.teacher_runtime, sessionId, studentId);
      lifecycleManager.saveCheckpoint(sessionId, studentId, currentState, result);

      // ----------------------------------------------------
      // STAGE 8: Prompt Builder
      // ----------------------------------------------------
      stgStart = Date.now();
      result.assembledPrompt = promptBuilder.buildPrompt({
        studentState,
        memoryThreads,
        lesson: result.composedLesson,
        activeBlockIndex: 0,
        orchestratorDirective: result.orchestratorDirective
      });
      timingMs.prompt_builder = Date.now() - stgStart;
      currentState = 'prompt_ready';
      this.recordAndValidate('prompt_builder', result, timingMs.prompt_builder, sessionId, studentId);
      lifecycleManager.saveCheckpoint(sessionId, studentId, currentState, result);

      // ----------------------------------------------------
      // STAGE 9: AI Runtime (with Failure Simulation & Error Recovery)
      // ----------------------------------------------------
      stgStart = Date.now();
      currentState = 'ai_executing';

      if (options.simulateAiFailure) {
        recoveryAttemptsCount++;
        status = 'recovered';
        errors.push('Simulated AI Runtime provider failure. Triggering recovery fallback.');
        result.aiResponse = errorRecoveryEngine.recoverAiFailure(
          studentId,
          sessionId,
          new Error('Simulated AI Provider Failure')
        );
      } else {
        try {
          result.aiResponse = await aiRuntime.execute({
            prompt: result.assembledPrompt.systemPrompt,
            studentId,
            sessionId,
            timeoutMs: options.timeoutMs || 10000
          });
        } catch (err: any) {
          recoveryAttemptsCount++;
          status = 'recovered';
          errors.push(`AI Runtime error (${err.message}). Recovered using pedagogical fallback.`);
          result.aiResponse = errorRecoveryEngine.recoverAiFailure(studentId, sessionId, err);
        }
      }

      timingMs.ai_runtime = Date.now() - stgStart;
      this.recordAndValidate('ai_runtime', result, timingMs.ai_runtime, sessionId, studentId);
      lifecycleManager.saveCheckpoint(sessionId, studentId, currentState, result);

      // ----------------------------------------------------
      // STAGE 10: Session Runtime
      // ----------------------------------------------------
      stgStart = Date.now();
      result.sessionSnapshot = await sessionRuntime.initializeSession(
        studentState,
        memoryThreads,
        result.composedLesson
      );
      sessionRuntime.startSession(result.sessionSnapshot.sessionId);

      timingMs.session_runtime = Date.now() - stgStart;
      currentState = 'session_active';
      this.recordAndValidate('session_runtime', result, timingMs.session_runtime, sessionId, studentId);
      lifecycleManager.saveCheckpoint(sessionId, studentId, currentState, result);

      // ----------------------------------------------------
      // STAGE 11: Learning Threads Runtime
      // ----------------------------------------------------
      stgStart = Date.now();
      // Record session observation in learning threads
      learningThreadsRuntime.ingestNote(
        studentId,
        sessionId,
        `Sessão de prática concluída com foco em: ${result.adaptivePlan.primaryObjective}`
      );
      result.threadsSnapshot = learningThreadsRuntime.getSnapshot(studentId);

      timingMs.learning_threads = Date.now() - stgStart;
      this.recordAndValidate('learning_threads', result, timingMs.learning_threads, sessionId, studentId);
      lifecycleManager.saveCheckpoint(sessionId, studentId, currentState, result);

      // ----------------------------------------------------
      // STAGE 12: Student Digital Twin Synchronization
      // ----------------------------------------------------
      stgStart = Date.now();
      result.syncedTwinState = stateSynchronizer.synchronizeStudentState(
        studentId,
        result.sessionSnapshot,
        result.threadsSnapshot
      );

      timingMs.twin_synchronization = Date.now() - stgStart;
      currentState = 'state_synchronized';
      this.recordAndValidate('twin_synchronization', result, timingMs.twin_synchronization, sessionId, studentId);

      // Complete session
      sessionRuntime.completeSession(result.sessionSnapshot.sessionId);
      if (status === 'success') {
        currentState = 'session_completed';
      }

      const totalExecutionTimeMs = Date.now() - startTimeTotal;

      const finalResult: PipelineExecutionResult = {
        sessionId,
        studentId,
        lifecycleState: currentState,
        twinState: result.twinState!,
        analyticsReport: result.analyticsReport,
        adaptivePlan: result.adaptivePlan,
        blueprint: result.blueprint,
        composedLesson: result.composedLesson,
        orchestratorDirective: result.orchestratorDirective,
        teacherDirectives: result.teacherDirectives,
        assembledPrompt: result.assembledPrompt,
        aiResponse: result.aiResponse,
        sessionSnapshot: result.sessionSnapshot,
        threadsSnapshot: result.threadsSnapshot,
        syncedTwinState: result.syncedTwinState,
        stageTimingMs: timingMs,
        totalExecutionTimeMs,
        status,
        recoveryAttemptsCount,
        errors
      };

      runtimeIntegrationTelemetry.recordEvent({
        eventId: `tele_pipe_done_${Date.now()}`,
        sessionId,
        studentId,
        timestampIso: new Date().toISOString(),
        durationMs: totalExecutionTimeMs,
        status: status === 'success' ? 'completed' : 'recovered',
        details: `Pipeline concluído com status ${status} em ${totalExecutionTimeMs}ms.`
      });

      return finalResult;
    } catch (fatalError: any) {
      errors.push(`Fatal pipeline failure: ${fatalError.message || String(fatalError)}`);

      runtimeIntegrationTelemetry.recordEvent({
        eventId: `tele_pipe_fail_${Date.now()}`,
        sessionId,
        studentId,
        timestampIso: new Date().toISOString(),
        status: 'failed',
        errorMessage: fatalError.message || String(fatalError)
      });

      throw fatalError;
    }
  }

  private recordAndValidate(
    stage: PipelineStage,
    result: Partial<PipelineExecutionResult>,
    durationMs: number,
    sessionId: string,
    studentId: string
  ): void {
    runtimeIntegrationTelemetry.recordStageExecution(sessionId, studentId, stage, durationMs);
    const contractVal = pipelineContractsManager.validateStageOutput(stage, result);
    if (!contractVal.isValid) {
      console.warn(`[PipelineContract Warning] Issues at stage ${stage}: ${contractVal.issues.join('; ')}`);
    }
  }
}

export const pipelineOrchestrator = new PipelineOrchestrator();
