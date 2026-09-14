import { DomainError } from '../../shared/domain-error';

export class AnalyticsDataNotFoundError extends DomainError {
  constructor(studentId: string) {
    super(`Analytics data for student '${studentId}' was not found.`, 'ANALYTICS_DATA_NOT_FOUND');
  }
}
