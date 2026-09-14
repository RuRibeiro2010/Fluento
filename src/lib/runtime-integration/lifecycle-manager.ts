/**
 * FLUENTO RUNTIME INTEGRATION - LIFECYCLE MANAGER
 * 
 * Manages session lifecycle state transitions, persistence of intermediate checkpoints,
 * and safe session resumption.
 */

import { SessionLifecycleState, CheckpointData, PipelineExecutionResult } from './types';

export class LifecycleManager {
  private activeCheckpoints: Map<string, CheckpointData> = new Map();

  /**
   * Creates or updates a session checkpoint.
   */
  public saveCheckpoint(
    sessionId: string,
    studentId: string,
    lifecycleState: SessionLifecycleState,
    result: Partial<PipelineExecutionResult>
  ): CheckpointData {
    const checkpoint: CheckpointData = {
      sessionId,
      studentId,
      savedAtIso: new Date().toISOString(),
      lifecycleState,
      result: { ...result }
    };

    this.activeCheckpoints.set(sessionId, checkpoint);
    return checkpoint;
  }

  /**
   * Retrieves a checkpoint by session ID.
   */
  public getCheckpoint(sessionId: string): CheckpointData | undefined {
    return this.activeCheckpoints.get(sessionId);
  }

  /**
   * Clears a checkpoint when session successfully completes or is discarded.
   */
  public clearCheckpoint(sessionId: string): void {
    this.activeCheckpoints.delete(sessionId);
  }
}

export const lifecycleManager = new LifecycleManager();
