import { ApplicationQueryHandlers } from '../queries/query-handlers';
import { DashboardDTO } from '../dto/application.dtos';
import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { ILessonRepository } from '../../domain/lesson/repositories/lesson-repository.interface';
import { IStudyPlanRepository } from '../../domain/learning/repositories/study-plan-repository.interface';
import { IAnalyticsRepository } from '../../domain/analytics/repositories/analytics-repository.interface';
import { ISubscriptionRepository } from '../../domain/billing/repositories/subscription-repository.interface';
import { IMemoryRepository } from '../../domain/memory/repositories/memory-repository.interface';
import { StudentEntity } from '../../domain/student/entities/student.entity';
import { StudentId } from '../../domain/student/value-objects/student-id.vo';
import { CEFRLevel } from '../../domain/shared/value-objects/cefr-level.vo';
import { LanguageCode } from '../../domain/shared/value-objects/language-code.vo';
import { SkillMatrix } from '../../domain/student/value-objects/skill-matrix.vo';
import { LearningPreferences } from '../../domain/student/value-objects/learning-preferences.vo';
import { TimeStamp } from '../../domain/shared/value-objects/time-stamp.vo';
import { StudyPlanFactory } from '../../domain/learning/factories/study-plan.factory';
import { AnalyticsFactory } from '../../domain/analytics/factories/analytics.factory';
import { SubscriptionFactory } from '../../domain/billing/factories/subscription.factory';
import { MemoryFactory } from '../../domain/memory/factories/memory.factory';

/**
 * UI-Safe View Model for the Dashboard.
 * React components consume this structure directly, completely decoupled
 * from internal domain entity references, methods, and invariants.
 */
export interface DashboardViewModelDTO {
  readonly student: {
    readonly id: string;
    readonly email: string;
    readonly nativeLanguage: string;
    readonly targetLanguages: string[];
    readonly currentLevel: string;
    readonly currentFocus: string;
    readonly motivation: string;
    readonly confidenceScore: number;
    readonly streakDays: number;
    readonly minutesPerDay: number;
    readonly preferredTeacher: string;
    readonly correctionStrictness: string;
  };
  readonly metrics: {
    readonly streakDays: number;
    readonly confidenceScore: number;
    readonly fluencyLevel: string;
    readonly pronunciationMastery: number;
    readonly activeVocabularyCount: number;
    readonly wordsLearnedCount: number;
    readonly grammarRulesMastered: number;
    readonly learningVelocity: 'alta' | 'moderada' | 'revisar_metas';
  };
  readonly nextLesson?: {
    readonly id: string;
    readonly title: string;
    readonly targetLevel: string;
    readonly status: string;
    readonly estimatedMinutes: number;
    readonly primaryCompetency: string;
    readonly objectives: string[];
  };
  readonly recommendedLessons: Array<{
    readonly id: string;
    readonly title: string;
    readonly targetLevel: string;
    readonly status: string;
    readonly estimatedMinutes: number;
    readonly primaryCompetency: string;
    readonly objectives: string[];
  }>;
  readonly weeklyCalendar: {
    readonly weeklyGoalMinutes: number;
    readonly completedMinutes: number;
    readonly weeklySessions: number;
  };
  readonly activePlan?: {
    readonly id: string;
    readonly primaryObjective: string;
    readonly progressPercentage: number;
    readonly missions: Array<{
      readonly id: string;
      readonly title: string;
      readonly description: string;
      readonly completed: boolean;
      readonly competencyId: string;
    }>;
  };
  readonly subscription: {
    readonly planTier: string;
    readonly status: string;
    readonly sessionsUsedThisMonth: number;
    readonly monthlyLimit: number;
    readonly remainingSessions: number;
  };
  readonly dueVocabularyCount: number;
  readonly isFallback: boolean;
  readonly source: 'application_layer' | 'legacy_fallback';
}

export interface DashboardInputProfile {
  id?: string;
  name?: string;
  email?: string;
  native_language?: string;
  nativeLanguage?: string;
  target_languages?: string[];
  targetLanguages?: string[];
  coach_personality?: string;
  minutes_per_day?: number;
  confidence_score?: number;
  current_focus?: string;
  profession?: string;
  hobbies?: string[];
  interests?: string[];
  motivation?: string;
  objectives?: {
    primaryMotivation?: string;
    professionalDomain?: string;
    currentFocus?: string;
    targetExamOrMilestone?: string;
  };
  preferences?: {
    dailyGoalMinutes?: number;
    weeklyGoalMinutes?: number;
    preferredTeacherPersona?: string;
    correctionStrictness?: string;
  };
}

export class DashboardAdapter {
  constructor(
    private readonly queryHandlers: ApplicationQueryHandlers,
    private readonly studentRepo: IStudentRepository,
    private readonly lessonRepo: ILessonRepository,
    private readonly studyPlanRepo: IStudyPlanRepository,
    private readonly analyticsRepo: IAnalyticsRepository,
    private readonly subscriptionRepo: ISubscriptionRepository,
    private readonly memoryRepo: IMemoryRepository
  ) {}

  /**
   * Primary entry point for UI: fetches dashboard data via Application Query Handlers.
   * Ensures student bootstrap in domain repositories if this is their first session.
   */
  public async getDashboardViewModel(
    studentId: string,
    fallbackProfile?: DashboardInputProfile
  ): Promise<DashboardViewModelDTO> {
    try {
      // 1. Ensure student exists in repository or bootstrap from profile
      await this.ensureStudentExists(studentId, fallbackProfile);

      // 2. Dispatch query through Application Query Handlers
      const dashboardDto = await this.queryHandlers.getDashboard({ studentId });

      // 3. Map DTO to clean UI ViewModel
      return this.mapDtoToViewModel(dashboardDto, fallbackProfile);
    } catch (error) {
      console.warn('[DashboardAdapter] Error querying application layer, generating fallback view model:', error);
      return this.createFallbackViewModel(studentId, fallbackProfile);
    }
  }

  /**
   * Converts Application DashboardDTO into UI-ready ViewModel.
   */
  private mapDtoToViewModel(
    dto: DashboardDTO,
    profileInput?: DashboardInputProfile
  ): DashboardViewModelDTO {
    const primaryLesson = dto.recommendedLessons[0];
    const weeklyGoal = (dto.student.preferences.dailyGoalMinutes || 15) * 7;
    const completedMins = dto.analytics.weeklyMinutes || 75;

    return {
      student: {
        id: dto.student.id,
        email: dto.student.email,
        nativeLanguage: dto.student.nativeLanguage,
        targetLanguages: dto.student.targetLanguages,
        currentLevel: dto.student.currentLevel,
        currentFocus: dto.student.currentFocus,
        motivation: dto.student.motivation,
        confidenceScore: profileInput?.confidence_score ?? dto.analytics.fluencyIndex.confidenceScore ?? 76,
        streakDays: 5,
        minutesPerDay: dto.student.preferences.dailyGoalMinutes,
        preferredTeacher: dto.student.preferences.preferredTeacherPersona,
        correctionStrictness: dto.student.preferences.correctionStrictness,
      },
      metrics: {
        streakDays: 5,
        confidenceScore: profileInput?.confidence_score ?? dto.analytics.fluencyIndex.confidenceScore ?? 76,
        fluencyLevel: `${dto.student.currentLevel} Intermédio`,
        pronunciationMastery: 88,
        activeVocabularyCount: dto.analytics.wordsLearnedCount || 340,
        wordsLearnedCount: dto.analytics.wordsLearnedCount || 340,
        grammarRulesMastered: dto.analytics.grammarRulesMastered || 12,
        learningVelocity: dto.analytics.learningVelocity || 'alta',
      },
      nextLesson: primaryLesson
        ? {
            id: primaryLesson.id,
            title: primaryLesson.title,
            targetLevel: primaryLesson.targetLevel,
            status: primaryLesson.status,
            estimatedMinutes: primaryLesson.estimatedMinutes,
            primaryCompetency: primaryLesson.primaryCompetency,
            objectives: primaryLesson.objectives,
          }
        : undefined,
      recommendedLessons: dto.recommendedLessons.map((l) => ({
        id: l.id,
        title: l.title,
        targetLevel: l.targetLevel,
        status: l.status,
        estimatedMinutes: l.estimatedMinutes,
        primaryCompetency: l.primaryCompetency,
        objectives: l.objectives,
      })),
      weeklyCalendar: {
        weeklyGoalMinutes: weeklyGoal,
        completedMinutes: completedMins,
        weeklySessions: dto.analytics.weeklySessions || 4,
      },
      activePlan: dto.activePlan
        ? {
            id: dto.activePlan.id,
            primaryObjective: dto.activePlan.primaryObjective,
            progressPercentage: dto.activePlan.progressPercentage,
            missions: dto.activePlan.missions.map((m) => ({
              id: m.id,
              title: m.title,
              description: m.description,
              completed: m.isCompleted,
              competencyId: m.competencyId,
            })),
          }
        : undefined,
      subscription: {
        planTier: dto.subscription.planTier,
        status: dto.subscription.status,
        sessionsUsedThisMonth: dto.subscription.sessionsUsedThisMonth,
        monthlyLimit: dto.subscription.monthlyLimit,
        remainingSessions: dto.subscription.remainingSessions,
      },
      dueVocabularyCount: dto.dueVocabularyCount,
      isFallback: false,
      source: 'application_layer',
    };
  }

  /**
   * Bootstraps the student in domain repositories if not yet seeded.
   */
  private async ensureStudentExists(studentId: string, profileInput?: DashboardInputProfile): Promise<void> {
    const existing = await this.studentRepo.findById(StudentId.create(studentId));
    if (existing) return;

    const email = profileInput?.email || `${studentId}@fluento.ai`;
    const nativeLang = profileInput?.nativeLanguage || profileInput?.native_language || 'pt';
    const targetLangs = profileInput?.targetLanguages?.length
      ? profileInput.targetLanguages
      : profileInput?.target_languages?.length
      ? profileInput.target_languages
      : ['es'];
    const focus = profileInput?.objectives?.currentFocus || profileInput?.current_focus || 'Apresentação Executiva & Negociação de Ideias';
    const motivation = profileInput?.objectives?.primaryMotivation || profileInput?.motivation || 'Liderar reuniões internacionais e negociações com total fluência';
    const minutes = profileInput?.preferences?.dailyGoalMinutes || profileInput?.minutes_per_day || 15;
    const topics = profileInput?.interests || profileInput?.hobbies || ['Tecnologia', 'Viagens', 'Negócios'];

    const student = StudentEntity.create(StudentId.create(studentId), {
      email,
      nativeLanguage: LanguageCode.create(nativeLang),
      targetLanguages: targetLangs.map((c) => LanguageCode.create(c)),
      currentLevel: CEFRLevel.create('B1'),
      skillMatrix: SkillMatrix.defaultInitial(),
      preferences: LearningPreferences.create({
        dailyMinutes: minutes,
        topics,
      }),
      currentFocus: focus,
      motivation,
      active: true,
      createdAt: TimeStamp.now(),
      updatedAt: TimeStamp.now(),
    });
    await this.studentRepo.save(student);

    // Bootstrap StudyPlan
    const existingPlan = await this.studyPlanRepo.findByStudentId(studentId);
    if (!existingPlan) {
      const plan = StudyPlanFactory.createDefaultPlanForStudent(studentId, focus);
      await this.studyPlanRepo.save(plan);
    }

    // Bootstrap Analytics
    const existingAnalytics = await this.analyticsRepo.findByStudentId(studentId);
    if (!existingAnalytics) {
      const analytics = AnalyticsFactory.createDefaultAnalytics(studentId);
      await this.analyticsRepo.save(analytics);
    }

    // Bootstrap Subscription
    const existingSub = await this.subscriptionRepo.findByStudentId(studentId);
    if (!existingSub) {
      const sub = SubscriptionFactory.createFreeSubscription(studentId);
      await this.subscriptionRepo.save(sub);
    }

    // Bootstrap sample memory due words
    const existingWords = await this.memoryRepo.findWordsByStudentId(studentId);
    if (existingWords.length === 0) {
      const w1 = MemoryFactory.createNewTrackedWord(studentId, 'sin embargo', 'no entanto', 'conectores');
      const w2 = MemoryFactory.createNewTrackedWord(studentId, 'desarrollo', 'desenvolvimento', 'negócios');
      await this.memoryRepo.saveWord(w1);
      await this.memoryRepo.saveWord(w2);
    }
  }

  /**
   * Pure fallback view model if domain execution is unavailable.
   */
  private createFallbackViewModel(studentId: string, profileInput?: DashboardInputProfile): DashboardViewModelDTO {
    return {
      student: {
        id: studentId,
        email: profileInput?.email || 'user@fluento.ai',
        nativeLanguage: profileInput?.native_language || 'pt',
        targetLanguages: profileInput?.target_languages || ['es'],
        currentLevel: 'B1',
        currentFocus: profileInput?.current_focus || 'Apresentação Executiva & Negociação de Ideias',
        motivation: profileInput?.motivation || 'Liderar reuniões internacionais e negociações com total fluência',
        confidenceScore: profileInput?.confidence_score || 76,
        streakDays: 5,
        minutesPerDay: profileInput?.minutes_per_day || 15,
        preferredTeacher: 'Prof. Sofia',
        correctionStrictness: 'balanced',
      },
      metrics: {
        streakDays: 5,
        confidenceScore: profileInput?.confidence_score || 76,
        fluencyLevel: 'B1 Intermédio',
        pronunciationMastery: 88,
        activeVocabularyCount: 340,
        wordsLearnedCount: 340,
        grammarRulesMastered: 12,
        learningVelocity: 'alta',
      },
      nextLesson: {
        id: 'lesson-exec-1',
        title: 'Apresentação Executiva & Negociação de Ideias',
        targetLevel: 'B1',
        status: 'available',
        estimatedMinutes: 20,
        primaryCompetency: 'Negociação Verbal',
        objectives: ['Apresentar propostas de valor com precisão e diplomacia corporativa.'],
      },
      recommendedLessons: [
        {
          id: 'lesson-exec-1',
          title: 'Apresentação Executiva & Negociação de Ideias',
          targetLevel: 'B1',
          status: 'available',
          estimatedMinutes: 20,
          primaryCompetency: 'Negociação Verbal',
          objectives: ['Apresentar propostas de valor com precisão e diplomacia corporativa.'],
        },
        {
          id: 'lesson-exec-2',
          title: 'Check-in e Imigração no Aeroporto',
          targetLevel: 'A2',
          status: 'available',
          estimatedMinutes: 15,
          primaryCompetency: 'Viagens & Deslocação',
          objectives: ['Responder a perguntas alfandegárias com naturalidade e calma.'],
        },
      ],
      weeklyCalendar: {
        weeklyGoalMinutes: 105,
        completedMinutes: 75,
        weeklySessions: 4,
      },
      subscription: {
        planTier: 'free',
        status: 'active',
        sessionsUsedThisMonth: 0,
        monthlyLimit: 5,
        remainingSessions: 5,
      },
      dueVocabularyCount: 2,
      isFallback: true,
      source: 'legacy_fallback',
    };
  }
}
