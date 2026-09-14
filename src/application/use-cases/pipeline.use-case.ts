import { StartLessonUseCase, FinishLessonUseCase } from './lesson.use-cases';
import { StartSessionUseCase, FinishSessionUseCase } from './session.use-cases';
import { GenerateAnalyticsUseCase } from './analytics.use-cases';
import { LessonDTO, SessionDTO, AnalyticsDTO } from '../dto/application.dtos';
import { applicationTelemetry } from '../telemetry/telemetry.service';
import { ILogger } from '../contracts/infrastructure.contracts';

export class ExecuteLessonPipelineUseCase {
  constructor(
    private readonly startLessonUC: StartLessonUseCase,
    private readonly startSessionUC: StartSessionUseCase,
    private readonly finishSessionUC: FinishSessionUseCase,
    private readonly finishLessonUC: FinishLessonUseCase,
    private readonly generateAnalyticsUC: GenerateAnalyticsUseCase,
    private readonly logger: ILogger
  ) {}

  public async execute(params: {
    studentId: string;
    lessonId: string;
    simulatedScore: number;
  }): Promise<{
    lesson: LessonDTO;
    session: SessionDTO;
    analytics: AnalyticsDTO;
  }> {
    const span = applicationTelemetry.startSpan('ExecuteLessonPipelineUseCase', { params });
    try {
      this.logger.info(`Pipeline execution started for lesson ${params.lessonId}`);

      const lesson = await this.startLessonUC.execute({
        lessonId: params.lessonId,
        studentId: params.studentId,
      });

      const session = await this.startSessionUC.execute({
        lessonId: params.lessonId,
        studentId: params.studentId,
      });

      await this.finishSessionUC.execute({
        sessionId: session.id,
      });

      const finishedLesson = await this.finishLessonUC.execute({
        lessonId: params.lessonId,
        studentId: params.studentId,
        finalScore: params.simulatedScore,
      });

      const analytics = await this.generateAnalyticsUC.execute(params.studentId);

      this.logger.info(`Pipeline execution completed for lesson ${params.lessonId}`);
      applicationTelemetry.endSpan(span, true);

      return {
        lesson: finishedLesson,
        session,
        analytics,
      };
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}
