import { DomainError } from '../../shared/domain-error';

export class SubscriptionNotFoundError extends DomainError {
  constructor(studentId: string) {
    super(`Subscription for student '${studentId}' was not found.`, 'SUBSCRIPTION_NOT_FOUND');
  }
}

export class QuotaExceededError extends DomainError {
  constructor(featureName: string, currentUsage: number, limit: number) {
    super(
      `Usage quota for '${featureName}' exceeded. Current usage: ${currentUsage}, Limit: ${limit}. Upgrade plan to continue.`,
      'QUOTA_EXCEEDED'
    );
  }
}
