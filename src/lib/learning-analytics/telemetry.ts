/**
 * FLUENTO LEARNING ANALYTICS - TELEMETRY
 * 
 * Captures, stores, and reports analytics evaluation telemetry events.
 */

import { AnalyticsTelemetryEvent } from './types';

export class AnalyticsTelemetry {
  private events: AnalyticsTelemetryEvent[] = [];

  public recordReportGenerated(event: AnalyticsTelemetryEvent): void {
    this.events.push(event);
  }

  public getEvents(studentId?: string): AnalyticsTelemetryEvent[] {
    if (studentId) {
      return this.events.filter(e => e.studentId === studentId);
    }
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }
}

export const analyticsTelemetry = new AnalyticsTelemetry();
