import { BaseDomainEvent } from '../../shared/domain-event';

export class SubscriptionChangedEvent extends BaseDomainEvent {
  constructor(studentId: string, oldPlan: string, newPlan: string) {
    super('SubscriptionChanged', studentId, {
      studentId,
      oldPlan,
      newPlan,
    });
  }
}

export class QuotaExceededEvent extends BaseDomainEvent {
  constructor(studentId: string, planTier: string, usage: number, limit: number) {
    super('QuotaExceeded', studentId, {
      studentId,
      planTier,
      usage,
      limit,
    });
  }
}
