import { AiPromptFactory } from '../../domain/ai/factories/ai-prompt.factory';
import { PromptMapper } from '../mappers/application.mappers';
import { PromptDTO } from '../dto/application.dtos';
import { applicationTelemetry } from '../telemetry/telemetry.service';
import { ILogger } from '../contracts/infrastructure.contracts';

export class GeneratePromptUseCase {
  constructor(private readonly logger: ILogger) {}

  public async execute(teacherName = 'Prof. Sofia', level = 'A2'): Promise<PromptDTO> {
    const span = applicationTelemetry.startSpan('GeneratePromptUseCase', { teacherName, level });
    try {
      const context = AiPromptFactory.createDefaultContext(teacherName, level);
      const dto = PromptMapper.toDTO(context);

      this.logger.info(`Prompt generated for teacher ${teacherName}`);
      applicationTelemetry.endSpan(span, true);

      return dto;
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}
