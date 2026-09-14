import { ISessionRepository } from '../../domain/session/repositories/session-repository.interface';
import { ILessonRepository } from '../../domain/lesson/repositories/lesson-repository.interface';
import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { IEventPublisher, ILogger } from '../contracts/infrastructure.contracts';
import { IConversationSessionStorageGateway } from '../contracts/conversation-session-storage.contract';
import { StudentProfileSyncService } from '../services/student-profile-sync.service';
import {
  ConversationSessionEntity,
  ConversationSessionData,
  ConversationMessage,
} from '../../domain/session/entities/conversation-session.entity';
import { SessionEntity } from '../../domain/session/entities/session.entity';
import { SessionId } from '../../domain/session/value-objects/session-id.vo';
import { LessonId } from '../../domain/lesson/value-objects/lesson-id.vo';
import { StudentId } from '../../domain/student/value-objects/student-id.vo';
import { TimeStamp } from '../../domain/shared/value-objects/time-stamp.vo';
import { SessionCompletedEvent } from '../events/application-events';
import {
  ConversationSessionDTO,
  ConversationMessageDTO,
  StudentMinimalContextDTO,
  LessonSessionContextDTO,
  LessonSessionSummaryDTO,
} from '../dto/conversation.dtos';
import { conversationPromptBuilder } from '../services/conversation-prompt-builder.service';
import { generateAiText, streamAiText, AiClientError } from '../../lib/api/ai-client';
import { applicationTelemetry } from '../telemetry/telemetry.service';

export interface StartLessonConversationCommand {
  lessonId?: string;
  studentId?: string;
  teacherPersona?: string;
}

export interface SendStudentMessageCommand {
  sessionId: string;
  studentUtterance: string;
  onStreamChunk?: (delta: string) => void;
}

export interface CompleteLessonConversationCommand {
  sessionId: string;
  durationSeconds: number;
}

/**
 * LESSON CONVERSATION USE CASES
 * Orchestrates real-time conversational lessons connecting the UI Room
 * to Application domain services and the safe server-side AI proxy.
 */
export class LessonConversationUseCase {
  // In-memory active conversation session store for the application layer
  private activeSessions = new Map<string, ConversationSessionEntity>();

  constructor(
    private readonly sessionRepo: ISessionRepository,
    private readonly lessonRepo: ILessonRepository,
    private readonly studentRepo: IStudentRepository,
    private readonly studentProfileSyncService: StudentProfileSyncService,
    private readonly eventPublisher: IEventPublisher,
    private readonly logger: ILogger,
    // Persists just enough state to resume a Lesson Room session after a
    // browser reload (Sprint 16A.5). Isolated behind an interface so the
    // storage engine can change later without touching this use-case.
    private readonly sessionStorageGateway: IConversationSessionStorageGateway,
    // Optional injector for AI client call (for seamless unit testing)
    private readonly aiClientCaller?: {
      generate: typeof generateAiText;
      stream: typeof streamAiText;
    }
  ) {}

  /**
   * Persists the current snapshot of a session so it can be resumed after a
   * reload. Failures are logged and swallowed - persistence is a
   * best-effort convenience, never a reason to break the conversation flow.
   */
  private async persistPendingSnapshot(session: ConversationSessionEntity): Promise<void> {
    try {
      await this.sessionStorageGateway.savePendingSession(session.toData());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Could not persist pending session snapshot: ${message}`);
    }
  }

  /**
   * Starts a new lesson session.
   * Resolves minimal student profile and lesson objectives, builds context,
   * and requests opening greeting from AI Runtime.
   */
  public async startSession(
    command: StartLessonConversationCommand
  ): Promise<ConversationSessionDTO> {
    const studentId = command.studentId || 'usr_fluento_primary';
    const lessonId = command.lessonId || 'lesson-exec-1';
    const teacherPersona = command.teacherPersona || 'Prof. Sofia';

    const span = applicationTelemetry.startSpan('LessonConversationUseCase.startSession', {
      studentId,
      lessonId,
      teacherPersona,
    });

    try {
      // 0. Attempt to resume a pending (not completed) session for this
      // student + lesson, so a browser reload doesn't lose an in-progress
      // conversation. Any failure here (corrupted/invalid stored data) is
      // treated as "no pending session" and falls through to the normal
      // fresh-start flow below - it never blocks starting a new session.
      try {
        const pending = await this.sessionStorageGateway.findPendingSession(studentId, lessonId);
        if (pending) {
          const restoredEntity = ConversationSessionEntity.restore(pending);
          this.activeSessions.set(pending.sessionId, restoredEntity);
          this.logger.info(`Resumed pending session ${pending.sessionId} for lesson ${lessonId}.`);
          applicationTelemetry.endSpan(span, true);
          return this.toSessionDTO(restoredEntity);
        }
      } catch (restoreErr: unknown) {
        const message = restoreErr instanceof Error ? restoreErr.message : String(restoreErr);
        this.logger.warn(
          `Could not restore pending session for ${studentId}/${lessonId}, starting fresh: ${message}`
        );
      }

      // 1. Resolve minimal student context from canonical profile
      const studentProfile = await this.studentProfileSyncService.getProfile(studentId);
      const studentContext: StudentMinimalContextDTO = {
        studentId: studentProfile.id,
        name: studentProfile.name,
        nativeLanguage: studentProfile.nativeLanguage || 'pt',
        targetLanguage: studentProfile.targetLanguages[0] || 'es',
        cefrLevel: studentProfile.currentLevel || 'B1',
        learningGoals: [
          studentProfile.objectives?.primaryMotivation,
          studentProfile.objectives?.currentFocus,
        ].filter(Boolean) as string[],
        currentFocus: studentProfile.objectives?.currentFocus || 'Negociação & Apresentações',
        correctionStrictness:
          (studentProfile.preferences?.correctionStrictness as any) || 'balanced',
        preferredTeacherPersona:
          command.teacherPersona ||
          studentProfile.preferences?.preferredTeacherPersona ||
          'Prof. Sofia',
      };

      // 2. Resolve lesson context from domain repository
      let lessonTitle = 'Apresentação Executiva & Negociação de Ideias';
      let lessonObjective = 'Apresentar propostas de valor com precisão diplomática e persuasão corporativa.';
      let lessonLevel = studentContext.cefrLevel;

      try {
        const lesson = await this.lessonRepo.findById(LessonId.create(lessonId));
        if (lesson) {
          lessonTitle = lesson.title;
          lessonObjective = lesson.objective.description;
          lessonLevel = lesson.cefrLevel.value;
        }
      } catch {
        // Fallback to default executive negotiation lesson if not in memory repo
      }

      const sessionId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const sessionEntity = ConversationSessionEntity.create(sessionId, {
        lessonId,
        studentId,
        targetLanguage: studentContext.targetLanguage,
        nativeLanguage: studentContext.nativeLanguage,
        cefrLevel: lessonLevel,
        teacherPersona: studentContext.preferredTeacherPersona,
        topic: lessonTitle,
        objective: lessonObjective,
        initialState: 'loading',
        aiConfigured: false,
      });

      this.activeSessions.set(sessionId, sessionEntity);

      // 3. Build pedagogical opening prompt
      const lessonContext: LessonSessionContextDTO = {
        lessonId,
        topic: lessonTitle,
        targetLanguage: studentContext.targetLanguage,
        nativeLanguage: studentContext.nativeLanguage,
        cefrLevel: lessonLevel,
        learningObjective: lessonObjective,
        teacherPersona: studentContext.preferredTeacherPersona || 'Prof. Sofia',
        conversationHistory: [],
      };

      const promptData = conversationPromptBuilder.buildGreetingPrompt(
        studentContext,
        lessonContext
      );

      // 4. Request initial greeting from safe server AI API proxy
      const generateFn = this.aiClientCaller?.generate || generateAiText;

      try {
        const aiResponse = await generateFn({
          prompt: promptData.prompt,
          systemInstruction: promptData.systemInstruction,
          temperature: 0.7,
          maxTokens: 250,
          sessionId,
          studentId,
        });

        sessionEntity.addTeacherMessage(aiResponse.content, {
          type: 'greeting',
          tip: '💡 Dica do Professor: Responde na língua alvo demonstrando clareza e cortesia.',
        });
        sessionEntity.setState('active');
        sessionEntity.markAiConfigured();

        this.logger.info(`Session ${sessionId} successfully started with AI greeting.`);
        applicationTelemetry.endSpan(span, true);
      } catch (aiErr: any) {
        if (
          aiErr instanceof AiClientError &&
          (aiErr.status === 503 || aiErr.code === 'AI_PROVIDER_NOT_CONFIGURED')
        ) {
          this.logger.warn(`AI Provider is not configured on the server. Setting AI_NOT_CONFIGURED.`);
          sessionEntity.markAiNotConfigured(
            'O servidor do Fluento não tem a chave GEMINI_API_KEY configurada. O AI Runtime encontra-se desligado em modo seguro.'
          );
        } else if (
          aiErr?.message?.includes('AI_PROVIDER_NOT_CONFIGURED') ||
          aiErr?.message?.includes('GEMINI_API_KEY')
        ) {
          sessionEntity.markAiNotConfigured(
            'O servidor do Fluento não tem a chave GEMINI_API_KEY configurada.'
          );
        } else {
          this.logger.error(`Failed to generate initial AI greeting: ${aiErr.message}`);
          sessionEntity.markError(
            aiErr?.message || 'Falha ao contactar o serviço de IA do professor.'
          );
        }
        applicationTelemetry.endSpan(span, false, { error: aiErr?.message });
      }

      await this.persistPendingSnapshot(sessionEntity);
      return this.toSessionDTO(sessionEntity);
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }

  /**
   * Sends a student utterance into the conversation session and obtains
   * the teacher's response from AI Runtime.
   */
  public async sendStudentMessage(
    command: SendStudentMessageCommand
  ): Promise<{
    session: ConversationSessionDTO;
    teacherMessage?: ConversationMessage;
  }> {
    const session = this.activeSessions.get(command.sessionId);
    if (!session) {
      throw new Error(`Session with ID "${command.sessionId}" was not found.`);
    }

    if (session.state === 'AI_NOT_CONFIGURED') {
      return {
        session: this.toSessionDTO(session),
      };
    }

    const trimmedInput = command.studentUtterance.trim();
    if (!trimmedInput) {
      return { session: this.toSessionDTO(session) };
    }

    const span = applicationTelemetry.startSpan('LessonConversationUseCase.sendStudentMessage', {
      sessionId: command.sessionId,
    });

    // 1. Record student utterance
    session.addStudentMessage(trimmedInput);
    session.setState('loading');

    // 2. Prepare context
    const studentProfile = await this.studentProfileSyncService.getProfile(session.studentId);
    const studentContext: StudentMinimalContextDTO = {
      studentId: studentProfile.id,
      name: studentProfile.name,
      nativeLanguage: studentProfile.nativeLanguage || 'pt',
      targetLanguage: session.targetLanguage,
      cefrLevel: session.cefrLevel,
      learningGoals: [
        studentProfile.objectives?.primaryMotivation,
        studentProfile.objectives?.currentFocus,
      ].filter(Boolean) as string[],
      currentFocus: studentProfile.objectives?.currentFocus,
      correctionStrictness:
        (studentProfile.preferences?.correctionStrictness as any) || 'balanced',
      preferredTeacherPersona: session.teacherPersona,
    };

    const lessonContext: LessonSessionContextDTO = {
      lessonId: session.lessonId,
      topic: session.topic,
      targetLanguage: session.targetLanguage,
      nativeLanguage: session.nativeLanguage,
      cefrLevel: session.cefrLevel,
      learningObjective: session.objective,
      teacherPersona: session.teacherPersona,
      conversationHistory: session.messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      })),
    };

    const promptData = conversationPromptBuilder.buildTurnPrompt(
      studentContext,
      lessonContext,
      trimmedInput
    );

    // 3. Call AI Runtime via safe client proxy
    try {
      let teacherResponseText = '';

      if (command.onStreamChunk && this.aiClientCaller?.stream) {
        const res = await this.aiClientCaller.stream(
          {
            prompt: promptData.prompt,
            systemInstruction: promptData.systemInstruction,
            temperature: 0.7,
            maxTokens: 300,
            sessionId: session.id,
            studentId: session.studentId,
          },
          (chunk) => {
            if (chunk.delta && command.onStreamChunk) {
              command.onStreamChunk(chunk.delta);
            }
          }
        );
        teacherResponseText = res.content;
      } else if (command.onStreamChunk) {
        const res = await streamAiText(
          {
            prompt: promptData.prompt,
            systemInstruction: promptData.systemInstruction,
            temperature: 0.7,
            maxTokens: 300,
            sessionId: session.id,
            studentId: session.studentId,
          },
          (chunk) => {
            if (chunk.delta && command.onStreamChunk) {
              command.onStreamChunk(chunk.delta);
            }
          }
        );
        teacherResponseText = res.content;
      } else {
        const generateFn = this.aiClientCaller?.generate || generateAiText;
        const res = await generateFn({
          prompt: promptData.prompt,
          systemInstruction: promptData.systemInstruction,
          temperature: 0.7,
          maxTokens: 300,
          sessionId: session.id,
          studentId: session.studentId,
        });
        teacherResponseText = res.content;
      }

      const teacherMsg = session.addTeacherMessage(teacherResponseText, {
        type: 'utterance',
      });
      session.setState('active');

      this.logger.info(`Teacher responded to session ${command.sessionId}.`);
      applicationTelemetry.endSpan(span, true);

      await this.persistPendingSnapshot(session);

      return {
        session: this.toSessionDTO(session),
        teacherMessage: teacherMsg,
      };
    } catch (err: any) {
      if (
        (err instanceof AiClientError &&
          (err.status === 503 || err.code === 'AI_PROVIDER_NOT_CONFIGURED')) ||
        err?.message?.includes('AI_PROVIDER_NOT_CONFIGURED') ||
        err?.message?.includes('GEMINI_API_KEY')
      ) {
        session.markAiNotConfigured(
          'O servidor do Fluento não tem a chave GEMINI_API_KEY configurada. O AI Runtime encontra-se desligado em modo seguro.'
        );
      } else {
        this.logger.error(`Error in sendStudentMessage: ${err.message}`);
        session.markError(err.message || 'Erro ao processar resposta do professor.');
      }
      applicationTelemetry.endSpan(span, false, { error: err.message });
      await this.persistPendingSnapshot(session);
      return { session: this.toSessionDTO(session) };
    }
  }

  /**
   * Concludes a lesson session, updates the domain session entity,
   * updates the student profile progress via StudentProfileSyncService,
   * and publishes domain/telemetry events.
   */
  public async completeSession(
    command: CompleteLessonConversationCommand
  ): Promise<LessonSessionSummaryDTO> {
    const session = this.activeSessions.get(command.sessionId);
    const durationSeconds = Math.max(1, command.durationSeconds);
    const durationMinutes = Math.max(1, Math.ceil(durationSeconds / 60));

    const span = applicationTelemetry.startSpan('LessonConversationUseCase.completeSession', {
      sessionId: command.sessionId,
      durationSeconds,
    });

    try {
      const studentId = session ? session.studentId : 'usr_fluento_primary';
      const lessonId = session ? session.lessonId : 'lesson-exec-1';
      const topic = session ? session.topic : 'Negociação Verbal';
      const turnsCount = session ? session.turnsCount : 0;
      const studentMessagesCount = session
        ? session.messages.filter((m) => m.sender === 'student').length
        : 0;
      const studentWordsCount = session ? session.calculateStudentWordsCount() : 0;

      if (session) {
        session.complete();
        try {
          await this.sessionStorageGateway.clearPendingSession(session.studentId, session.lessonId);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          this.logger.warn(`Could not clear pending session storage: ${message}`);
        }
      }

      // 1. Record session in domain session repository
      try {
        const domainSession = SessionEntity.create(SessionId.create(command.sessionId), {
          studentId,
          lessonId,
          teacherId: session?.teacherPersona || 'tch_01',
          state: 'completed',
          turns: [],
          startedAt: TimeStamp.now(),
          endedAt: TimeStamp.now(),
        });
        await this.sessionRepo.save(domainSession);
      } catch (err: any) {
        this.logger.warn(`Could not save domain SessionEntity: ${err.message}`);
      }

      // 2. Synchronize progress in Student Profile via StudentProfileSyncService
      let profileUpdated = false;
      try {
        await this.studentProfileSyncService.recordSessionCompletion(
          studentId,
          durationMinutes,
          0,
          topic
        );
        profileUpdated = true;
      } catch (err: any) {
        this.logger.error(`Failed to update student profile progress: ${err.message}`);
      }

      // 3. Publish application event
      await this.eventPublisher.publish(
        new SessionCompletedEvent(command.sessionId, {
          sessionId: command.sessionId,
          studentId,
          durationMinutes,
        })
      );

      const summary: LessonSessionSummaryDTO = {
        sessionId: command.sessionId,
        lessonId,
        studentId,
        topic,
        durationSeconds,
        durationMinutes,
        turnsCount,
        studentMessagesCount,
        studentWordsCount,
        evaluationAvailable: false,
        evaluationStatus: 'NOT_AVAILABLE',
        overallScore: null,
        completedAtIso: new Date().toISOString(),
        profileUpdated,
      };

      this.logger.info(`Session ${command.sessionId} completed successfully.`);
      applicationTelemetry.endSpan(span, true);

      return summary;
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }

  /**
   * Retrieves an active conversation session by ID.
   */
  public getSession(sessionId: string): ConversationSessionDTO | null {
    const session = this.activeSessions.get(sessionId);
    return session ? this.toSessionDTO(session) : null;
  }

  private toSessionDTO(entity: ConversationSessionEntity): ConversationSessionDTO {
    const data: ConversationSessionData = entity.toData();
    return {
      sessionId: data.sessionId,
      lessonId: data.lessonId,
      studentId: data.studentId,
      targetLanguage: data.targetLanguage,
      nativeLanguage: data.nativeLanguage,
      cefrLevel: data.cefrLevel,
      teacherPersona: data.teacherPersona,
      topic: data.topic,
      objective: data.objective,
      messages: data.messages,
      state: data.state,
      startedAtIso: data.startedAtIso,
      updatedAtIso: data.updatedAtIso,
      completedAtIso: data.completedAtIso,
      turnsCount: data.turnsCount,
      aiConfigured: data.aiConfigured,
      errorMessage: data.errorMessage,
      overallScore: data.overallScore,
    };
  }
}
