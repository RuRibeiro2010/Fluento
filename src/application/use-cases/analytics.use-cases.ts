import { IAnalyticsRepository } from '../../domain/analytics/repositories/analytics-repository.interface';
import { AnalyticsFactory } from '../../domain/analytics/factories/analytics.factory';
import { AnalyticsMapper } from '../mappers/application.mappers';
import { AnalyticsDTO } from '../dto/application.dtos';
import { NotFoundError } from '../errors/application-error';
import { applicationTelemetry } from '../telemetry/telemetry.service';
import { AnalyticsGeneratedEvent } from '../events/application-events';
import { IEventPublisher, ILogger } from '../contracts/infrastructure.contracts';

export class GenerateAnalyticsUseCase {
  constructor(
    private readonly analyticsRepo: IAnalyticsRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly logger: ILogger
  ) {}

  public async execute(studentId: string): Promise<AnalyticsDTO> {
    const span = applicationTelemetry.startSpan('GenerateAnalyticsUseCase', { studentId });
    try {
      let analytics = await this.analyticsRepo.findByStudentId(studentId);
      if (!analytics) {
        analytics = AnalyticsFactory.createDefaultAnalytics(studentId);
        await this.analyticsRepo.save(analytics);
      }

      const dto = AnalyticsMapper.toDTO(analytics);

      const appEvent = new AnalyticsGeneratedEvent(studentId, {
        studentId,
        fluencyScore: dto.fluencyIndex.overallScore,
      });
      await this.eventPublisher.publish(appEvent);

      this.logger.info(`Analytics generated for student ${studentId}`);
      applicationTelemetry.endSpan(span, true, { publishedEventsCount: 1 });

      return dto;
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}
