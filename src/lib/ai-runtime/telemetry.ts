/**
 * FLUENTO AI RUNTIME - TELEMETRY
 * 
 * Captures, stores, and analyzes AI Runtime execution metrics and events.
 * Provides observability for latency, error rates, retries, and provider performance.
 */

import { TelemetryEvent, SupportedProvider } from './types';

export class Telemetry {
  private events: TelemetryEvent[] = [];

  public logEvent(event: Omit<TelemetryEvent, 'eventId' | 'timestampIso'>): TelemetryEvent {
    const fullEvent: TelemetryEvent = {
      ...event,
      eventId: `tel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestampIso: new Date().toISOString()
    };

    this.events.push(fullEvent);
    return fullEvent;
  }

  public getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }

  public getFailureRate(provider?: SupportedProvider): number {
    const filtered = provider ? this.events.filter(e => e.provider === provider) : this.events;
    if (filtered.length === 0) return 0;

    const failures = filtered.filter(e => e.eventType === 'request_failed' || e.eventType === 'timeout_triggered').length;
    return (failures / filtered.length) * 100;
  }

  public getAverageLatencyMs(provider?: SupportedProvider): number {
    const filtered = (provider ? this.events.filter(e => e.provider === provider) : this.events)
      .filter(e => e.latencyMs !== undefined);

    if (filtered.length === 0) return 0;
    const totalLatency = filtered.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0);
    return Math.round(totalLatency / filtered.length);
  }
}

export const telemetry = new Telemetry();
