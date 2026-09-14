import { ISessionRepository } from '../../domain/session/repositories/session-repository.interface';
import { ILessonRepository } from '../../domain/lesson/repositories/lesson-repository.interface';
import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { ISubscriptionRepository } from '../../domain/billing/repositories/subscription-repository.interface';
import { IAiProviderPort } from '../../domain/ai/repositories/ai-provider-port.interface';
import { SessionFactory } from '../../domain/session/factories/session.factory';
import { SessionValidator } from '../validators/application.validators';
import { SessionMapper } from '../mappers/application.mappers';
import { SessionDTO } from '../dto/application.dtos';
import { StartSessionCommand, FinishSessionCommand, TeacherResponseCommand } from '../commands/application.commands';
import { NotFoundError, SubscriptionExpiredError } from '../errors/application-error';
import { applicationTelemetry } from '../telemetry/telemetry.service';
import { SessionCompletedEvent } from '../events/application-events';
import { IEventPublisher, ILogger } from '../contracts/infrastructure.contracts';
import { SubscriptionEligibilityService } from '../../domain/billing/services/subscription-eligibility.service';
import { Utterance } from '../../domain/session/value-objects/utterance.vo';
import { TurnEntity } from '../../domain/session/entities/turn.entity';
import { TurnId } from '../../domain/session/value-objects/turn-id.vo';
import { TimeStamp } from '../../domain/shared/value-objects/time-stamp.vo';
import { AiPromptFactory } from '../../domain/ai/factories/ai-prompt.factory';
import { StudentId } from '../../domain/student/value-objects/student-id.vo';
import { LessonId } from '../../domain/lesson/value-objects/lesson-id.vo';
import { SessionId } from '../../domain/session/value-objects/session-id.vo';

export class StartSessionUseCase {
  private eligibilityService = new SubscriptionEligibilityService();

  constructor(
    private readonly sessionRepo: ISessionRepository,
    private readonly lessonRepo: ILessonRepository,
    private readonly studentRepo: IStudentRepository,
    private readonly subscriptionRepo: ISubscriptionRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly logger: ILogger
  ) {}

  public async execute(command: StartSessionCommand): Promise<SessionDTO> {
    const span = applicationTelemetry.startSpan('StartSessionUseCase', { command });
    try {
      SessionValidator.validateStartCommand(command);

      const student = await this.studentRepo.findById(StudentId.create(command.studentId));
      if (!student) throw new NotFoundError('Student', command.studentId);

      const lesson = await this.lessonRepo.findById(LessonId.create(command.lessonId));
      if (!lesson) throw new NotFoundError('Lesson', command.lessonId);

      const subscription = await this.subscriptionRepo.findByStudentId(command.studentId);
      if (subscription) {
        const eligibility = this.eligibilityService.canStartSession(subscription);
        if (!eligibility.allowed) {
          throw new SubscriptionExpiredError(eligibility.reason);
        }
        subscription.consumeSession();
        await this.subscriptionRepo.save(subscription);
      }

      const sessionId = `ssn_${Date.now()}`;
      const newSession = SessionFactory.createNewSession(
        sessionId,
        command.studentId,
        command.lessonId,
        'tch_01'
      );

      await this.sessionRepo.save(newSession);

      this.logger.info(`Session ${newSession.id} started for student ${command.studentId}`);
      applicationTelemetry.endSpan(span, true);

      return SessionMapper.toDTO(newSession);
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}

export class FinishSessionUseCase {
  constructor(
    private readonly sessionRepo: ISessionRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly logger: ILogger
  ) {}

  public async execute(command: FinishSessionCommand): Promise<SessionDTO> {
    const span = applicationTelemetry.startSpan('FinishSessionUseCase', { command });
    try {
      SessionValidator.validateFinishCommand(command);

      const session = await this.sessionRepo.findById(SessionId.create(command.sessionId));
      if (!session) throw new NotFoundError('Session', command.sessionId);

      session.closeSession(85);
      await this.sessionRepo.save(session);

      const appEvent = new SessionCompletedEvent(session.id, {
        sessionId: session.id,
        studentId: session.studentId,
        durationMinutes: 15,
      });
      await this.eventPublisher.publish(appEvent);

      this.logger.info(`Session ${session.id} ended successfully.`);
      applicationTelemetry.endSpan(span, true, { publishedEventsCount: 1 });

      return SessionMapper.toDTO(session);
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}

export class ContinueConversationUseCase {
  constructor(
    private readonly sessionRepo: ISessionRepository,
    private readonly aiPort: IAiProviderPort,
    private readonly logger: ILogger
  ) {}

  public async execute(command: TeacherResponseCommand): Promise<{ session: SessionDTO; aiText: string }> {
    const span = applicationTelemetry.startSpan('ContinueConversationUseCase', { command });
    try {
      const session = await this.sessionRepo.findById(SessionId.create(command.sessionId));
      if (!session) throw new NotFoundError('Session', command.sessionId);

      const userUtterance = Utterance.create(command.userUtteranceText, 'es');
      const promptCtx = AiPromptFactory.createDefaultContext('Prof. Sofia', 'A2');

      const aiResponse = await this.aiPort.generateTextResponse(promptCtx, command.userUtteranceText);
      const teacherUtterance = Utterance.create(aiResponse.responseText, 'es');

      const turnIndex = session.turns.length + 1;
      const turn = TurnEntity.create(TurnId.create(`trn_${session.id}_${turnIndex}`), {
        turnIndex,
        userUtterance,
        teacherUtterance,
        timestamp: TimeStamp.now(),
      });

      session.addTurn(turn);
      await this.sessionRepo.save(session);

      this.logger.info(`Turn added to session ${session.id}`);
      applicationTelemetry.endSpan(span, true);

      return {
        session: SessionMapper.toDTO(session),
        aiText: aiResponse.responseText,
      };
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}
