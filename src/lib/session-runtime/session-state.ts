/**
 * FLUENTO SESSION RUNTIME - SESSION STATE
 * 
 * Manages in-memory active session snapshots, checkpoint persistence/recovery,
 * and session state transitions.
 */

import { SessionSnapshot, SessionStatus } from './types';

export class SessionStateManager {
  private activeSessions: Map<string, SessionSnapshot> = new Map();

  public createSession(snapshot: SessionSnapshot): SessionSnapshot {
    this.activeSessions.set(snapshot.sessionId, snapshot);
    return snapshot;
  }

  public getSession(sessionId: string): SessionSnapshot | undefined {
    return this.activeSessions.get(sessionId);
  }

  public updateSession(snapshot: SessionSnapshot): SessionSnapshot {
    const updated: SessionSnapshot = {
      ...snapshot,
      lastActiveTimeIso: new Date().toISOString(),
      checkpointStateIso: new Date().toISOString()
    };
    this.activeSessions.set(snapshot.sessionId, updated);
    return updated;
  }

  public setSessionStatus(sessionId: string, status: SessionStatus): SessionSnapshot {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const updated: SessionSnapshot = {
      ...session,
      status,
      lastActiveTimeIso: new Date().toISOString(),
      ...(status === 'completed' ? { completedTimeIso: new Date().toISOString() } : {})
    };

    this.activeSessions.set(sessionId, updated);
    return updated;
  }

  /**
   * Resumes an interrupted or paused session.
   */
  public resumeSession(sessionId: string): SessionSnapshot {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Cannot resume: Session ${sessionId} not found`);
    }

    if (session.status === 'completed') {
      throw new Error(`Cannot resume: Session ${sessionId} is already completed`);
    }

    return this.setSessionStatus(sessionId, 'active');
  }

  public getAllActiveSessions(): SessionSnapshot[] {
    return Array.from(this.activeSessions.values());
  }

  public clear(): void {
    this.activeSessions.clear();
  }
}

export const sessionStateManager = new SessionStateManager();
