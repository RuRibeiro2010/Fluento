/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - TELEMETRY
 * 
 * Records events for planner actions and telemetry monitoring.
 */

import { PlannerTelemetryEvent } from './types';

export class PlannerTelemetry {
  private events: PlannerTelemetryEvent[] = [];

  public recordPlanGenerated(event: PlannerTelemetryEvent): void {
    this.events.push(event);
  }

  public getEvents(studentId?: string): PlannerTelemetryEvent[] {
    if (studentId) {
      return this.events.filter(e => e.studentId === studentId);
    }
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }
}

export const plannerTelemetry = new PlannerTelemetry();
