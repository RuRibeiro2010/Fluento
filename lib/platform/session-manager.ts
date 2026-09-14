/**
 * Session Manager Module (Production & Reliability Platform - Phase 14)
 * Handles session persistence, active session state preservation,
 * and automatic restoration of interrupted lessons or conversations.
 */

export interface InterruptedSessionSnapshot {
  sessionId: string;
  userId: string;
  lessonId: string;
  lastCompletedTurnIndex: number;
  lastTurnText: string;
  savedStateTimestampMs: number;
  uncompletedTurnData?: Record<string, unknown>;
}

const SESSION_STORAGE_KEY = 'fluento_interrupted_session_v1';

export function saveInterruptedSession(snapshot: InterruptedSessionSnapshot): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
    }
  } catch (error) {
    console.warn('[SessionManager] Failed to persist session snapshot:', error);
  }
}

export function restoreInterruptedSession(): InterruptedSessionSnapshot | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed: InterruptedSessionSnapshot = JSON.parse(raw);

      // Expire snapshots older than 24 hours
      const ageMs = Date.now() - parsed.savedStateTimestampMs;
      if (ageMs > 24 * 60 * 60 * 1000) {
        clearInterruptedSession();
        return null;
      }
      return parsed;
    }
  } catch (error) {
    console.warn('[SessionManager] Failed to restore session snapshot:', error);
  }
  return null;
}

export function clearInterruptedSession(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (error) {
    console.warn('[SessionManager] Failed to clear session snapshot:', error);
  }
}
