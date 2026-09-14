import { SubscriptionEntity } from '../entities/subscription.entity';
import { SubscriptionPlan, PlanTier } from '../value-objects/subscription-plan.vo';
import { BillingCycle } from '../value-objects/billing-cycle.vo';
import { UsageQuota } from '../value-objects/usage-quota.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';

export class SubscriptionFactory {
  public static createFreeSubscription(studentId: string): SubscriptionEntity {
    const plan = SubscriptionPlan.create('free');
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + 30);

    return SubscriptionEntity.create(`sub_free_${studentId}`, {
      studentId,
      plan,
      cycle: BillingCycle.create('monthly'),
      status: 'active',
      quota: UsageQuota.create(0, plan.maxSessionsPerMonth),
      currentPeriodEnd: TimeStamp.fromDate(periodEnd),
      createdAt: TimeStamp.now(),
    });
  }

  public static createProSubscription(studentId: string, tier: PlanTier = 'pro'): SubscriptionEntity {
    const plan = SubscriptionPlan.create(tier);
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + 30);

    return SubscriptionEntity.create(`sub_${tier}_${studentId}`, {
      studentId,
      plan,
      cycle: BillingCycle.create('monthly'),
      status: 'active',
      quota: UsageQuota.create(0, plan.maxSessionsPerMonth),
      currentPeriodEnd: TimeStamp.fromDate(periodEnd),
      createdAt: TimeStamp.now(),
    });
  }
}
