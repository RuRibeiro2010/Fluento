/**
 * Autosave Module (Production & Reliability Platform - Phase 14)
 * Provides background debounce mechanisms to automatically save user progress,
 * lesson turns, and state changes without interrupting conversational flow.
 */

export interface AutosavePayload {
  lessonId: string;
  turnIndex: number;
  userSpeechLog: string[];
  lastUpdatedIso: string;
}

type AutosaveCallback = (payload: AutosavePayload) => Promise<void> | void;

class AutosaveEngine {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private pendingPayload: AutosavePayload | null = null;
  private debounceMs: number = 2000;

  public scheduleAutosave(payload: AutosavePayload, callback: AutosaveCallback): void {
    this.pendingPayload = payload;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(async () => {
      if (this.pendingPayload) {
        try {
          await callback(this.pendingPayload);
          // Also persist to local backup key
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(
              `fluento_autosave_${payload.lessonId}`,
              JSON.stringify(this.pendingPayload)
            );
          }
        } catch (err) {
          console.warn('[AutosaveEngine] Autosave failed silently:', err);
        }
      }
    }, this.debounceMs);
  }

  public flushImmediate(callback: AutosaveCallback): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.pendingPayload) {
      callback(this.pendingPayload);
    }
  }
}

export const autosaveEngine = new AutosaveEngine();
