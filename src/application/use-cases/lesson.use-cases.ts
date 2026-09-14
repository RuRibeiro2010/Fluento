import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { ILessonRepository } from '../../domain/lesson/repositories/lesson-repository.interface';
import { LessonId } from '../../domain/lesson/value-objects/lesson-id.vo';
import { StudentId } from '../../domain/student/value-objects/student-id.vo';
import { LessonValidator } from '../validators/application.validators';
import { LessonMapper } from '../mappers/application.mappers';
import { LessonDTO } from '../dto/application.dtos';
import { StartLessonCommand, FinishLessonCommand } from '../commands/application.commands';
import { NotFoundError } from '../errors/application-error';
import { applicationTelemetry } from '../telemetry/telemetry.service';
import { LessonStartedEvent, LessonFinishedEvent } from '../events/application-events';
import { IEventPublisher, ILogger } from '../contracts/infrastructure.contracts';

export class StartLessonUseCase {
  constructor(
    private readonly lessonRepo: ILessonRepository,
    private readonly studentRepo: IStudentRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly logger: ILogger
  ) {}

  public async execute(command: StartLessonCommand): Promise<LessonDTO> {
    const span = applicationTelemetry.startSpan('StartLessonUseCase', { command });
    try {
      LessonValidator.validateStartCommand(command);

      const student = await this.studentRepo.findById(StudentId.create(command.studentId));
      if (!student) {
        throw new NotFoundError('Student', command.studentId);
      }

      const lesson = await this.lessonRepo.findById(LessonId.create(command.lessonId));
      if (!lesson) {
        throw new NotFoundError('Lesson', command.lessonId);
      }

      lesson.startLesson();
      await this.lessonRepo.save(lesson);

      const appEvent = new LessonStartedEvent(lesson.id, {
        lessonId: lesson.id,
        studentId: command.studentId,
        teacherId: 'tch_01',
      });
      await this.eventPublisher.publish(appEvent);

      this.logger.info(`Lesson ${lesson.id} started for student ${command.studentId}`);
      applicationTelemetry.endSpan(span, true, { publishedEventsCount: 1 });

      return LessonMapper.toDTO(lesson);
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}

export class FinishLessonUseCase {
  constructor(
    private readonly lessonRepo: ILessonRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly logger: ILogger
  ) {}

  public async execute(command: FinishLessonCommand): Promise<LessonDTO> {
    const span = applicationTelemetry.startSpan('FinishLessonUseCase', { command });
    try {
      LessonValidator.validateFinishCommand(command);

      const lesson = await this.lessonRepo.findById(LessonId.create(command.lessonId));
      if (!lesson) {
        throw new NotFoundError('Lesson', command.lessonId);
      }

      lesson.markCompleted(command.studentId, command.finalScore, 1200);
      await this.lessonRepo.save(lesson);

      const appEvent = new LessonFinishedEvent(lesson.id, {
        lessonId: lesson.id,
        studentId: command.studentId,
        score: command.finalScore,
      });
      await this.eventPublisher.publish(appEvent);

      this.logger.info(`Lesson ${lesson.id} finished with score ${command.finalScore}`);
      applicationTelemetry.endSpan(span, true, { publishedEventsCount: 1 });

      return LessonMapper.toDTO(lesson);
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}
