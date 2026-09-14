import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { StudentId } from '../../domain/student/value-objects/student-id.vo';
import { StudentMapper } from '../mappers/application.mappers';
import { StudentDTO } from '../dto/application.dtos';
import { NotFoundError } from '../errors/application-error';
import { applicationTelemetry } from '../telemetry/telemetry.service';
import { StudentUpdatedEvent } from '../events/application-events';
import { IEventPublisher, ILogger } from '../contracts/infrastructure.contracts';

export class SyncStudentDigitalTwinUseCase {
  constructor(
    private readonly studentRepo: IStudentRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly logger: ILogger
  ) {}

  public async execute(studentId: string): Promise<StudentDTO> {
    const span = applicationTelemetry.startSpan('SyncStudentDigitalTwinUseCase', { studentId });
    try {
      const student = await this.studentRepo.findById(StudentId.create(studentId));
      if (!student) throw new NotFoundError('Student', studentId);

      const dto = StudentMapper.toDTO(student);

      const appEvent = new StudentUpdatedEvent(studentId, {
        studentId,
        updatedFields: ['digitalTwinSynced'],
      });
      await this.eventPublisher.publish(appEvent);

      this.logger.info(`Student Digital Twin synchronized for ${studentId}`);
      applicationTelemetry.endSpan(span, true, { publishedEventsCount: 1 });

      return dto;
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      throw err;
    }
  }
}
