import { ApplicationQueryHandlers } from '../queries/query-handlers';
import { DashboardDTO, StudyPlanDTO } from '../dto/application.dtos';
import { CoachMessageDTO, WeeklyReviewDTO, MonthlyEvolutionDataDTO } from '../dto/coach.dtos';
import { DetailedLessonDTO } from '../dto/lesson.dtos';
import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { ILessonRepository } from '../../domain/lesson/repositories/lesson-repository.interface';
import { IStudyPlanRepository } from '../../domain/learning/repositories/study-plan-repository.interface';
import { IAnalyticsRepository } from '../../domain/analytics/repositories/analytics-repository.interface';
import { ISubscriptionRepository } from '../../domain/billing/repositories/subscription-repository.interface';
import { IMemoryRepository } from '../../domain/memory/repositories/memory-repository.interface';
import { GetCoachMessageUseCase, GetWeeklyReviewUseCase } from '../use-cases/coach.use-cases';
import { GenerateAdaptiveLessonUseCase } from '../use-cases/adaptive-lesson.use-cases';
import { StudentProfileAdapter } from './student.adapter';
import { StudentProfileData } from '../dto/student-profile.dto';
import { DigitalTwinDTO } from '../dto/digital-twin.dto';
import { UserProfile } from '../../../types/profile';
import { ICoachAiService } from '../contracts/ai.contract';
import { LongitudinalMemory } from '../../../types/coach';

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
  readonly coachMessage?: CoachMessageDTO;
  readonly weeklyReview?: WeeklyReviewDTO;
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
    private readonly memoryRepo: IMemoryRepository,
    private readonly studentProfileAdapter: StudentProfileAdapter,
    private readonly coachAiService: ICoachAiService,
    private readonly coachUseCase?: GetCoachMessageUseCase,
    private readonly reviewUseCase?: GetWeeklyReviewUseCase,
    private readonly adaptiveLessonUseCase?: GenerateAdaptiveLessonUseCase
  ) {}

  /**
   * Primary entry point for UI: fetches dashboard data via Application Query Handlers.
   */
  public async getDashboardViewModel(
    studentId: string,
    fallbackProfile?: DashboardInputProfile
  ): Promise<DashboardViewModelDTO> {
    try {
      // 1. Ensure canonical profile and digital twin exist
      if (fallbackProfile) {
        // Ensure the onboarding profile is bound to the requested studentId if no ID is present
        if (!fallbackProfile.id) {
          fallbackProfile.id = studentId;
        }

        await this.studentProfileAdapter.saveOnboardingProfile(fallbackProfile as UserProfile);
      }
      
      const canonical = await this.studentProfileAdapter.getCanonicalProfile(studentId);
      const twin = await this.studentProfileAdapter.getDigitalTwin(studentId);

      // 2. Dispatch remaining queries through Application Query Handlers
      const dashboardDto = await this.queryHandlers.getDashboard({ studentId });

      // 3. Optional: Fetch adaptive coach data if use cases available
      let coachMessage: CoachMessageDTO | undefined;
      let weeklyReview: WeeklyReviewDTO | undefined;

      if (this.coachUseCase && this.reviewUseCase) {
        [coachMessage, weeklyReview] = await Promise.all([
          this.coachUseCase.execute(studentId).catch(() => undefined),
          this.reviewUseCase.execute(studentId).catch(() => undefined),
        ]);
      }

      // 4. Map DTO to clean UI ViewModel
      const vm = this.mapToViewModel(canonical, twin, dashboardDto);
      return {
        ...vm,
        coachMessage,
        weeklyReview,
      };
    } catch (error) {
      console.warn('[DashboardAdapter] Error querying application layer, generating fallback view model:', error);
      return this.createFallbackViewModel(studentId, fallbackProfile);
    }
  }

  private mapToViewModel(
    profile: StudentProfileData,
    twin: DigitalTwinDTO,
    dashboardDto: DashboardDTO
  ): DashboardViewModelDTO {
    const primaryLesson = dashboardDto.recommendedLessons[0];
    const weeklyGoal = profile.preferences.weeklyGoalMinutes;
    const completedMins = twin.progress.completedMinutesThisWeek;

    return {
      student: {
        id: profile.id,
        email: profile.email,
        nativeLanguage: profile.nativeLanguage,
        targetLanguages: profile.targetLanguages,
        currentLevel: profile.currentLevel,
        currentFocus: profile.objectives.currentFocus,
        motivation: profile.objectives.primaryMotivation,
        confidenceScore: twin.competencies.confidence,
        streakDays: twin.progress.streakDays,
        minutesPerDay: profile.preferences.dailyGoalMinutes,
        preferredTeacher: profile.preferences.preferredTeacherPersona,
        correctionStrictness: profile.preferences.correctionStrictness,
      },
      metrics: {
        streakDays: twin.progress.streakDays,
        confidenceScore: twin.competencies.confidence,
        fluencyLevel: `${profile.currentLevel} Intermédio`,
        pronunciationMastery: twin.competencies.pronunciation,
        wordsLearnedCount: twin.progress.wordsLearnedCount,
        grammarRulesMastered: dashboardDto.analytics.grammarRulesMastered || 12,
        learningVelocity: dashboardDto.analytics.learningVelocity || 'alta',
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
      recommendedLessons: dashboardDto.recommendedLessons.map((l) => ({
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
        weeklySessions: dashboardDto.analytics.weeklySessions || 4,
      },
      activePlan: dashboardDto.activePlan
        ? {
            id: dashboardDto.activePlan.id,
            primaryObjective: dashboardDto.activePlan.primaryObjective,
            progressPercentage: dashboardDto.activePlan.progressPercentage,
            missions: dashboardDto.activePlan.missions.map((m) => ({
              id: m.id,
              title: m.title,
              description: m.description,
              completed: m.isCompleted,
              competencyId: m.competencyId,
            })),
          }
        : undefined,
      subscription: {
        planTier: dashboardDto.subscription.planTier,
        status: dashboardDto.subscription.status,
        sessionsUsedThisMonth: dashboardDto.subscription.sessionsUsedThisMonth,
        monthlyLimit: dashboardDto.subscription.monthlyLimit,
        remainingSessions: dashboardDto.subscription.remainingSessions,
      },
      dueVocabularyCount: dashboardDto.dueVocabularyCount,
      isFallback: false,
      source: 'application_layer',
    };
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

  /**
   * Generates a new adaptive lesson for the student.
   */
  public async generateNewLesson(studentId: string): Promise<DetailedLessonDTO> {
    if (!this.adaptiveLessonUseCase) {
      throw new Error('Adaptive Lesson Use Case not configured in DashboardAdapter');
    }
    return this.adaptiveLessonUseCase.execute(studentId);
  }

  /**
   * Retrieves monthly evolution analytics via Application Layer.
   */
  public async getMonthlyEvolutionData(
    studentId: string,
    fallbackProfile?: Partial<UserProfile>,
    memory?: LongitudinalMemory
  ): Promise<MonthlyEvolutionDataDTO> {
    const profile = fallbackProfile || await this.studentProfileAdapter.getLegacyUserProfile(studentId);
    return this.coachAiService.generateMonthlyEvolutionData(profile, memory);
  }
}
