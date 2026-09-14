/**
 * FLUENTO SESSION RUNTIME - SESSION EVENTS
 * 
 * Manages event publishing and subscriptions for session lifecycle changes.
 * Completely decouples UI, logging, and external listeners from core runtime logic.
 */

import { SessionSnapshot, TurnRecord } from './types';

export type SessionEventType = 
  | 'session_created'
  | 'session_started'
  | 'turn_started'
  | 'turn_completed'
  | 'block_advanced'
  | 'session_paused'
  | 'session_resumed'
  | 'session_completed'
  | 'session_interrupted'
  | 'error_occurred';

export interface SessionEvent {
  eventId: string;
  sessionId: string;
  eventType: SessionEventType;
  timestampIso: string;
  snapshot?: SessionSnapshot;
  turn?: TurnRecord;
  blockIndex?: number;
  errorMessage?: string;
}

export type SessionEventListener = (event: SessionEvent) => void;

export class SessionEventEmitter {
  private listeners: Set<SessionEventListener> = new Set();

  public subscribe(listener: SessionEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public emit(event: Omit<SessionEvent, 'eventId' | 'timestampIso'>): SessionEvent {
    const fullEvent: SessionEvent = {
      ...event,
      eventId: `sevt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestampIso: new Date().toISOString()
    };

    this.listeners.forEach(listener => {
      try {
        listener(fullEvent);
      } catch (err) {
        console.error('Error in SessionEvent listener:', err);
      }
    });

    return fullEvent;
  }

  public clearListeners(): void {
    this.listeners.clear();
  }
}

export const sessionEventEmitter = new SessionEventEmitter();
