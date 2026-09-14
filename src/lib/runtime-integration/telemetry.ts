/**
 * FLUENTO RUNTIME INTEGRATION - TELEMETRY
 * 
 * Captures, stores, and reports execution telemetry across all 12 stages
 * of the Runtime Integration pipeline.
 */

import { PipelineTelemetryEvent, PipelineStage } from './types';

export class RuntimeIntegrationTelemetry {
  private events: PipelineTelemetryEvent[] = [];

  public recordEvent(event: PipelineTelemetryEvent): void {
    this.events.push(event);
  }

  public recordStageExecution(
    sessionId: string,
    studentId: string,
    stage: PipelineStage,
    durationMs: number
  ): void {
    this.events.push({
      eventId: `tele_stg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sessionId,
      studentId,
      timestampIso: new Date().toISOString(),
      stage,
      durationMs,
      status: 'stage_completed'
    });
  }

  public getEvents(sessionId?: string): PipelineTelemetryEvent[] {
    if (sessionId) {
      return this.events.filter(e => e.sessionId === sessionId);
    }
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }
}

export const runtimeIntegrationTelemetry = new RuntimeIntegrationTelemetry();
