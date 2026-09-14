/**
 * FLUENTO SESSION RUNTIME - TELEMETRY
 * 
 * Captures, stores, and analyzes session lifecycle telemetric metrics.
 */

import { SessionEvent } from './session-events';

export class SessionTelemetry {
  private events: SessionEvent[] = [];

  public recordEvent(event: SessionEvent): void {
    this.events.push(event);
  }

  public getEvents(sessionId?: string): SessionEvent[] {
    if (sessionId) {
      return this.events.filter(e => e.sessionId === sessionId);
    }
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }

  public getSessionMetrics(sessionId: string): {
    totalTurns: number;
    errorCount: number;
    lastEventTime?: string;
  } {
    const sessionEvents = this.getEvents(sessionId);
    const totalTurns = sessionEvents.filter(e => e.eventType === 'turn_completed').length;
    const errorCount = sessionEvents.filter(e => e.eventType === 'error_occurred').length;
    const lastEventTime = sessionEvents.length > 0 ? sessionEvents[sessionEvents.length - 1].timestampIso : undefined;

    return {
      totalTurns,
      errorCount,
      lastEventTime
    };
  }
}

export const sessionTelemetry = new SessionTelemetry();
