import { BaseDomainEvent } from '../../shared/domain-event';

export class AnalyticsSnapshotTakenEvent extends BaseDomainEvent {
  constructor(studentId: string, overallFluencyScore: number) {
    super('AnalyticsSnapshotTaken', studentId, {
      studentId,
      overallFluencyScore,
    });
  }
}
