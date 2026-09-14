import { DomainError } from '../../shared/domain-error';

export class StudyPlanNotFoundError extends DomainError {
  constructor(studentId: string) {
    super(`Study plan for student '${studentId}' was not found.`, 'STUDY_PLAN_NOT_FOUND');
  }
}

export class MissionAlreadyCompletedError extends DomainError {
  constructor(missionId: string) {
    super(`Mission '${missionId}' is already completed.`, 'MISSION_ALREADY_COMPLETED');
  }
}
