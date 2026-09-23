import {
  LessonConversationUseCase,
  StartLessonConversationCommand,
  SendStudentMessageCommand,
  CompleteLessonConversationCommand,
} from '../use-cases/lesson-conversation.use-cases';
import {
  ConversationSessionDTO,
  LessonSessionSummaryDTO,
  ConversationMessageDTO,
} from '../dto/conversation.dtos';

export interface AiHealthCheckResult {
  configured: boolean;
  service: string;
  timestampIso: string;
  message: string;
}

/**
 * LESSON ROOM UI ADAPTER
 *
 * Dedicated Application Layer entrypoint for the Lesson Room React views.
 * Encapsulates session initialization, conversation turn orchestration,
 * AI configuration health checks, and session finalization.
 *
 * CRITICAL ARCHITECTURAL MANDATE:
 * - NO imports of @google/genai
 * - NO imports of GEMINI_API_KEY
 * - NO server-side credentials or secrets
 */
export class LessonRoomAdapter {
  constructor(private readonly conversationUseCase: LessonConversationUseCase) {}

  /**
   * Starts a new lesson session.
   * Loads pedagogical context from Student Profile and Lesson Catalog,
   * initializing conversation with the AI Teacher.
   */
  public async startSession(
    params: StartLessonConversationCommand = {}
  ): Promise<ConversationSessionDTO> {
    return this.conversationUseCase.startSession(params);
  }

  /**
   * Dispatches student input to the AI Conversation engine.
   * Supports real-time text generation and optional delta streaming callbacks.
   */
  public async sendStudentMessage(
    sessionId: string,
    studentUtterance: string,
    onStreamChunk?: (delta: string) => void
  ): Promise<{
    session: ConversationSessionDTO;
    teacherMessage?: ConversationMessageDTO;
  }> {
    return this.conversationUseCase.sendStudentMessage({
      sessionId,
      studentUtterance,
      onStreamChunk,
    });
  }

  /**
   * Finalizes the lesson room session, computing pedagogical accuracy,
   * saving session telemetry, and updating student profile progress.
   */
  public async completeSession(
    sessionId: string,
    durationSeconds: number
  ): Promise<LessonSessionSummaryDTO> {
    return this.conversationUseCase.completeSession({
      sessionId,
      durationSeconds,
    });
  }

  /**
   * Retrieves active session details by session ID.
   */
  public getSession(sessionId: string): ConversationSessionDTO | null {
    return this.conversationUseCase.getSession(sessionId);
  }

  /**
   * Queries server health endpoint to check AI configuration status.
   */
  public async checkAiHealth(): Promise<AiHealthCheckResult> {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        return {
          configured: false,
          service: 'fluento-server',
          timestampIso: new Date().toISOString(),
          message: `Servidor retornou código ${response.status}`,
        };
      }
      const data = await response.json();
      return {
        configured: !!data.aiConfigured,
        service: data.service || 'fluento-server',
        timestampIso: data.timestampIso || new Date().toISOString(),
        message: data.aiConfigured
          ? 'Motor de IA configurado e operacional no servidor.'
          : 'GEMINI_API_KEY não configurada no servidor.',
      };
    } catch (err: any) {
      return {
        configured: false,
        service: 'fluento-server',
        timestampIso: new Date().toISOString(),
        message: 'Não foi possível conectar ao servidor de API.',
      };
    }
  }
}
