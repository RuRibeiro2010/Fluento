/**
 * FLUENTO RUNTIME INTEGRATION - MAIN ENGINE FACADE
 * 
 * Public facade exposing high-level methods for full pipeline execution,
 * session resumption, state synchronization, and operational diagnostics.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { SessionSnapshot } from '@/src/lib/session-runtime';
import { ThreadSnapshot } from '@/src/lib/learning-threads';

import { PipelineExecutionOptions, PipelineExecutionResult, CheckpointData } from './types';
import { pipelineOrchestrator } from './pipeline-orchestrator';
import { stateSynchronizer } from './state-synchronizer';
import { lifecycleManager } from './lifecycle-manager';
import { errorRecoveryEngine } from './error-recovery';
import { dependencyResolver } from './dependency-resolver';
import { runtimeIntegrationTelemetry } from './telemetry';

export class RuntimeIntegrationEngine {
  /**
   * Executes the full 12-stage Fluento pipeline end-to-end.
   */
  public async executeFullPipeline(options: PipelineExecutionOptions): Promise<PipelineExecutionResult> {
    return pipelineOrchestrator.executePipeline(options);
  }

  /**
   * Safe resumption of an interrupted session from checkpoint.
   */
  public resumeInterruptedSession(sessionId: string) {
    return errorRecoveryEngine.recoverInterruptedSession(sessionId);
  }

  /**
   * Direct synchronization of Student Digital Twin with session & thread state.
   */
  public synchronizeStudentState(
    studentId: string,
    sessionSnapshot?: SessionSnapshot,
    threadsSnapshot?: ThreadSnapshot
  ): StudentDigitalTwinState {
    return stateSynchronizer.synchronizeStudentState(studentId, sessionSnapshot, threadsSnapshot);
  }

  /**
   * Gets current checkpoint/status for an active or interrupted session.
   */
  public getSessionCheckpoint(sessionId: string): CheckpointData | undefined {
    return lifecycleManager.getCheckpoint(sessionId);
  }

  /**
   * Verifies pipeline readiness and dependency health.
   */
  public verifyHealth() {
    return dependencyResolver.resolveDependencies();
  }

  /**
   * Retrieves runtime integration telemetry logs.
   */
  public getTelemetryLogs(sessionId?: string) {
    return runtimeIntegrationTelemetry.getEvents(sessionId);
  }
}

export const runtimeIntegrationEngine = new RuntimeIntegrationEngine();
