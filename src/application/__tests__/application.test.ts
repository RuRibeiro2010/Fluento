import {
  InMemoryStudentRepository,
  InMemoryLessonRepository,
  InMemorySessionRepository,
  InMemoryStudyPlanRepository,
  InMemoryAnalyticsRepository,
  InMemorySubscriptionRepository,
  InMemoryMemoryRepository,
} from '../adapters/storage/in-memory';
import { FakeEventPublisher, FakeLogger } from '../adapters/infrastructure';
import { FakeAiProviderPort, createSampleStudent, createSampleLesson } from './fixtures';

import { StartLessonUseCase, FinishLessonUseCase } from '../use-cases/lesson.use-cases';
import { StartSessionUseCase, FinishSessionUseCase, ContinueConversationUseCase } from '../use-cases/session.use-cases';
import { CreateStudyPlanUseCase, ReviewVocabularyUseCase, PlacementAssessmentUseCase } from '../use-cases/learning.use-cases';
import { GenerateAnalyticsUseCase } from '../use-cases/analytics.use-cases';
import { UpgradeSubscriptionUseCase } from '../use-cases/billing.use-cases';
import { GeneratePromptUseCase } from '../use-cases/ai.use-cases';
import { SyncStudentDigitalTwinUseCase } from '../use-cases/student.use-cases';
import { ExecuteLessonPipelineUseCase } from '../use-cases/pipeline.use-case';

import { ApplicationQueryHandlers } from '../queries/query-handlers';
import { MemoryFactory } from '../../domain/memory/factories/memory.factory';
import { applicationTelemetry } from '../telemetry/telemetry.service';

export async function runApplicationLayerTests(): Promise<{ passed: boolean; logs: string[] }> {
  const logs: string[] = [];
  const log = (msg: string) => logs.push(`[TEST] ${msg}`);

  try {
    log('Initializing Test Repositories & Utilities...');
    const studentRepo = new InMemoryStudentRepository();
    const lessonRepo = new InMemoryLessonRepository();
    const sessionRepo = new InMemorySessionRepository();
    const studyPlanRepo = new InMemoryStudyPlanRepository();
    const analyticsRepo = new InMemoryAnalyticsRepository();
    const subscriptionRepo = new InMemorySubscriptionRepository();
    const memoryRepo = new InMemoryMemoryRepository();

    const aiPort = new FakeAiProviderPort();
    const eventPublisher = new FakeEventPublisher();
    const logger = new FakeLogger();

    // Seed initial data
    const student = createSampleStudent('std_001');
    const lesson = createSampleLesson('lsn_001', 'tch_001');
    await studentRepo.save(student);
    await lessonRepo.save(lesson);

    log('1. Testing StartLessonUseCase & FinishLessonUseCase...');
    const startLessonUC = new StartLessonUseCase(lessonRepo, studentRepo, eventPublisher, logger);
    const finishLessonUC = new FinishLessonUseCase(lessonRepo, eventPublisher, logger);

    const startedLessonDTO = await startLessonUC.execute({ lessonId: 'lsn_001', studentId: 'std_001' });
    if (startedLessonDTO.status !== 'in_progress') throw new Error('Lesson status failed to change to in_progress');

    const finishedLessonDTO = await finishLessonUC.execute({ lessonId: 'lsn_001', studentId: 'std_001', finalScore: 95 });
    if (finishedLessonDTO.status !== 'completed') throw new Error('Lesson status failed to change to completed');

    log('2. Testing Session UseCases & AI Conversation...');
    const startSessionUC = new StartSessionUseCase(sessionRepo, lessonRepo, studentRepo, subscriptionRepo, eventPublisher, logger);
    const finishSessionUC = new FinishSessionUseCase(sessionRepo, eventPublisher, logger);
    const continueConvUC = new ContinueConversationUseCase(sessionRepo, aiPort, logger);

    const sessionDTO = await startSessionUC.execute({ lessonId: 'lsn_001', studentId: 'std_001' });
    if (!sessionDTO.active) throw new Error('New session should be active');

    const turnResult = await continueConvUC.execute({ sessionId: sessionDTO.id, userUtteranceText: 'Hola, buenas tardes.' });
    if (!turnResult.aiText) throw new Error('AI response text was empty');
    if (turnResult.session.turnCount !== 1) throw new Error('Session turn count failed to increment');

    await finishSessionUC.execute({ sessionId: sessionDTO.id });

    log('3. Testing Study Plan, Memory & Vocabulary Review UseCases...');
    const createPlanUC = new CreateStudyPlanUseCase(studyPlanRepo, studentRepo, logger);
    const reviewWordUC = new ReviewVocabularyUseCase(memoryRepo, eventPublisher, logger);
    const placementUC = new PlacementAssessmentUseCase(studentRepo, logger);

    const planDTO = await createPlanUC.execute({ studentId: 'std_001', primaryObjective: 'Apresentação executiva em Espanhol' });
    if (planDTO.missions.length === 0) throw new Error('Default study plan missions were empty');

    const wordEntity = MemoryFactory.createNewTrackedWord('std_001', 'sin embargo', 'no entanto', 'conectores');
    await memoryRepo.saveWord(wordEntity);

    const reviewDTO = await reviewWordUC.execute({ studentId: 'std_001', wordId: wordEntity.id, qualityScore: 5 });
    if (reviewDTO.repetitions !== 1) throw new Error('SRS repetitions failed to increment on quality score 5');

    const placementRes = await placementUC.execute({
      studentId: 'std_001',
      assessmentAnswers: [
        { questionId: 'q1', answerText: 'Hablo fluído' },
        { questionId: 'q2', answerText: 'Comprendo rápido' },
        { questionId: 'q3', answerText: 'Escribo correos' },
        { questionId: 'q4', answerText: 'Uso subjuntivo' },
      ],
    });
    if (placementRes.assessedLevel !== 'B2') throw new Error('Placement score assessment mismatch');

    log('4. Testing Analytics, Billing, AI Prompt & Digital Twin UseCases...');
    const analyticsUC = new GenerateAnalyticsUseCase(analyticsRepo, eventPublisher, logger);
    const billingUC = new UpgradeSubscriptionUseCase(subscriptionRepo, eventPublisher, logger);
    const promptUC = new GeneratePromptUseCase(logger);
    const digitalTwinUC = new SyncStudentDigitalTwinUseCase(studentRepo, eventPublisher, logger);

    const analyticsDTO = await analyticsUC.execute('std_001');
    if (!analyticsDTO.fluencyIndex) throw new Error('Analytics fluency index is missing');

    const subDTO = await billingUC.execute({ studentId: 'std_001', targetPlanTier: 'pro' });
    if (subDTO.planTier !== 'pro') throw new Error('Subscription failed to upgrade to pro');

    const promptDTO = await promptUC.execute('Prof. Sofia', 'B2');
    if (!promptDTO.fullSystemPrompt.includes('Prof. Sofia')) throw new Error('System prompt missing teacher name');

    const twinDTO = await digitalTwinUC.execute('std_001');
    if (twinDTO.id !== 'std_001') throw new Error('Digital twin DTO ID mismatch');

    log('5. Testing ExecuteLessonPipelineUseCase Orchestration...');
    const pipelineUC = new ExecuteLessonPipelineUseCase(
      startLessonUC,
      startSessionUC,
      finishSessionUC,
      finishLessonUC,
      analyticsUC,
      logger
    );

    const pipelineRes = await pipelineUC.execute({
      studentId: 'std_001',
      lessonId: 'lsn_001',
      simulatedScore: 88,
    });
    if (!pipelineRes.lesson || !pipelineRes.session || !pipelineRes.analytics) {
      throw new Error('Pipeline execution result incomplete');
    }

    log('6. Testing Application Query Handlers...');
    const queryHandlers = new ApplicationQueryHandlers(
      studentRepo,
      lessonRepo,
      sessionRepo,
      studyPlanRepo,
      analyticsRepo,
      subscriptionRepo,
      memoryRepo
    );

    const dashboard = await queryHandlers.getDashboard({ studentId: 'std_001' });
    if (dashboard.student.id !== 'std_001') throw new Error('Dashboard query student mismatch');
    if (dashboard.subscription.planTier !== 'pro') throw new Error('Dashboard subscription query mismatch');

    log('7. Verifying Telemetry Spans & Events...');
    const spans = applicationTelemetry.getSpans();
    if (spans.length === 0) throw new Error('Telemetry spans were not recorded');
    if (eventPublisher.publishedEvents.length === 0) throw new Error('Application events were not published');

    log('ALL APPLICATION LAYER TESTS PASSED SUCCESSFULLY!');
    return { passed: true, logs };
  } catch (err: any) {
    log(`TEST FAILED: ${err.message}`);
    return { passed: false, logs };
  }
}
