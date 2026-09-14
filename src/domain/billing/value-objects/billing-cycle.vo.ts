import { ValueObject } from '../../shared/value-object';

export type CycleInterval = 'monthly' | 'annual';

interface BillingCycleProps {
  interval: CycleInterval;
  discountPercentage: number;
}

export class BillingCycle extends ValueObject<BillingCycleProps> {
  private constructor(props: BillingCycleProps) {
    super(props);
  }

  public static create(interval: CycleInterval): BillingCycle {
    return new BillingCycle({
      interval,
      discountPercentage: interval === 'annual' ? 20 : 0,
    });
  }

  get interval(): CycleInterval {
    return this.props.interval;
  }

  get discountPercentage(): number {
    return this.props.discountPercentage;
  }
}
