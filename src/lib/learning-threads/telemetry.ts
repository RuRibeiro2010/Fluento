/**
 * FLUENTO LEARNING THREADS - TELEMETRY
 * 
 * Captures, stores, and reports memory thread telemetry events.
 */

import { ThreadTelemetryEvent } from './types';

export class ThreadTelemetry {
  private events: ThreadTelemetryEvent[] = [];

  public recordEvent(event: ThreadTelemetryEvent): void {
    this.events.push(event);
  }

  public getEvents(studentId?: string): ThreadTelemetryEvent[] {
    if (studentId) {
      return this.events.filter(e => e.studentId === studentId);
    }
    return [...this.events];
  }

  public getEventCount(studentId: string): number {
    return this.getEvents(studentId).length;
  }

  public clear(): void {
    this.events = [];
  }
}

export const threadTelemetry = new ThreadTelemetry();
