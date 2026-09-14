import { ISubscriptionRepository } from '../../domain/billing/repositories/subscription-repository.interface';
import { SubscriptionFactory } from '../../domain/billing/factories/subscription.factory';
import { SubscriptionValidator } from '../validators/application.validators';
import { SubscriptionMapper } from '../mappers/application.mappers';
import { SubscriptionDTO } from '../dto/application.dtos';
import { UpgradeSubscriptionCommand } from '../commands/application.commands';
import { NotFoundError } from '../errors/application-error';
import { applicationTelemetry } from '../telemetry/telemetry.service';
import { SubscriptionUpgradedEvent } from '../events/application-events';
import { IEventPublisher, ILogger } from '../contracts/infrastructure.contracts';

export class UpgradeSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepo: ISubscriptionRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly logger: ILogger
  ) {}

  public async execute(command: UpgradeSubscriptionCommand): Promise<SubscriptionDTO> {
    const span = applicationTelemetry.startSpan('UpgradeSubscriptionUseCase', { command });
    try {
      SubscriptionValidator.validateUpgradeCommand(command);

      let sub = await this.subscriptionRepo.findByStudentId(command.studentId);
      if (!sub) {
        sub = SubscriptionFactory.createFreeSubscription(command.studentId);
      }

      sub.upgradePlan(command.targetPlanTier);
      await this.subscriptionRepo.save(sub);

      const appEvent = new SubscriptionUpgradedEvent(command.studentId, {
        studentId: command.studentId,
        newPlanTier: command.targetPlanTier,
      });
      await this.eventPublisher.publish(appEvent);

      this.logger.info(`Subscription upgraded to ${command.targetPlanTier} for student ${command.studentId}`);
      applicationTelemetry.endSpan(span, true, { publishedEventsCount: 1 });

      return SubscriptionMapper.toDTO(sub);
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}
