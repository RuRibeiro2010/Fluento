/**
 * FLUENTO STUDENT DIGITAL TWIN - TELEMETRY
 * 
 * Captures, stores, and analyzes profile mutation events and revision histories.
 */

import { TwinMutationEvent } from './types';

export class TwinTelemetry {
  private events: TwinMutationEvent[] = [];

  public recordMutation(event: TwinMutationEvent): void {
    this.events.push(event);
  }

  public getEvents(studentId?: string): TwinMutationEvent[] {
    if (studentId) {
      return this.events.filter(e => e.studentId === studentId);
    }
    return [...this.events];
  }

  public getMutationCount(studentId: string): number {
    return this.getEvents(studentId).length;
  }

  public clear(): void {
    this.events = [];
  }
}

export const twinTelemetry = new TwinTelemetry();
