import { ValueObject } from '../../shared/value-object';
import { InvalidArgumentError } from '../../shared/domain-error';

export type PlanTier = 'free' | 'pro' | 'executive';

interface SubscriptionPlanProps {
  tier: PlanTier;
  monthlyPriceEur: number;
  maxSessionsPerMonth: number;
  unlimitedVoiceMinutes: boolean;
  priorityCoachAccess: boolean;
}

export class SubscriptionPlan extends ValueObject<SubscriptionPlanProps> {
  private constructor(props: SubscriptionPlanProps) {
    super(props);
  }

  public static create(tier: PlanTier): SubscriptionPlan {
    switch (tier) {
      case 'free':
        return new SubscriptionPlan({
          tier: 'free',
          monthlyPriceEur: 0,
          maxSessionsPerMonth: 5,
          unlimitedVoiceMinutes: false,
          priorityCoachAccess: false,
        });
      case 'pro':
        return new SubscriptionPlan({
          tier: 'pro',
          monthlyPriceEur: 19.9,
          maxSessionsPerMonth: 50,
          unlimitedVoiceMinutes: true,
          priorityCoachAccess: true,
        });
      case 'executive':
        return new SubscriptionPlan({
          tier: 'executive',
          monthlyPriceEur: 49.9,
          maxSessionsPerMonth: 999,
          unlimitedVoiceMinutes: true,
          priorityCoachAccess: true,
        });
      default:
        throw new InvalidArgumentError(`Invalid plan tier '${tier}'.`);
    }
  }

  get tier(): PlanTier {
    return this.props.tier;
  }

  get monthlyPriceEur(): number {
    return this.props.monthlyPriceEur;
  }

  get maxSessionsPerMonth(): number {
    return this.props.maxSessionsPerMonth;
  }

  get unlimitedVoiceMinutes(): boolean {
    return this.props.unlimitedVoiceMinutes;
  }

  get priorityCoachAccess(): boolean {
    return this.props.priorityCoachAccess;
  }
}
