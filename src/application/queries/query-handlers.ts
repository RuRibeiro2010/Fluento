import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { ILessonRepository } from '../../domain/lesson/repositories/lesson-repository.interface';
import { IStudyPlanRepository } from '../../domain/learning/repositories/study-plan-repository.interface';
import { IAnalyticsRepository } from '../../domain/analytics/repositories/analytics-repository.interface';
import { ISubscriptionRepository } from '../../domain/billing/repositories/subscription-repository.interface';
import { IMemoryRepository } from '../../domain/memory/repositories/memory-repository.interface';
import { ISessionRepository } from '../../domain/session/repositories/session-repository.interface';

import { StudentId } from '../../domain/student/value-objects/student-id.vo';
import { LessonId } from '../../domain/lesson/value-objects/lesson-id.vo';

import { StudentMapper, StudyPlanMapper, AnalyticsMapper, SubscriptionMapper, LessonMapper, ReviewItemMapper } from '../mappers/application.mappers';
import { DashboardDTO, AnalyticsDTO, StudentDTO, LessonDTO, StudyPlanDTO, SubscriptionDTO, ReviewItemDTO } from '../dto/application.dtos';
import { GetDashboardQuery, GetAnalyticsQuery, GetStudentProfileQuery, GetLessonHistoryQuery, GetStudyPlanQuery, GetSubscriptionQuery, GetDueVocabularyQuery } from '../queries/application.queries';
import { NotFoundError } from '../errors/application-error';

export class ApplicationQueryHandlers {
  constructor(
    private readonly studentRepo: IStudentRepository,
    private readonly lessonRepo: ILessonRepository,
    private readonly sessionRepo: ISessionRepository,
    private readonly studyPlanRepo: IStudyPlanRepository,
    private readonly analyticsRepo: IAnalyticsRepository,
    private readonly subscriptionRepo: ISubscriptionRepository,
    private readonly memoryRepo: IMemoryRepository
  ) {}

  public async getDashboard(query: GetDashboardQuery): Promise<DashboardDTO> {
    const student = await this.studentRepo.findById(StudentId.create(query.studentId));
    if (!student) throw new NotFoundError('Student', query.studentId);

    const plan = await this.studyPlanRepo.findByStudentId(query.studentId);
    const analytics = await this.analyticsRepo.findByStudentId(query.studentId);
    const sub = await this.subscriptionRepo.findByStudentId(query.studentId);
    const dueWords = await this.memoryRepo.findDueWordsByStudentId(query.studentId);
    const activeLessons = await this.lessonRepo.findAllActive();

    return {
      student: StudentMapper.toDTO(student),
      activePlan: plan ? StudyPlanMapper.toDTO(plan) : undefined,
      analytics: analytics ? AnalyticsMapper.toDTO(analytics) : {
        studentId: query.studentId,
        weeklySessions: 0,
        weeklyMinutes: 0,
        monthlySessions: 0,
        monthlyMinutes: 0,
        wordsLearnedCount: 0,
        grammarRulesMastered: 0,
        averageAccuracyPercent: 0,
        fluencyIndex: { overallScore: 0, confidenceScore: 0, spontaneityScore: 0 },
        learningVelocity: 'revisar_metas',
      },
      subscription: sub ? SubscriptionMapper.toDTO(sub) : {
        studentId: query.studentId,
        planTier: 'free',
        monthlyPriceEur: 0,
        status: 'active',
        sessionsUsedThisMonth: 0,
        monthlyLimit: 5,
        remainingSessions: 5,
        cycleInterval: 'monthly',
        periodEnd: new Date().toISOString(),
      },
      dueVocabularyCount: dueWords.length,
      recommendedLessons: activeLessons.slice(0, 3).map(LessonMapper.toDTO),
    };
  }

  public async getAnalytics(query: GetAnalyticsQuery): Promise<AnalyticsDTO> {
    const analytics = await this.analyticsRepo.findByStudentId(query.studentId);
    if (!analytics) throw new NotFoundError('StudentAnalytics', query.studentId);
    return AnalyticsMapper.toDTO(analytics);
  }

  public async getStudentProfile(query: GetStudentProfileQuery): Promise<StudentDTO> {
    const student = await this.studentRepo.findById(StudentId.create(query.studentId));
    if (!student) throw new NotFoundError('Student', query.studentId);
    return StudentMapper.toDTO(student);
  }

  public async getLessonHistory(query: GetLessonHistoryQuery): Promise<LessonDTO[]> {
    const sessions = await this.sessionRepo.findByStudentId(query.studentId);
    const lessonIds = Array.from(new Set(sessions.map((s) => s.lessonId)));
    const lessons: LessonDTO[] = [];

    for (const lId of lessonIds) {
      const l = await this.lessonRepo.findById(LessonId.create(lId));
      if (l) lessons.push(LessonMapper.toDTO(l));
    }

    return query.limit ? lessons.slice(0, query.limit) : lessons;
  }

  public async getStudyPlan(query: GetStudyPlanQuery): Promise<StudyPlanDTO> {
    const plan = await this.studyPlanRepo.findByStudentId(query.studentId);
    if (!plan) throw new NotFoundError('StudyPlan', query.studentId);
    return StudyPlanMapper.toDTO(plan);
  }

  public async getSubscription(query: GetSubscriptionQuery): Promise<SubscriptionDTO> {
    const sub = await this.subscriptionRepo.findByStudentId(query.studentId);
    if (!sub) throw new NotFoundError('Subscription', query.studentId);
    return SubscriptionMapper.toDTO(sub);
  }

  public async getDueVocabulary(query: GetDueVocabularyQuery): Promise<ReviewItemDTO[]> {
    const dueWords = await this.memoryRepo.findDueWordsByStudentId(query.studentId, query.limit);
    return dueWords.map(ReviewItemMapper.toDTO);
  }
}
