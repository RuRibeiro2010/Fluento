import { IStudyPlanRepository } from '../../domain/learning/repositories/study-plan-repository.interface';
import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { IMemoryRepository } from '../../domain/memory/repositories/memory-repository.interface';
import { StudentId } from '../../domain/student/value-objects/student-id.vo';
import { StudyPlanFactory } from '../../domain/learning/factories/study-plan.factory';
import { SpacedRepetitionService } from '../../domain/memory/services/spaced-repetition.service';
import { StudyPlanValidator, MemoryValidator } from '../validators/application.validators';
import { StudyPlanMapper, ReviewItemMapper } from '../mappers/application.mappers';
import { StudyPlanDTO, ReviewItemDTO } from '../dto/application.dtos';
import { CreateStudyPlanCommand, ReviewWordCommand, PlacementAssessmentCommand } from '../commands/application.commands';
import { NotFoundError } from '../errors/application-error';
import { applicationTelemetry } from '../telemetry/telemetry.service';
import { ReviewCompletedEvent } from '../events/application-events';
import { IEventPublisher, ILogger } from '../contracts/infrastructure.contracts';

export class CreateStudyPlanUseCase {
  constructor(
    private readonly studyPlanRepo: IStudyPlanRepository,
    private readonly studentRepo: IStudentRepository,
    private readonly logger: ILogger
  ) {}

  public async execute(command: CreateStudyPlanCommand): Promise<StudyPlanDTO> {
    const span = applicationTelemetry.startSpan('CreateStudyPlanUseCase', { command });
    try {
      StudyPlanValidator.validateCreatePlanCommand(command);

      const student = await this.studentRepo.findById(StudentId.create(command.studentId));
      if (!student) throw new NotFoundError('Student', command.studentId);

      const plan = StudyPlanFactory.createDefaultPlanForStudent(command.studentId, command.primaryObjective);
      await this.studyPlanRepo.save(plan);

      this.logger.info(`Study plan created for student ${command.studentId}`);
      applicationTelemetry.endSpan(span, true);

      return StudyPlanMapper.toDTO(plan);
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}

export class ReviewVocabularyUseCase {
  private srsService = new SpacedRepetitionService();

  constructor(
    private readonly memoryRepo: IMemoryRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly logger: ILogger
  ) {}

  public async execute(command: ReviewWordCommand): Promise<ReviewItemDTO> {
    const span = applicationTelemetry.startSpan('ReviewVocabularyUseCase', { command });
    try {
      MemoryValidator.validateReviewWordCommand(command);

      const words = await this.memoryRepo.findWordsByStudentId(command.studentId);
      const targetWord = words.find((w) => w.id === command.wordId);
      if (!targetWord) throw new NotFoundError('TrackedWord', command.wordId);

      const updatedSrs = this.srsService.calculateNextReview(targetWord.srsData, command.qualityScore);
      if (command.qualityScore >= 3) {
        targetWord.recordCorrectUsage(updatedSrs);
      } else {
        targetWord.recordIncorrectUsage(updatedSrs);
      }

      await this.memoryRepo.saveWord(targetWord);

      const appEvent = new ReviewCompletedEvent(command.studentId, {
        studentId: command.studentId,
        wordsReviewedCount: 1,
      });
      await this.eventPublisher.publish(appEvent);

      this.logger.info(`Word ${command.wordId} reviewed by student ${command.studentId}`);
      applicationTelemetry.endSpan(span, true, { publishedEventsCount: 1 });

      return ReviewItemMapper.toDTO(targetWord);
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}

export class PlacementAssessmentUseCase {
  constructor(
    private readonly studentRepo: IStudentRepository,
    private readonly logger: ILogger
  ) {}

  public async execute(command: PlacementAssessmentCommand): Promise<{ studentId: string; assessedLevel: string }> {
    const span = applicationTelemetry.startSpan('PlacementAssessmentUseCase', { command });
    try {
      const student = await this.studentRepo.findById(StudentId.create(command.studentId));
      if (!student) throw new NotFoundError('Student', command.studentId);

      const score = command.assessmentAnswers.length * 20;
      const assessedLevel = score >= 80 ? 'B2' : score >= 50 ? 'B1' : 'A2';

      this.logger.info(`Placement assessment completed for student ${command.studentId}: level ${assessedLevel}`);
      applicationTelemetry.endSpan(span, true);

      return { studentId: command.studentId, assessedLevel };
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}

export class UpdateLearningThreadsUseCase {
  constructor(
    private readonly studentRepo: IStudentRepository,
    private readonly logger: ILogger
  ) {}

  public async execute(studentId: string, newThreads: string[]): Promise<{ studentId: string; updatedThreads: string[] }> {
    const span = applicationTelemetry.startSpan('UpdateLearningThreadsUseCase', { studentId, newThreads });
    try {
      const student = await this.studentRepo.findById(StudentId.create(studentId));
      if (!student) throw new NotFoundError('Student', studentId);

      this.logger.info(`Updated learning threads for student ${studentId}`, { threads: newThreads });
      applicationTelemetry.endSpan(span, true);

      return { studentId, updatedThreads: newThreads };
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}
