import { Entity } from '../../shared/entity';
import { SessionId } from '../value-objects/session-id.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';

export type ConversationSessionState =
  | 'idle'
  | 'loading'
  | 'active'
  | 'error'
  | 'completed'
  | 'AI_NOT_CONFIGURED';

export type MessageSender = 'teacher' | 'student' | 'system';

export type MessageType =
  | 'greeting'
  | 'utterance'
  | 'correction'
  | 'feedback'
  | 'system_status';

export interface ConversationMessage {
  readonly id: string;
  readonly sender: MessageSender;
  readonly text: string;
  readonly timestampIso: string;
  readonly type: MessageType;
  readonly translation?: string;
  readonly tip?: string;
}

/**
 * Domain-owned data representation of a Conversation Session.
 */
export interface ConversationSessionData {
  sessionId: string;
  lessonId: string;
  studentId: string;
  targetLanguage: string;
  nativeLanguage: string;
  cefrLevel: string;
  teacherPersona: string;
  topic: string;
  objective: string;
  messages: ConversationMessage[];
  state: ConversationSessionState;
  startedAtIso: string;
  updatedAtIso: string;
  completedAtIso?: string;
  turnsCount: number;
  aiConfigured: boolean;
  errorMessage?: string;
  overallScore?: number;
}

export interface ConversationSessionProps {
  lessonId: string;
  studentId: string;
  targetLanguage: string;
  nativeLanguage: string;
  cefrLevel: string;
  teacherPersona: string;
  topic: string;
  objective: string;
  messages: ConversationMessage[];
  state: ConversationSessionState;
  startedAt: TimeStamp;
  updatedAt: TimeStamp;
  completedAt?: TimeStamp;
  turnsCount: number;
  aiConfigured: boolean;
  errorMessage?: string;
  overallScore?: number;
}

export class ConversationSessionEntity extends Entity<ConversationSessionProps> {
  private constructor(id: string, props: ConversationSessionProps) {
    super(id, props);
  }

  public static create(
    sessionId: string,
    params: {
      lessonId: string;
      studentId: string;
      targetLanguage?: string;
      nativeLanguage?: string;
      cefrLevel?: string;
      teacherPersona?: string;
      topic?: string;
      objective?: string;
      initialState?: ConversationSessionState;
      aiConfigured?: boolean;
    }
  ): ConversationSessionEntity {
    const now = TimeStamp.now();
    return new ConversationSessionEntity(sessionId, {
      lessonId: params.lessonId,
      studentId: params.studentId,
      targetLanguage: params.targetLanguage || 'es',
      nativeLanguage: params.nativeLanguage || 'pt',
      cefrLevel: params.cefrLevel || 'B1',
      teacherPersona: params.teacherPersona || 'Prof. Sofia',
      topic: params.topic || 'Prática de Conversação',
      objective: params.objective || 'Desenvolver fluência comunicativa.',
      messages: [],
      state: params.initialState || 'idle',
      startedAt: now,
      updatedAt: now,
      turnsCount: 0,
      aiConfigured: params.aiConfigured ?? false,
    });
  }

  get sessionId(): SessionId {
    return SessionId.create(this._id);
  }

  get lessonId(): string {
    return this._props.lessonId;
  }

  get studentId(): string {
    return this._props.studentId;
  }

  get targetLanguage(): string {
    return this._props.targetLanguage;
  }

  get nativeLanguage(): string {
    return this._props.nativeLanguage;
  }

  get cefrLevel(): string {
    return this._props.cefrLevel;
  }

  get teacherPersona(): string {
    return this._props.teacherPersona;
  }

  get topic(): string {
    return this._props.topic;
  }

  get objective(): string {
    return this._props.objective;
  }

  get state(): ConversationSessionState {
    return this._props.state;
  }

  get messages(): ReadonlyArray<ConversationMessage> {
    return [...this._props.messages];
  }

  get turnsCount(): number {
    return this._props.turnsCount;
  }

  get aiConfigured(): boolean {
    return this._props.aiConfigured;
  }

  get errorMessage(): string | undefined {
    return this._props.errorMessage;
  }

  get overallScore(): number | undefined {
    return this._props.overallScore;
  }

  /**
   * Reconstructs a ConversationSessionEntity from a previously persisted
   * ConversationSessionData snapshot (see toData()). Used to resume a
   * session after a browser reload.
   *
   * Throws (via TimeStamp.fromISO) if the stored timestamps are invalid.
   * Callers restoring from storage should treat any failure from this
   * method as "no valid pending session" and fall back to creating a new
   * one with create() - never let a corrupted snapshot break session
   * start-up.
   */
  public static restore(data: ConversationSessionData): ConversationSessionEntity {
    return new ConversationSessionEntity(data.sessionId, {
      lessonId: data.lessonId,
      studentId: data.studentId,
      targetLanguage: data.targetLanguage,
      nativeLanguage: data.nativeLanguage,
      cefrLevel: data.cefrLevel,
      teacherPersona: data.teacherPersona,
      topic: data.topic,
      objective: data.objective,
      messages: [...data.messages],
      state: data.state,
      startedAt: TimeStamp.fromISO(data.startedAtIso),
      updatedAt: TimeStamp.fromISO(data.updatedAtIso),
      completedAt: data.completedAtIso ? TimeStamp.fromISO(data.completedAtIso) : undefined,
      turnsCount: data.turnsCount,
      aiConfigured: data.aiConfigured,
      errorMessage: data.errorMessage,
      overallScore: data.overallScore,
    });
  }

  public setState(newState: ConversationSessionState): void {
    this._props.state = newState;
    this._props.updatedAt = TimeStamp.now();
  }

  public addStudentMessage(text: string): ConversationMessage {
    const msg: ConversationMessage = {
      id: `msg_std_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sender: 'student',
      text: text.trim(),
      timestampIso: new Date().toISOString(),
      type: 'utterance',
    };
    this._props.messages.push(msg);
    this._props.turnsCount += 1;
    this._props.updatedAt = TimeStamp.now();
    return msg;
  }

  public addTeacherMessage(
    text: string,
    options?: {
      type?: MessageType;
      translation?: string;
      tip?: string;
    }
  ): ConversationMessage {
    const msg: ConversationMessage = {
      id: `msg_tch_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sender: 'teacher',
      text: text.trim(),
      timestampIso: new Date().toISOString(),
      type: options?.type || 'utterance',
      translation: options?.translation,
      tip: options?.tip,
    };
    this._props.messages.push(msg);
    this._props.updatedAt = TimeStamp.now();
    return msg;
  }

  public addSystemMessage(text: string, type: MessageType = 'system_status'): ConversationMessage {
    const msg: ConversationMessage = {
      id: `msg_sys_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sender: 'system',
      text: text.trim(),
      timestampIso: new Date().toISOString(),
      type,
    };
    this._props.messages.push(msg);
    this._props.updatedAt = TimeStamp.now();
    return msg;
  }

  public markAiNotConfigured(reason?: string): void {
    this._props.state = 'AI_NOT_CONFIGURED';
    this._props.aiConfigured = false;
    this._props.errorMessage = reason || 'AI Runtime is not configured. GEMINI_API_KEY is missing on server.';
    this._props.updatedAt = TimeStamp.now();
  }

  /**
   * Marks the session as having a working AI Runtime connection (i.e. the
   * server successfully returned a response from the configured provider).
   *
   * Sprint 16A.4.1 (Architecture Hardening): this replaces a previous
   * call-site bypass (`(sessionEntity as any)._props.aiConfigured = true`)
   * that mutated the entity's private state directly from the application
   * layer. Behavior is unchanged: `aiConfigured` is still just set to
   * `true`, but now through a proper domain method that also keeps
   * `updatedAt` consistent with every other mutation on this entity.
   */
  public markAiConfigured(): void {
    this._props.aiConfigured = true;
    this._props.updatedAt = TimeStamp.now();
  }

  public markError(errorText: string): void {
    this._props.state = 'error';
    this._props.errorMessage = errorText;
    this._props.updatedAt = TimeStamp.now();
  }

  public complete(score?: number): void {
    this._props.state = 'completed';
    this._props.completedAt = TimeStamp.now();
    // Do not invent fake score: only set if explicitly provided from real evaluation
    this._props.overallScore = score;
    this._props.updatedAt = TimeStamp.now();
  }

  /**
   * Calculates actual word count from student utterances (honest metric, no estimation).
   */
  public calculateStudentWordsCount(): number {
    return this._props.messages
      .filter((m) => m.sender === 'student')
      .reduce((acc, m) => {
        const words = m.text.trim().split(/\s+/).filter(Boolean);
        return acc + words.length;
      }, 0);
  }

  public toData(): ConversationSessionData {
    return {
      sessionId: this._id,
      lessonId: this._props.lessonId,
      studentId: this._props.studentId,
      targetLanguage: this._props.targetLanguage,
      nativeLanguage: this._props.nativeLanguage,
      cefrLevel: this._props.cefrLevel,
      teacherPersona: this._props.teacherPersona,
      topic: this._props.topic,
      objective: this._props.objective,
      messages: [...this._props.messages],
      state: this._props.state,
      startedAtIso: this._props.startedAt.toISO(),
      updatedAtIso: this._props.updatedAt.toISO(),
      completedAtIso: this._props.completedAt?.toISO(),
      turnsCount: this._props.turnsCount,
      aiConfigured: this._props.aiConfigured,
      errorMessage: this._props.errorMessage,
      overallScore: this._props.overallScore,
    };
  }
}
