import {
  ConversationMessage,
  ConversationSessionState,
} from '../../domain/session/entities/conversation-session.entity';

export type ConversationMessageDTO = ConversationMessage;

/**
 * Minimal, privacy-preserving student context for pedagogical AI adaptation.
 * Does NOT leak raw digital twin vectors, telemetry, or credentials.
 */
export interface StudentMinimalContextDTO {
  readonly studentId: string;
  readonly name?: string;
  readonly nativeLanguage: string;
  readonly targetLanguage: string;
  readonly cefrLevel: string;
  readonly learningGoals: readonly string[];
  readonly currentFocus?: string;
  readonly correctionStrictness?: 'gentle' | 'balanced' | 'strict';
  readonly preferredTeacherPersona?: string;
}

/**
 * Structural context of the active lesson session.
 */
export interface LessonSessionContextDTO {
  readonly lessonId: string;
  readonly topic: string;
  readonly targetLanguage: string;
  readonly nativeLanguage: string;
  readonly cefrLevel: string;
  readonly learningObjective: string;
  readonly teacherPersona: string;
  readonly conversationHistory: ReadonlyArray<{
    readonly sender: 'teacher' | 'student' | 'system';
    readonly text: string;
  }>;
}

/**
 * View model representation of an active or completed conversation session.
 */
export interface ConversationSessionDTO {
  readonly sessionId: string;
  readonly lessonId: string;
  readonly studentId: string;
  readonly targetLanguage: string;
  readonly nativeLanguage: string;
  readonly cefrLevel: string;
  readonly teacherPersona: string;
  readonly topic: string;
  readonly objective: string;
  readonly messages: ReadonlyArray<ConversationMessage>;
  readonly state: ConversationSessionState;
  readonly startedAtIso: string;
  readonly updatedAtIso: string;
  readonly completedAtIso?: string;
  readonly turnsCount: number;
  readonly aiConfigured: boolean;
  readonly errorMessage?: string;
  readonly overallScore?: number;
}

/**
 * Summary DTO emitted when a lesson session is concluded.
 * Only presents honest, directly measured session data.
 * Does NOT invent artificial scores or fake fluency percentages.
 */
export interface LessonSessionSummaryDTO {
  readonly sessionId: string;
  readonly lessonId: string;
  readonly studentId: string;
  readonly topic: string;
  readonly durationSeconds: number;
  readonly durationMinutes: number;
  readonly turnsCount: number;
  readonly studentMessagesCount: number;
  readonly studentWordsCount: number;
  readonly evaluationAvailable: boolean;
  readonly evaluationStatus: 'NOT_AVAILABLE' | 'COMPLETED';
  readonly overallScore?: number | null;
  readonly completedAtIso: string;
  readonly profileUpdated: boolean;
}
