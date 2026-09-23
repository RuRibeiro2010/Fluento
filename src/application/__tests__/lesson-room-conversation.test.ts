import { LessonConversationUseCase } from '../use-cases/lesson-conversation.use-cases';
import { LessonRoomAdapter } from '../adapters/lesson-room.adapter';
import { StudentProfileSyncService } from '../services/student-profile-sync.service';
import { LocalStorageStudentProfileGateway } from '../adapters/storage/local-storage-student-profile.gateway';
import { LocalStorageDigitalTwinGateway } from '../adapters/storage/local-storage-digital-twin.gateway';
import { LocalStorageConversationSessionGateway } from '../adapters/storage/local-storage-conversation-session.gateway';
import { conversationPromptBuilder } from '../services/conversation-prompt-builder.service';
import {
  InMemorySessionRepository,
  InMemoryLessonRepository,
  InMemoryStudentRepository,
} from '../adapters/storage/in-memory';
import { FakeEventPublisher, FakeLogger } from '../adapters/infrastructure';
import { LessonEntity } from '../../domain/lesson/entities/lesson.entity';
import { LessonId } from '../../domain/lesson/value-objects/lesson-id.vo';
import { CEFRLevel } from '../../domain/shared/value-objects/cefr-level.vo';
import { LessonStatus } from '../../domain/lesson/value-objects/lesson-status.vo';
import { LessonObjective } from '../../domain/lesson/value-objects/lesson-objective.vo';
import { TimeStamp } from '../../domain/shared/value-objects/time-stamp.vo';
import { SessionId } from '../../domain/session/value-objects/session-id.vo';
import { ConversationSessionData } from '../../domain/session/entities/conversation-session.entity';
import { AiClientError } from '../../lib/api/ai-client';
import { ModelRequest, ModelResponse, StreamChunk } from '../../lib/ai-runtime/types';

export async function runLessonRoomConversationTests(): Promise<{ passed: boolean; logs: string[] }> {
  const logs: string[] = [];
  const log = (msg: string) => logs.push(`[TEST-16A.4] ${msg}`);

  try {
    log('Starting Sprint 16A.4 Lesson Room & AI Conversation Engine Integration Tests...');

    // Setup Test Environment
    const sessionRepo = new InMemorySessionRepository();
    const lessonRepo = new InMemoryLessonRepository();
    const studentRepo = new InMemoryStudentRepository();
    const storageGateway = new LocalStorageStudentProfileGateway();
    const digitalTwinGateway = new LocalStorageDigitalTwinGateway();
    storageGateway.clearMemory();
    digitalTwinGateway.clearMemory();
    const eventPublisher = new FakeEventPublisher();
    const logger = new FakeLogger();

    const syncService = new StudentProfileSyncService(storageGateway, digitalTwinGateway, studentRepo, eventPublisher);

    // Pre-seed a test student with custom goals and preferences
    await syncService.updateProfile('std_test_exec', {
      name: 'Dr. Fernando Lima',
      currentLevel: 'B2',
      targetLanguages: ['es'],
      nativeLanguage: 'pt',
      objectives: {
        primaryMotivation: 'Conduzir reuniões de diretoria e negociação internacional',
        currentFocus: 'Pitching Executivo & Contratos',
      },
      preferences: {
        dailyGoalMinutes: 15,
        weeklyGoalMinutes: 60,
        pace: 'moderate',
        preferredTeacherPersona: 'Prof. Sofia',
        correctionStrictness: 'balanced',
      },
    });

    // Pre-seed test lesson
    const testLesson = LessonEntity.create(LessonId.create('lesson-test-negotiation'), {
      title: 'Negociação Internacional de Fusões',
      cefrLevel: CEFRLevel.create('B2'),
      status: LessonStatus.create('available'),
      estimatedMinutes: 20,
      topicTag: 'Negociação Executiva',
      objective: LessonObjective.create({
        title: 'Fecho de Parcerias Estratégicas',
        description: 'Negociar termos contratuais com vocabulário diplomático e persuasivo.',
        keyCompetencies: ['persuasao', 'vocabulario_juridico_comercial'],
        targetSkill: 'speaking',
      }),
      createdAt: TimeStamp.now(),
      updatedAt: TimeStamp.now(),
    });
    await lessonRepo.save(testLesson);

    // =========================================================================
    // 1. Context Construction (Minimal context without raw twin leak)
    // =========================================================================
    log('1. Testing Pedagogical Context Construction...');
    const studentProfile = await syncService.getProfile('std_test_exec');
    const minimalStudentCtx = {
      studentId: studentProfile.id,
      name: studentProfile.name,
      nativeLanguage: studentProfile.nativeLanguage,
      targetLanguage: studentProfile.targetLanguages[0],
      cefrLevel: studentProfile.currentLevel,
      learningGoals: [
        studentProfile.objectives?.primaryMotivation,
        studentProfile.objectives?.currentFocus,
      ].filter(Boolean) as string[],
      currentFocus: studentProfile.objectives?.currentFocus,
      correctionStrictness: 'balanced' as const,
      preferredTeacherPersona: 'Prof. Sofia',
    };

    const lessonCtx = {
      lessonId: testLesson.id,
      topic: testLesson.title,
      targetLanguage: 'es',
      nativeLanguage: 'pt',
      cefrLevel: 'B2',
      learningObjective: testLesson.objective.description,
      teacherPersona: 'Prof. Sofia',
      conversationHistory: [],
    };

    const greetingPrompt = conversationPromptBuilder.buildGreetingPrompt(
      minimalStudentCtx,
      lessonCtx
    );

    if (!greetingPrompt.systemInstruction.includes('Prof. Sofia')) {
      throw new Error('System instruction must include teacher persona');
    }
    if (!greetingPrompt.systemInstruction.includes('B2')) {
      throw new Error('System instruction must include student CEFR level');
    }
    if (!greetingPrompt.prompt.includes('Negociação Internacional de Fusões')) {
      throw new Error('Prompt must include lesson topic');
    }
    log('✓ Pedagogical context correctly built with minimal, targeted student profile data');

    // =========================================================================
    // 2. Session Creation with Successful AI Runtime Greeting
    // =========================================================================
    log('2. Testing Session Creation with AI Runtime...');

    // Mock successful AI call
    const mockAiSuccess = {
      generate: async (req: ModelRequest): Promise<ModelResponse> => {
        return {
          requestId: 'req_success_1',
          content: '¡Buenos días, Dr. Fernando! Bienvenido a nuestra sesión de negociación. ¿Cómo estructuraría los primeros puntos de la alianza comercial?',
          provider: 'gemini',
          modelName: 'gemini-3.6-flash',
          promptTokens: 120,
          completionTokens: 35,
          totalTokens: 155,
          estimatedCostUsd: 0.0001,
          latencyMs: 180,
          fallbackOccurred: false,
          attempts: 1,
          timestampIso: new Date().toISOString(),
        };
      },
      stream: async (req: ModelRequest, onChunk: (chunk: StreamChunk) => void): Promise<ModelResponse> => {
        const text = 'Excelente propuesta. Continuemos.';
        onChunk({ requestId: 'r1', delta: text, done: true, provider: 'gemini', modelName: 'gemini-3.6-flash' });
        return {
          requestId: 'r1',
          content: text,
          provider: 'gemini',
          modelName: 'gemini-3.6-flash',
          promptTokens: 100,
          completionTokens: 10,
          totalTokens: 110,
          estimatedCostUsd: 0,
          latencyMs: 50,
          fallbackOccurred: false,
          attempts: 1,
          timestampIso: new Date().toISOString(),
        };
      },
    };

    const conversationSessionGateway = new LocalStorageConversationSessionGateway();
    
    // Mock successful AI Service
    const mockAiServiceSuccess = {
      generateGreeting: async (): Promise<string> => {
        return '¡Buenos días, Dr. Fernando! Bienvenido a nuestra sessão de negociação. ¿Cómo estruturaria los primeiros pontos de la alianza comercial?';
      },
      generateResponse: async (
        _s: any,
        _l: any,
        _u: string,
        _sid: string,
        onStreamChunk?: (delta: string) => void
      ): Promise<string> => {
        const text = 'Excelente propuesta. Continuemos.';
        if (onStreamChunk) {
          onStreamChunk(text);
        }
        return text;
      },
    };

    const conversationUseCase = new LessonConversationUseCase(
      sessionRepo,
      lessonRepo,
      studentRepo,
      syncService,
      eventPublisher,
      logger,
      conversationSessionGateway,
      mockAiServiceSuccess as any
    );
    const roomAdapter = new LessonRoomAdapter(conversationUseCase);

    const initialSession = await roomAdapter.startSession({
      studentId: 'std_test_exec',
      lessonId: 'lesson-test-negotiation',
    });

    if (initialSession.state !== 'active') {
      throw new Error(`Expected session state 'active', got ${initialSession.state}`);
    }
    if (initialSession.messages.length !== 1) {
      throw new Error(`Expected 1 initial message, got ${initialSession.messages.length}`);
    }
    if (initialSession.messages[0].sender !== 'teacher') {
      throw new Error(`Expected sender 'teacher', got ${initialSession.messages[0].sender}`);
    }
    if (!initialSession.messages[0].text.includes('Buenos días')) {
      throw new Error('Teacher greeting message content mismatch');
    }
    log('✓ Session started successfully with AI greeting');

    // =========================================================================
    // 3. Sending Student Utterance & Receiving Teacher Response
    // =========================================================================
    log('3. Testing Sending Student Message & AI response...');
    const turnResult = await roomAdapter.sendStudentMessage(
      initialSession.sessionId,
      'Propondría empezar con un acordo de confidencialidade mútuo antes de revelar os dados financeiros.'
    );

    if (turnResult.session.messages.length !== 3) {
      throw new Error(`Expected 3 messages (greeting, student, teacher), got ${turnResult.session.messages.length}`);
    }
    if (turnResult.session.turnsCount !== 1) {
      throw new Error(`Expected 1 student turn, got ${turnResult.session.turnsCount}`);
    }
    const lastTeacherMsg = turnResult.session.messages[2];
    if (lastTeacherMsg.sender !== 'teacher') {
      throw new Error('Last message must be from teacher');
    }
    log('✓ Student utterance processed and teacher response appended to conversation');

    // =========================================================================
    // 3.5. Session Persistence & Resume After Reload (Sprint 16A.5)
    // =========================================================================
    log('3.5. Testing Session Persistence & Resume After Simulated Browser Reload...');

    // Simulate a page reload: a brand new LessonConversationUseCase instance
    // (fresh in-memory activeSessions Map, exactly like a fresh page load
    // would produce), but sharing the SAME conversationSessionGateway - the
    // one thing a real reload leaves behind (the browser's localStorage).
    let resumeAiCalled = false;
    const mockAiServiceShouldNotBeCalled = {
      generateGreeting: async (): Promise<string> => {
        resumeAiCalled = true;
        throw new Error('AI must not be called when resuming an existing pending session');
      },
      generateResponse: async (): Promise<string> => {
        resumeAiCalled = true;
        throw new Error('AI must not be called when resuming an existing pending session');
      },
    };

    const reloadedUseCase = new LessonConversationUseCase(
      sessionRepo,
      lessonRepo,
      studentRepo,
      syncService,
      eventPublisher,
      logger,
      conversationSessionGateway, // same gateway = same "localStorage" surviving the reload
      mockAiServiceShouldNotBeCalled as any
    );
    const reloadedAdapter = new LessonRoomAdapter(reloadedUseCase);

    const resumedSession = await reloadedAdapter.startSession({
      studentId: 'std_test_exec',
      lessonId: 'lesson-test-negotiation',
    });

    if (resumedSession.sessionId !== initialSession.sessionId) {
      throw new Error(
        `Expected resumed session to keep sessionId ${initialSession.sessionId}, got ${resumedSession.sessionId}`
      );
    }
    if (resumedSession.messages.length !== turnResult.session.messages.length) {
      throw new Error(
        `Expected resumed session to keep ${turnResult.session.messages.length} messages, got ${resumedSession.messages.length}`
      );
    }
    if (resumedSession.turnsCount !== turnResult.session.turnsCount) {
      throw new Error('Expected resumed session to keep the same turn count as before the reload');
    }
    if (resumeAiCalled) {
      throw new Error('Resuming a pending session must not trigger a new AI greeting call');
    }
    log('✓ Pending session correctly restored after simulated reload, with no new AI call');

    // Corrupted/invalid stored data must be ignored safely, never crash startup
    const corruptedSnapshot: ConversationSessionData = {
      ...resumedSession,
      messages: [...resumedSession.messages],
      sessionId: 'sess_corrupted_test',
      studentId: 'std_test_corrupted',
      startedAtIso: 'not-a-valid-date',
      updatedAtIso: 'not-a-valid-date',
    };
    await conversationSessionGateway.savePendingSession(corruptedSnapshot);

    let corruptedRecoveryAiCalled = false;
    const mockAiServiceForCorruptedRecovery = {
      generateGreeting: async (): Promise<string> => {
        corruptedRecoveryAiCalled = true;
        return 'Bienvenido, empecemos una nueva sessão de prática.';
      },
      generateResponse: async (): Promise<string> => {
        return 'Continuemos.';
      },
    };

    const recoveryUseCase = new LessonConversationUseCase(
      sessionRepo,
      lessonRepo,
      studentRepo,
      syncService,
      eventPublisher,
      logger,
      conversationSessionGateway,
      mockAiServiceForCorruptedRecovery as any
    );
    const recoveryAdapter = new LessonRoomAdapter(recoveryUseCase);

    const recoveredSession = await recoveryAdapter.startSession({
      studentId: 'std_test_corrupted',
      lessonId: 'lesson-test-negotiation',
    });

    if (recoveredSession.sessionId === 'sess_corrupted_test') {
      throw new Error('A corrupted stored session must never be restored as-is');
    }
    if (!corruptedRecoveryAiCalled) {
      throw new Error('A fresh session should start (and greet via AI) when stored data is corrupted');
    }
    if (recoveredSession.state !== 'active') {
      throw new Error(
        `Expected fresh session state 'active' after safely ignoring corrupted data, got ${recoveredSession.state}`
      );
    }
    log('✓ Corrupted pending session data safely ignored; a fresh session was created instead');

    // =========================================================================
    // 4. State AI_NOT_CONFIGURED Handling (503 without Gemini API Key)
    // =========================================================================
    log('4. Testing AI_NOT_CONFIGURED State (503 GEMINI_API_KEY Missing)...');

    const mockAiServiceUnconfigured = {
      generateGreeting: async (): Promise<string> => {
        throw new Error('AI_PROVIDER_NOT_CONFIGURED (GEMINI_API_KEY missing)');
      },
      generateResponse: async (): Promise<string> => {
        throw new Error('AI_PROVIDER_NOT_CONFIGURED (GEMINI_API_KEY missing)');
      },
    };

    const unconfiguredUseCase = new LessonConversationUseCase(
      sessionRepo,
      lessonRepo,
      studentRepo,
      syncService,
      eventPublisher,
      logger,
      new LocalStorageConversationSessionGateway(),
      mockAiServiceUnconfigured as any
    );
    const unconfiguredAdapter = new LessonRoomAdapter(unconfiguredUseCase);

    const unconfiguredSession = await unconfiguredAdapter.startSession({
      studentId: 'std_test_exec',
      lessonId: 'lesson-test-negotiation',
    });

    if (unconfiguredSession.state !== 'AI_NOT_CONFIGURED') {
      throw new Error(`Expected state 'AI_NOT_CONFIGURED', got ${unconfiguredSession.state}`);
    }
    if (unconfiguredSession.aiConfigured !== false) {
      throw new Error('Expected aiConfigured to be false');
    }
    if (!unconfiguredSession.errorMessage?.includes('GEMINI_API_KEY')) {
      throw new Error('Error message should mention GEMINI_API_KEY');
    }
    log('✓ Clean AI_NOT_CONFIGURED state detected and enforced without fake responses or setTimeout');

    // =========================================================================
    // 5. Provider Error Handling (Graceful Capture without crash)
    // =========================================================================
    log('5. Testing Provider Error Handling (500 internal failure)...');

    const mockAiServiceInternalError = {
      generateGreeting: async (): Promise<string> => {
        throw new Error('Temporary upstream network timeout');
      },
      generateResponse: async (): Promise<string> => {
        throw new Error('Temporary upstream network timeout');
      },
    };

    const errorUseCase = new LessonConversationUseCase(
      sessionRepo,
      lessonRepo,
      studentRepo,
      syncService,
      eventPublisher,
      logger,
      new LocalStorageConversationSessionGateway(),
      mockAiServiceInternalError as any
    );
    const errorAdapter = new LessonRoomAdapter(errorUseCase);

    const errorSession = await errorAdapter.startSession({
      studentId: 'std_test_exec',
      lessonId: 'lesson-test-negotiation',
    });

    if (errorSession.state !== 'error') {
      throw new Error(`Expected state 'error', got ${errorSession.state}`);
    }
    log('✓ Provider errors captured gracefully in session state');

    // =========================================================================
    // 6. Session Completion & Progress Synchronization
    // =========================================================================
    log('6. Testing Lesson Completion & Student Profile Synchronization...');

    const stateBefore = await syncService.getSynchronizedState('std_test_exec');
    const sessionsBefore = stateBefore.digitalTwin.progress.completedSessionsCount;
    const minutesBefore = stateBefore.digitalTwin.progress.completedMinutesThisWeek;

    const summary = await roomAdapter.completeSession(initialSession.sessionId, 600); // 10 minutes (600s)

    if (summary.durationMinutes !== 10) {
      throw new Error(`Expected 10 minutes duration, got ${summary.durationMinutes}`);
    }
    if (summary.durationSeconds !== 600) {
      throw new Error(`Expected 600 seconds duration, got ${summary.durationSeconds}`);
    }
    if (summary.studentMessagesCount !== 1) {
      throw new Error(`Expected 1 student message, got ${summary.studentMessagesCount}`);
    }
    if (summary.studentWordsCount !== 14) {
      throw new Error(`Expected 14 student words, got ${summary.studentWordsCount}`);
    }
    if (summary.evaluationAvailable !== false) {
      throw new Error('Expected evaluationAvailable to be false');
    }
    if (summary.evaluationStatus !== 'NOT_AVAILABLE') {
      throw new Error(`Expected evaluationStatus NOT_AVAILABLE, got ${summary.evaluationStatus}`);
    }
    if (summary.overallScore !== null) {
      throw new Error(`Expected overallScore null (no simulated score), got ${summary.overallScore}`);
    }
    if (!summary.profileUpdated) {
      throw new Error('Expected profileUpdated to be true');
    }

    // Verify Student Profile and Digital Twin were updated via StudentProfileSyncService
    const stateAfter = await syncService.getSynchronizedState('std_test_exec');
    const profileAfter = stateAfter.profile;
    const twinAfter = stateAfter.digitalTwin;

    if (twinAfter.progress.completedSessionsCount !== sessionsBefore + 1) {
      throw new Error(
        `Expected completedSessionsCount to increment to ${sessionsBefore + 1}, got ${twinAfter.progress.completedSessionsCount}`
      );
    }
    if (twinAfter.progress.completedMinutesThisWeek !== minutesBefore + 10) {
      throw new Error(
        `Expected completedMinutesThisWeek to increase by 10, got ${twinAfter.progress.completedMinutesThisWeek}`
      );
    }
    log('✓ Session completion atomically updated Digital Twin progress');

    // =========================================================================
    // 6.5. Pending Session Cleared After Completion (Sprint 16A.5)
    // =========================================================================
    log('6.5. Testing Pending Session Is Cleared After Completion...');

    let postCompletionAiCalled = false;
    const mockAiServiceAfterCompletion = {
      generateGreeting: async (): Promise<string> => {
        postCompletionAiCalled = true;
        return 'Bienvenido de nuevo, comencemos una nueva sessão de prática.';
      },
      generateResponse: async (): Promise<string> => {
        return 'Vamos empezar.';
      },
    };

    const postCompletionUseCase = new LessonConversationUseCase(
      sessionRepo,
      lessonRepo,
      studentRepo,
      syncService,
      eventPublisher,
      logger,
      conversationSessionGateway, // same "localStorage" used by the completed session
      mockAiServiceAfterCompletion as any
    );
    const postCompletionAdapter = new LessonRoomAdapter(postCompletionUseCase);

    const postCompletionSession = await postCompletionAdapter.startSession({
      studentId: 'std_test_exec',
      lessonId: 'lesson-test-negotiation',
    });

    if (postCompletionSession.sessionId === initialSession.sessionId) {
      throw new Error('A completed session must never be resumed - expected a brand new sessionId');
    }
    if (!postCompletionAiCalled) {
      throw new Error('Starting a session after the previous one completed should greet via AI as normal');
    }
    log('✓ Completed session pending state was cleared; a fresh session starts normally afterwards');

    // =========================================================================
    // 7. Security Audit (No sensitive credentials in client structures)
    // =========================================================================
    log('7. Verifying Security & Secrets Isolation...');
    const sessionJson = JSON.stringify(turnResult.session);
    if (sessionJson.includes('AI_KEY') || sessionJson.includes('secret') || sessionJson.includes('bearer')) {
      throw new Error('Sensitive credentials detected in conversation session JSON');
    }
    log('✓ Zero sensitive credentials or tokens exposed in conversation structures');

    log('=======================================================');
    log('ALL SPRINT 16A.4 TESTS PASSED SUCCESSFULLY! ✓');
    log('=======================================================');

    return { passed: true, logs };
  } catch (err: any) {
    log(`❌ TEST SUITE FAILED: ${err.message}`);
    return { passed: false, logs };
  }
}
