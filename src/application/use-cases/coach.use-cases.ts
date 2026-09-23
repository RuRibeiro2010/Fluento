import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { StudentId } from '../../domain/student/value-objects/student-id.vo';
import { CoachMessageDTO, WeeklyReviewDTO } from '../dto/coach.dtos';
import { StudyPlanDTO } from '../dto/application.dtos';
import { ICoachAiService } from '../contracts/ai.contract';
import { StudentProfileAdapter } from '../adapters/student.adapter';
import { applicationTelemetry } from '../telemetry/telemetry.service';
import { ILogger } from '../contracts/infrastructure.contracts';

export class GetCoachMessageUseCase {
  constructor(
    private readonly studentProfileAdapter: StudentProfileAdapter,
    private readonly coachAiService: ICoachAiService,
    private readonly logger: ILogger
  ) {}

  public async execute(studentId: string): Promise<CoachMessageDTO> {
    const span = applicationTelemetry.startSpan('GetCoachMessageUseCase', { studentId });
    try {
      const legacyProfile = await this.studentProfileAdapter.getLegacyUserProfile(studentId);
      const memory = this.coachAiService.createInitialLongitudinalMemory(studentId, legacyProfile.target_languages?.[0] || 'es', legacyProfile);
      
      const message = await this.coachAiService.generateDailyCoachMessage(legacyProfile, memory);
      
      this.logger.info(`Daily coach message generated for student ${studentId}`);
      applicationTelemetry.endSpan(span, true);

      return {
        id: `msg_${Date.now()}`,
        text: message.greeting + ' ' + message.advice,
        teacherName: legacyProfile.coach_personality || 'Prof. Sofia',
        teacherPersona: legacyProfile.coach_personality || 'encouraging',
        type: 'encouragement',
        actionLabel: message.recommendedAction,
        timestampIso: new Date().toISOString(),
      };
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}

export class GetWeeklyReviewUseCase {
  constructor(
    private readonly studentProfileAdapter: StudentProfileAdapter,
    private readonly coachAiService: ICoachAiService,
    private readonly logger: ILogger
  ) {}

  public async execute(studentId: string): Promise<WeeklyReviewDTO> {
    const span = applicationTelemetry.startSpan('GetWeeklyReviewUseCase', { studentId });
    try {
      const legacyProfile = await this.studentProfileAdapter.getLegacyUserProfile(studentId);
      const memory = this.coachAiService.createInitialLongitudinalMemory(studentId, legacyProfile.target_languages?.[0] || 'es', legacyProfile);
      
      const review = await this.coachAiService.generateSundayWeeklyReview(legacyProfile, memory);
      
      this.logger.info(`Weekly review generated for student ${studentId}`);
      applicationTelemetry.endSpan(span, true);

      return {
        weekId: review.id,
        studentId,
        startDateIso: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDateIso: new Date().toISOString(),
        overallAccuracy: 88,
        totalMinutes: memory.totalPracticeMinutes,
        sessionsCount: memory.streakDays,
        wordsLearned: 24,
        topStrength: 'Vocabulário de Negócios',
        topWeakness: review.weaknessesIdentified[0],
        recommendation: review.nextWeekPlan[0],
        coachFeedback: review.coachPersonalNote,
      };
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}

export class GetStudyPlanUseCase {
  constructor(
    private readonly studentProfileAdapter: StudentProfileAdapter,
    private readonly coachAiService: ICoachAiService,
    private readonly logger: ILogger
  ) {}

  public async execute(studentId: string): Promise<StudyPlanDTO> {
    const span = applicationTelemetry.startSpan('GetStudyPlanUseCase', { studentId });
    try {
      const legacyProfile = await this.studentProfileAdapter.getLegacyUserProfile(studentId);
      const plan = await this.coachAiService.generateStudyPlan(legacyProfile, legacyProfile.target_languages?.[0] || 'es', legacyProfile.native_language || 'pt');
      
      this.logger.info(`Study plan generated for student ${studentId}`);
      applicationTelemetry.endSpan(span, true);

      return {
        id: plan.id,
        studentId: plan.userId,
        primaryObjective: plan.goal,
        estimatedEvolutionMonths: plan.estimatedWeeks / 4,
        progressPercentage: 35,
        keyCompetencies: ['Negociação', 'Fluência Verbal'],
        missions: plan.modules.flatMap(m => m.lessonIds.map(lId => ({
          id: lId,
          title: `Missão: ${m.title}`,
          description: m.description,
          isCompleted: false,
          competencyId: m.focus,
        }))),
      };
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}

