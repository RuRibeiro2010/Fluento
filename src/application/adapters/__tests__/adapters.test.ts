import {
  InMemoryStudentRepository,
  InMemoryLessonRepository,
  InMemorySessionRepository,
  InMemoryStudyPlanRepository,
  InMemoryAnalyticsRepository,
  InMemorySubscriptionRepository,
  InMemoryMemoryRepository,
} from '../storage/in-memory';
import { createSampleStudent, createSampleLesson } from '../../__tests__/fixtures';

import { ApplicationQueryHandlers } from '../../queries/query-handlers';
import { DashboardAdapter, DashboardViewModelDTO } from '../dashboard.adapter';
import { StudentProfileAdapter } from '../student.adapter';
import { LearningProgressAdapter } from '../learning.adapter';
import { LocalStorageStudentProfileGateway } from '../storage/local-storage-student-profile.gateway';
import { LocalStorageDigitalTwinGateway } from '../storage/local-storage-digital-twin.gateway';
import { StudentProfileSyncService } from '../../services/student-profile-sync.service';
import { ApplicationContainer } from '../application-container';
import { MemoryFactory } from '../../../domain/memory/factories/memory.factory';
import { StudyPlanFactory } from '../../../domain/learning/factories/study-plan.factory';
import { AnalyticsFactory } from '../../../domain/analytics/factories/analytics.factory';
import { SubscriptionFactory } from '../../../domain/billing/factories/subscription.factory';

export async function runAdapterLayerTests(): Promise<{ passed: boolean; logs: string[] }> {
  const logs: string[] = [];
  const log = (msg: string) => logs.push(`[ADAPTER-TEST] ${msg}`);

  try {
    log('1. Initializing repositories and query handlers...');
    const studentRepo = new InMemoryStudentRepository();
    const lessonRepo = new InMemoryLessonRepository();
    const sessionRepo = new InMemorySessionRepository();
    const studyPlanRepo = new InMemoryStudyPlanRepository();
    const analyticsRepo = new InMemoryAnalyticsRepository();
    const subscriptionRepo = new InMemorySubscriptionRepository();
    const memoryRepo = new InMemoryMemoryRepository();

    const student = createSampleStudent('std_unit_01');
    const lesson = createSampleLesson('lsn_unit_01', 'tch_01');
    await studentRepo.save(student);
    await lessonRepo.save(lesson);

    const plan = StudyPlanFactory.createDefaultPlanForStudent('std_unit_01', 'Negociação Comercial');
    await studyPlanRepo.save(plan);

    const analytics = AnalyticsFactory.createDefaultAnalytics('std_unit_01');
    await analyticsRepo.save(analytics);

    const sub = SubscriptionFactory.createFreeSubscription('std_unit_01');
    await subscriptionRepo.save(sub);

    const word = MemoryFactory.createNewTrackedWord('std_unit_01', 'desarrollo', 'desenvolvimento', 'negócios');
    await memoryRepo.saveWord(word);

    const studentProfileGateway = new LocalStorageStudentProfileGateway();
    const digitalTwinGateway = new LocalStorageDigitalTwinGateway();
    const eventPublisher = { publish: async () => {} } as any;

    const syncService = new StudentProfileSyncService(
      studentProfileGateway,
      digitalTwinGateway,
      studentRepo,
      eventPublisher
    );

    const queryHandlers = new ApplicationQueryHandlers(
      studentRepo,
      lessonRepo,
      sessionRepo,
      studyPlanRepo,
      analyticsRepo,
      subscriptionRepo,
      memoryRepo
    );

    log('2. Testing ApplicationQueryHandlers directly...');
    const dashboardDTO = await queryHandlers.getDashboard({ studentId: 'std_unit_01' });
    if (dashboardDTO.student.id !== 'std_unit_01') throw new Error('QueryHandler getDashboard student mismatch');
    if (dashboardDTO.recommendedLessons.length === 0) throw new Error('QueryHandler recommended lessons empty');

    const dueVocabDTO = await queryHandlers.getDueVocabulary({ studentId: 'std_unit_01' });
    if (!Array.isArray(dueVocabDTO)) throw new Error('QueryHandler getDueVocabulary failed to return array');

    const profileDTO = await queryHandlers.getStudentProfile({ studentId: 'std_unit_01' });
    if (profileDTO.email !== 'estudante@fluento.app') throw new Error('QueryHandler getStudentProfile email mismatch');

    const studyPlanDTO = await queryHandlers.getStudyPlan({ studentId: 'std_unit_01' });
    if (studyPlanDTO.primaryObjective !== 'Negociação Comercial') throw new Error('QueryHandler getStudyPlan objective mismatch');

    log('3. Testing DashboardAdapter (UI -> Adapter -> QueryHandler -> Domain -> DTO -> UI)...');
    const studentProfileAdapter = new StudentProfileAdapter(queryHandlers, studentRepo, syncService);
    const coachAiService = {
      generateMonthlyEvolutionData: () => ({ milestonesTimeline: [] })
    } as any;
    const dashboardAdapter = new DashboardAdapter(
      queryHandlers,
      studentRepo,
      lessonRepo,
      studyPlanRepo,
      analyticsRepo,
      subscriptionRepo,
      memoryRepo,
      studentProfileAdapter,
      coachAiService
    );

    const vm: DashboardViewModelDTO = await dashboardAdapter.getDashboardViewModel('std_unit_01', {
      native_language: 'pt',
      confidence_score: 82,
      current_focus: 'Negociação Executiva',
    });

    if (vm.source !== 'application_layer') throw new Error('DashboardViewModel source must be application_layer');
    if (vm.isFallback !== false) throw new Error('DashboardViewModel isFallback should be false for valid student');
    if (vm.student.id !== 'std_unit_01') throw new Error('DashboardViewModel student ID mismatch');
    if (vm.metrics.confidenceScore !== 82) throw new Error('DashboardViewModel confidenceScore mismatch');
    if (vm.weeklyCalendar.weeklyGoalMinutes !== 60) throw new Error(`DashboardViewModel weekly goal calculation mismatch: expected 60, got ${vm.weeklyCalendar.weeklyGoalMinutes}`);
    if (vm.subscription.planTier !== 'free') throw new Error('DashboardViewModel subscription planTier mismatch');

    log('4. Testing DashboardAdapter on-the-fly student bootstrap...');
    const bootstrappedVM = await dashboardAdapter.getDashboardViewModel('std_new_user_99', {
      email: 'newuser@fluento.ai',
      current_focus: 'Conversação Geral',
      native_language: 'pt',
      target_languages: ['es'],
    });

    if (bootstrappedVM.source !== 'application_layer') throw new Error('Bootstrapped student should execute via application_layer');
    if (bootstrappedVM.student.id !== 'std_new_user_99') throw new Error('Bootstrapped student ID mismatch');

    log('5. Testing StudentProfileAdapter...');
    const studentAdapter = new StudentProfileAdapter(queryHandlers, studentRepo, syncService);
    const profileVM = await studentAdapter.getProfile('std_unit_01');
    if (profileVM.source !== 'application_layer') throw new Error('StudentProfileAdapter source should be application_layer');
    if (profileVM.nativeLanguage !== 'pt') throw new Error('StudentProfileAdapter nativeLanguage mismatch');

    const fallbackProfileVM = await studentAdapter.getProfile('std_non_existent_999');
    if (fallbackProfileVM.source !== 'legacy_fallback') throw new Error('Non-existent student must return legacy_fallback');

    log('6. Testing LearningProgressAdapter...');
    const learningAdapter = new LearningProgressAdapter(queryHandlers);
    const progressVM = await learningAdapter.getProgress('std_unit_01');
    if (progressVM.source !== 'application_layer') throw new Error('LearningProgressAdapter source should be application_layer');
    if (!progressVM.activePlan) throw new Error('LearningProgressAdapter activePlan should be present');
    if (progressVM.analytics.overallFluencyScore !== 78) {
      throw new Error(`LearningProgressAdapter fluency score mismatch: expected 78, got ${progressVM.analytics.overallFluencyScore}`);
    }

    log('7. Testing ApplicationContainer singleton instantiation & catalog seeding...');
    const container = new ApplicationContainer();
    const activeLessons = await container.lessonRepo.findAllActive();
    if (activeLessons.length < 3) throw new Error(`ApplicationContainer should pre-seed at least 3 lessons, got ${activeLessons.length}`);

    const containerDashboardVM = await container.dashboardAdapter.getDashboardViewModel('std_demo_container', {
      current_focus: 'Liderança Global',
    });
    if (containerDashboardVM.recommendedLessons.length < 3) {
      throw new Error('Container dashboard view model should include pre-seeded recommended lessons');
    }

    log('ALL ADAPTER & QUERY HANDLER TESTS PASSED SUCCESSFULLY!');
    return { passed: true, logs };
  } catch (err: any) {
    log(`TEST FAILED: ${err.message}`);
    return { passed: false, logs };
  }
}
