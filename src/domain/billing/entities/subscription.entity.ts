import { Entity } from '../../shared/entity';
import { SubscriptionPlan, PlanTier } from '../value-objects/subscription-plan.vo';
import { BillingCycle } from '../value-objects/billing-cycle.vo';
import { UsageQuota } from '../value-objects/usage-quota.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';
import { SubscriptionChangedEvent } from '../events/subscription-changed.event';

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

export interface SubscriptionProps {
  studentId: string;
  plan: SubscriptionPlan;
  cycle: BillingCycle;
  status: SubscriptionStatus;
  quota: UsageQuota;
  currentPeriodEnd: TimeStamp;
  createdAt: TimeStamp;
}

export class SubscriptionEntity extends Entity<SubscriptionProps> {
  private constructor(id: string, props: SubscriptionProps) {
    super(id, props);
  }

  public static create(id: string, props: SubscriptionProps): SubscriptionEntity {
    return new SubscriptionEntity(id, props);
  }

  get studentId(): string {
    return this._props.studentId;
  }

  get plan(): SubscriptionPlan {
    return this._props.plan;
  }

  get cycle(): BillingCycle {
    return this._props.cycle;
  }

  get status(): SubscriptionStatus {
    return this._props.status;
  }

  get quota(): UsageQuota {
    return this._props.quota;
  }

  get currentPeriodEnd(): TimeStamp {
    return this._props.currentPeriodEnd;
  }

  public upgradePlan(newTier: PlanTier): void {
    const oldTier = this._props.plan.tier;
    const newPlan = SubscriptionPlan.create(newTier);

    this._props.plan = newPlan;
    this._props.quota = UsageQuota.create(this._props.quota.sessionsUsedThisMonth, newPlan.maxSessionsPerMonth);
    this.addDomainEvent(new SubscriptionChangedEvent(this._props.studentId, oldTier, newTier));
  }

  public consumeSession(): void {
    this._props.quota = this._props.quota.consumeSession();
  }
}
