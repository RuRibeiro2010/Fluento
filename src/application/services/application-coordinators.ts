import { ILogger } from '../contracts/infrastructure.contracts';
import { ILessonRepository } from '../../domain/lesson/repositories/lesson-repository.interface';
import { ISessionRepository } from '../../domain/session/repositories/session-repository.interface';
import { ITeacherRepository } from '../../domain/teacher/repositories/teacher-repository.interface';
import { IStudyPlanRepository } from '../../domain/learning/repositories/study-plan-repository.interface';
import { IAnalyticsRepository } from '../../domain/analytics/repositories/analytics-repository.interface';
import { IMemoryRepository } from '../../domain/memory/repositories/memory-repository.interface';
import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { IAiProviderPort } from '../../domain/ai/repositories/ai-provider-port.interface';
import { LessonId } from '../../domain/lesson/value-objects/lesson-id.vo';
import { SessionId } from '../../domain/session/value-objects/session-id.vo';
import { StudentId } from '../../domain/student/value-objects/student-id.vo';

export class PipelineCoordinator {
  constructor(
    private readonly lessonRepo: ILessonRepository,
    private readonly sessionRepo: ISessionRepository,
    private readonly logger: ILogger
  ) {}

  public async preparePipelineContext(lessonId: string, studentId: string) {
    this.logger.info('Coordinating pipeline preparation', { lessonId, studentId });
    const lesson = await this.lessonRepo.findById(LessonId.create(lessonId));
    return { lessonReady: !!lesson };
  }
}

export class AnalyticsCoordinator {
  constructor(
    private readonly analyticsRepo: IAnalyticsRepository,
    private readonly memoryRepo: IMemoryRepository,
    private readonly logger: ILogger
  ) {}

  public async aggregateStudentInsights(studentId: string) {
    this.logger.info('Coordinating student analytics aggregation', { studentId });
    const analytics = await this.analyticsRepo.findByStudentId(studentId);
    const words = await this.memoryRepo.findWordsByStudentId(studentId);
    return { analytics, totalTrackedWords: words.length };
  }
}

export class StudyPlanCoordinator {
  constructor(
    private readonly studyPlanRepo: IStudyPlanRepository,
    private readonly studentRepo: IStudentRepository,
    private readonly logger: ILogger
  ) {}

  public async syncPlanWithProgress(studentId: string) {
    this.logger.info('Coordinating study plan synchronization', { studentId });
    const plan = await this.studyPlanRepo.findByStudentId(studentId);
    return { planSynced: !!plan };
  }
}

export class ConversationCoordinator {
  constructor(
    private readonly sessionRepo: ISessionRepository,
    private readonly aiPort: IAiProviderPort,
    private readonly logger: ILogger
  ) {}

  public async coordinateTurn(sessionId: string, utteranceText: string) {
    this.logger.info('Coordinating conversation turn', { sessionId, utteranceLength: utteranceText.length });
    const session = await this.sessionRepo.findById(SessionId.create(sessionId));
    return { sessionFound: !!session };
  }
}

export class TeacherCoordinator {
  constructor(
    private readonly teacherRepo: ITeacherRepository,
    private readonly logger: ILogger
  ) {}

  public async selectBestTeacherForStudent(studentId: string) {
    this.logger.info('Coordinating teacher selection', { studentId });
    const teachers = await this.teacherRepo.findAllActive();
    return teachers.length > 0 ? teachers[0] : null;
  }
}
