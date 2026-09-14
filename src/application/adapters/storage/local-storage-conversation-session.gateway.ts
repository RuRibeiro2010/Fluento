import { IConversationSessionStorageGateway } from '../../contracts/conversation-session-storage.contract';
import { ConversationSessionData } from '../../../domain/session/entities/conversation-session.entity';

const STORAGE_KEY_PREFIX = 'fluento_pending_conversation_';

function storageKey(studentId: string, lessonId: string): string {
  return `${STORAGE_KEY_PREFIX}${studentId}_${lessonId}`;
}

/**
 * Default production implementation of IConversationSessionStorageGateway.
 *
 * Persists a single pending conversation snapshot per (studentId, lessonId)
 * pair to the browser's localStorage, so a Lesson Room in progress can be
 * resumed after a reload. Behavior mirrors
 * LocalStorageStudentProfileGateway: an in-memory fallback map covers
 * non-browser environments (tests, SSR), and any read/write/parse failure
 * is caught and logged rather than thrown, so persistence problems never
 * break the conversation flow itself.
 */
export class LocalStorageConversationSessionGateway implements IConversationSessionStorageGateway {
  private inMemoryFallback: Map<string, ConversationSessionData> = new Map();

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  /**
   * Narrows an unknown parsed value into ConversationSessionData without
   * ever trusting it implicitly. Anything that doesn't shape up correctly
   * is treated as corrupted (see findPendingSession) rather than passed on.
   */
  private isValidSnapshot(value: unknown): value is ConversationSessionData {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const v = value as Record<string, unknown>;
    return (
      typeof v.sessionId === 'string' &&
      typeof v.lessonId === 'string' &&
      typeof v.studentId === 'string' &&
      Array.isArray(v.messages) &&
      typeof v.state === 'string' &&
      typeof v.turnsCount === 'number' &&
      typeof v.aiConfigured === 'boolean' &&
      typeof v.startedAtIso === 'string' &&
      typeof v.updatedAtIso === 'string'
    );
  }

  public async findPendingSession(
    studentId: string,
    lessonId: string
  ): Promise<ConversationSessionData | null> {
    const key = storageKey(studentId, lessonId);

    const cached = this.inMemoryFallback.get(key);
    if (cached) {
      return cached.state === 'completed' ? null : cached;
    }

    if (!this.isBrowser()) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        return null;
      }

      const parsed: unknown = JSON.parse(raw);
      if (!this.isValidSnapshot(parsed) || parsed.state === 'completed') {
        return null;
      }

      this.inMemoryFallback.set(key, parsed);
      return parsed;
    } catch (err) {
      // Corrupted/unreadable entry: ignore it safely, caller starts fresh.
      console.warn('[LocalStorageConversationSessionGateway] Ignoring corrupted pending session:', err);
      return null;
    }
  }

  public async savePendingSession(data: ConversationSessionData): Promise<void> {
    const key = storageKey(data.studentId, data.lessonId);
    this.inMemoryFallback.set(key, data);

    if (!this.isBrowser()) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.warn('[LocalStorageConversationSessionGateway] Error persisting pending session:', err);
    }
  }

  public async clearPendingSession(studentId: string, lessonId: string): Promise<void> {
    const key = storageKey(studentId, lessonId);
    this.inMemoryFallback.delete(key);

    if (!this.isBrowser()) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.warn('[LocalStorageConversationSessionGateway] Error clearing pending session:', err);
    }
  }

  /**
   * Clears in-memory cache (useful for testing, mirrors
   * LocalStorageStudentProfileGateway.clearMemory()).
   */
  public clearMemory(): void {
    this.inMemoryFallback.clear();
  }
}
