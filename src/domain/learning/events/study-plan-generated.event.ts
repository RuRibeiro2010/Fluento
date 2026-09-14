import { BaseDomainEvent } from '../../shared/domain-event';

export class StudyPlanGeneratedEvent extends BaseDomainEvent {
  constructor(studentId: string, planId: string, primaryObjective: string) {
    super('StudyPlanGenerated', studentId, {
      studentId,
      planId,
      primaryObjective,
    });
  }
}

export class MissionCompletedEvent extends BaseDomainEvent {
  constructor(studentId: string, missionId: string, missionTitle: string) {
    super('MissionCompleted', studentId, {
      studentId,
      missionId,
      missionTitle,
    });
  }
}
