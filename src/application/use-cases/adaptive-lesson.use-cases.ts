import { DetailedLessonDTO } from '../dto/lesson.dtos';
import { StudentProfileAdapter } from '../adapters/student.adapter';
import { ICoachAiService, ILessonGeneratorAiService } from '../contracts/ai.contract';
import { applicationTelemetry } from '../telemetry/telemetry.service';
import { ILogger } from '../contracts/infrastructure.contracts';

export class GenerateAdaptiveLessonUseCase {
  constructor(
    private readonly studentProfileAdapter: StudentProfileAdapter,
    private readonly coachAiService: ICoachAiService,
    private readonly lessonGeneratorAiService: ILessonGeneratorAiService,
    private readonly logger: ILogger
  ) {}

  public async execute(
    studentId: string,
    topic?: string,
    difficulty?: string
  ): Promise<DetailedLessonDTO> {
    const span = applicationTelemetry.startSpan('GenerateAdaptiveLessonUseCase', { studentId, topic, difficulty });
    try {
      const legacyProfile = await this.studentProfileAdapter.getLegacyUserProfile(studentId);
      const memory = this.coachAiService.createInitialLongitudinalMemory(studentId, legacyProfile.target_languages?.[0] || 'es', legacyProfile);
      
      const lesson = await this.lessonGeneratorAiService.generateLesson(
        legacyProfile.target_languages?.[0] || 'es',
        legacyProfile.native_language || 'pt',
        topic || 'Apresentação Executiva & Negociação de Ideias',
        difficulty || legacyProfile.last_assessment?.level || 'B1',
        legacyProfile,
        memory
      );
      
      this.logger.info(`Adaptive lesson generated for student ${studentId}: ${lesson.title}`);
      applicationTelemetry.endSpan(span, true);

      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || '',
        targetLevel: lesson.difficulty,
        status: lesson.completed ? 'completed' : 'available',
        teacherId: legacyProfile.coach_personality || 'Prof. Sofia',
        estimatedMinutes: lesson.estimatedMinutes,
        primaryCompetency: lesson.pedagogicalDecision.studentNeeds,
        objectives: [lesson.smartIntroduction.howItHelpsGoal],
        targetLanguage: lesson.targetLanguage,
        nativeLanguage: lesson.nativeLanguage,
        type: lesson.type,
        completed: lesson.completed,
        pedagogicalDecision: lesson.pedagogicalDecision,
        smartIntroduction: lesson.smartIntroduction,
        smartEnding: lesson.smartEnding,
        intelligentHomework: lesson.intelligentHomework ? {
          ...lesson.intelligentHomework,
          goalTag: lesson.intelligentHomework.goalTag || 'general_fluency',
        } : undefined as any,
        content: lesson.content as any,
        createdAt: lesson.createdAt || new Date().toISOString(),
      };
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}
