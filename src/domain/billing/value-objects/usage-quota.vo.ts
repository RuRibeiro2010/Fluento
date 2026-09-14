import { ValueObject } from '../../shared/value-object';
import { QuotaExceededError } from '../errors/billing.errors';

interface UsageQuotaProps {
  sessionsUsedThisMonth: number;
  monthlyLimit: number;
}

export class UsageQuota extends ValueObject<UsageQuotaProps> {
  private constructor(props: UsageQuotaProps) {
    super(props);
  }

  public static create(sessionsUsed: number, limit: number): UsageQuota {
    return new UsageQuota({
      sessionsUsedThisMonth: Math.max(0, sessionsUsed),
      monthlyLimit: Math.max(1, limit),
    });
  }

  get sessionsUsedThisMonth(): number {
    return this.props.sessionsUsedThisMonth;
  }

  get monthlyLimit(): number {
    return this.props.monthlyLimit;
  }

  public canConsumeSession(): boolean {
    return this.props.sessionsUsedThisMonth < this.props.monthlyLimit;
  }

  public consumeSession(): UsageQuota {
    if (!this.canConsumeSession()) {
      throw new QuotaExceededError('Aulas Interativas com AI', this.props.sessionsUsedThisMonth, this.props.monthlyLimit);
    }
    return UsageQuota.create(this.props.sessionsUsedThisMonth + 1, this.props.monthlyLimit);
  }
}
