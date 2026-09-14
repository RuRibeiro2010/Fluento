import { ConversationSessionData } from '../../domain/session/entities/conversation-session.entity';

/**
 * Interface for persisting the minimal state needed to resume an
 * in-progress Lesson Room conversation session after a browser reload.
 *
 * Decouples "where a pending session lives" from the concrete storage
 * engine - localStorage today (see LocalStorageConversationSessionGateway),
 * a server/database-backed implementation later - without the Application
 * Layer (LessonConversationUseCase) ever needing to change.
 *
 * Only sessions that have NOT been completed are ever expected to be
 * found here: completeSession() calls clearPendingSession() once a
 * session finishes, so a completed lesson is never mistakenly resumed.
 */
export interface IConversationSessionStorageGateway {
  /**
   * Looks up a pending (not completed) conversation session for a given
   * student + lesson combination. Returns null when none exists, or when
   * the stored record is missing/corrupted and cannot be safely restored -
   * callers should treat null exactly like "no prior session" and start a
   * fresh one.
   */
  findPendingSession(studentId: string, lessonId: string): Promise<ConversationSessionData | null>;

  /**
   * Persists (overwriting any previous value) the current snapshot of an
   * in-progress session, so it can be restored later.
   */
  savePendingSession(data: ConversationSessionData): Promise<void>;

  /**
   * Removes a session's persisted pending state. Called once a session is
   * completed.
   */
  clearPendingSession(studentId: string, lessonId: string): Promise<void>;
}
