import {
  InMemoryStudentRepository,
  InMemoryLessonRepository,
  InMemorySessionRepository,
  InMemoryStudyPlanRepository,
  InMemoryAnalyticsRepository,
  InMemorySubscriptionRepository,
  InMemoryMemoryRepository,
  InMemoryTeacherRepository,
} from './storage/in-memory';
import {
  FakeEventPublisher,
  FakeLogger,
  FakeClockProvider,
  FakeUuidGenerator,
} from './infrastructure';

import { ApplicationQueryHandlers } from '../queries/query-handlers';
import { DashboardAdapter } from './dashboard.adapter';
import { StudentProfileAdapter } from './student.adapter';
import { LearningProgressAdapter } from './learning.adapter';
import { LessonRoomAdapter } from './lesson-room.adapter';
import { AssessmentAdapter } from './assessment.adapter';
import { LocalStorageStudentProfileGateway } from './storage/local-storage-student-profile.gateway';
import { LocalStorageDigitalTwinGateway } from './storage/local-storage-digital-twin.gateway';
import { LocalStorageConversationSessionGateway } from './storage/local-storage-conversation-session.gateway';
import { StudentProfileSyncService } from '../services/student-profile-sync.service';
import { LessonConversationUseCase } from '../use-cases/lesson-conversation.use-cases';
import { GetCoachMessageUseCase, GetWeeklyReviewUseCase, GetStudyPlanUseCase } from '../use-cases/coach.use-cases';
import { GenerateAdaptiveLessonUseCase } from '../use-cases/adaptive-lesson.use-cases';
import { RunAdaptiveAssessmentUseCase } from '../use-cases/assessment.use-cases';
import { RuntimeCoachAiAdapter } from '../services/runtime-coach-ai.adapter';
import { RuntimeAssessmentAiAdapter } from '../services/runtime-assessment-ai.adapter';
import { RuntimeLessonGeneratorAiAdapter } from '../services/runtime-lesson-generator.adapter';
import { RuntimeConversationAiAdapter } from '../services/runtime-conversation-ai.adapter';
import { aiRuntime } from '../../lib/ai-runtime/ai-runtime';

import { LessonEntity } from '../../domain/lesson/entities/lesson.entity';
import { LessonId } from '../../domain/lesson/value-objects/lesson-id.vo';
import { CEFRLevel } from '../../domain/shared/value-objects/cefr-level.vo';
import { LessonStatus } from '../../domain/lesson/value-objects/lesson-status.vo';
import { LessonObjective } from '../../domain/lesson/value-objects/lesson-objective.vo';
import { TimeStamp } from '../../domain/shared/value-objects/time-stamp.vo';

/**
 * APPLICATION CONTAINER
 *
 * Provides initialized singleton repositories, query handlers, and UI adapters.
 * Serves as the composition root for the client-side Application Layer.
 */
export class ApplicationContainer {
  public readonly studentRepo = new InMemoryStudentRepository();
  public readonly lessonRepo = new InMemoryLessonRepository();
  public readonly sessionRepo = new InMemorySessionRepository();
  public readonly studyPlanRepo = new InMemoryStudyPlanRepository();
  public readonly analyticsRepo = new InMemoryAnalyticsRepository();
  public readonly subscriptionRepo = new InMemorySubscriptionRepository();
  public readonly memoryRepo = new InMemoryMemoryRepository();
  public readonly teacherRepo = new InMemoryTeacherRepository();

  public readonly eventPublisher = new FakeEventPublisher();
  public readonly logger = new FakeLogger();
  public readonly clock = new FakeClockProvider();
  public readonly uuidGen = new FakeUuidGenerator();

  public readonly studentProfileGateway = new LocalStorageStudentProfileGateway();
  public readonly digitalTwinGateway = new LocalStorageDigitalTwinGateway();
  public readonly conversationSessionGateway = new LocalStorageConversationSessionGateway();
  public readonly studentProfileSyncService: StudentProfileSyncService;

  public readonly queryHandlers: ApplicationQueryHandlers;
  public readonly dashboardAdapter: DashboardAdapter;
  public readonly studentProfileAdapter: StudentProfileAdapter;
  public readonly learningProgressAdapter: LearningProgressAdapter;
  public readonly lessonConversationUseCase: LessonConversationUseCase;
  public readonly coachUseCase: GetCoachMessageUseCase;
  public readonly reviewUseCase: GetWeeklyReviewUseCase;
  public readonly studyPlanUseCase: GetStudyPlanUseCase;
  public readonly adaptiveLessonUseCase: GenerateAdaptiveLessonUseCase;
  public readonly assessmentUseCase: RunAdaptiveAssessmentUseCase;
  public readonly lessonRoomAdapter: LessonRoomAdapter;
  public readonly assessmentAdapter: AssessmentAdapter;

  constructor() {
    this.studentProfileSyncService = new StudentProfileSyncService(
      this.studentProfileGateway,
      this.digitalTwinGateway,
      this.studentRepo,
      this.eventPublisher
    );

    this.queryHandlers = new ApplicationQueryHandlers(
      this.studentRepo,
      this.lessonRepo,
      this.sessionRepo,
      this.studyPlanRepo,
      this.analyticsRepo,
      this.subscriptionRepo,
      this.memoryRepo
    );

    this.studentProfileAdapter = new StudentProfileAdapter(
      this.queryHandlers,
      this.studentRepo,
      this.studentProfileSyncService
    );
    this.learningProgressAdapter = new LearningProgressAdapter(this.queryHandlers);

    const coachAiService = new RuntimeCoachAiAdapter(aiRuntime);
    const lessonGeneratorAiService = new RuntimeLessonGeneratorAiAdapter(aiRuntime);
    const assessmentAiService = new RuntimeAssessmentAiAdapter(aiRuntime);
    const conversationAiService = new RuntimeConversationAiAdapter(aiRuntime);

    this.lessonConversationUseCase = new LessonConversationUseCase(
      this.sessionRepo,
      this.lessonRepo,
      this.studentRepo,
      this.studentProfileSyncService,
      this.eventPublisher,
      this.logger,
      this.conversationSessionGateway,
      conversationAiService
    );
    this.lessonRoomAdapter = new LessonRoomAdapter(this.lessonConversationUseCase);

    this.coachUseCase = new GetCoachMessageUseCase(this.studentProfileAdapter, coachAiService, this.logger);
    this.reviewUseCase = new GetWeeklyReviewUseCase(this.studentProfileAdapter, coachAiService, this.logger);
    this.studyPlanUseCase = new GetStudyPlanUseCase(this.studentProfileAdapter, coachAiService, this.logger);
    this.adaptiveLessonUseCase = new GenerateAdaptiveLessonUseCase(this.studentProfileAdapter, coachAiService, lessonGeneratorAiService, this.logger);
    this.assessmentUseCase = new RunAdaptiveAssessmentUseCase(assessmentAiService, this.logger);
    this.assessmentAdapter = new AssessmentAdapter(this.assessmentUseCase);

    this.dashboardAdapter = new DashboardAdapter(
      this.queryHandlers,
      this.studentRepo,
      this.lessonRepo,
      this.studyPlanRepo,
      this.analyticsRepo,
      this.subscriptionRepo,
      this.memoryRepo,
      this.studentProfileAdapter,
      coachAiService,
      this.coachUseCase,
      this.reviewUseCase,
      this.adaptiveLessonUseCase
    );

    this.seedDefaultCatalog();
  }

  /**
   * Pre-seeds active lesson catalog in domain repository.
   */
  private seedDefaultCatalog(): void {
    const defaultLessons: LessonEntity[] = [
      LessonEntity.create(LessonId.create('lesson-exec-1'), {
        title: 'Apresentação Executiva & Negociação de Ideias',
        cefrLevel: CEFRLevel.create('B1'),
        status: LessonStatus.create('available'),
        estimatedMinutes: 20,
        topicTag: 'Negociação Verbal',
        objective: LessonObjective.create({
          title: 'Apresentação de Proposta de Valor',
          description: 'Apresentar propostas de valor com precisão diplomática e persuasão corporativa.',
          keyCompetencies: ['persuasao', 'vocabulario_comercial'],
          targetSkill: 'speaking',
        }),
        createdAt: TimeStamp.now(),
        updatedAt: TimeStamp.now(),
      }),
      LessonEntity.create(LessonId.create('lesson-exec-2'), {
        title: 'Check-in e Imigração no Aeroporto',
        cefrLevel: CEFRLevel.create('A2'),
        status: LessonStatus.create('available'),
        estimatedMinutes: 15,
        topicTag: 'Viagens & Deslocação',
        objective: LessonObjective.create({
          title: 'Controle de Alfândega & Bagagem',
          description: 'Responder a perguntas alfandegárias com naturalidade e calma.',
          keyCompetencies: ['deslocacao', 'dialogo_direto'],
          targetSkill: 'listening',
        }),
        createdAt: TimeStamp.now(),
        updatedAt: TimeStamp.now(),
      }),
      LessonEntity.create(LessonId.create('lesson-exec-3'), {
        title: 'Discussão de Projetos e Prazos Ágeis',
        cefrLevel: CEFRLevel.create('B2'),
        status: LessonStatus.create('available'),
        estimatedMinutes: 25,
        topicTag: 'Gestão Ágil',
        objective: LessonObjective.create({
          title: 'Alinhamento de Sprint & Bloqueios',
          description: 'Explicar dependências técnicas e negociar prazos com equipas internacionais.',
          keyCompetencies: ['gestao_projetos', 'comunicacao_direta'],
          targetSkill: 'speaking',
        }),
        createdAt: TimeStamp.now(),
        updatedAt: TimeStamp.now(),
      }),
    ];

    for (const lesson of defaultLessons) {
      this.lessonRepo.save(lesson);
    }
  }
}

// Global Singleton Application Container
export const applicationContainer = new ApplicationContainer();
export const dashboardAdapter = applicationContainer.dashboardAdapter;
export const studentProfileAdapter = applicationContainer.studentProfileAdapter;
export const learningProgressAdapter = applicationContainer.learningProgressAdapter;
export const applicationQueryHandlers = applicationContainer.queryHandlers;
export const studentProfileSyncService = applicationContainer.studentProfileSyncService;
export const studentProfileGateway = applicationContainer.studentProfileGateway;
export const digitalTwinStorageGateway = applicationContainer.digitalTwinGateway;
export const conversationSessionGateway = applicationContainer.conversationSessionGateway;
export const lessonConversationUseCase = applicationContainer.lessonConversationUseCase;
export const lessonRoomAdapter = applicationContainer.lessonRoomAdapter;
export const assessmentAdapter = applicationContainer.assessmentAdapter;
