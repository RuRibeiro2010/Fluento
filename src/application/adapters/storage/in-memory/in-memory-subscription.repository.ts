import { SubscriptionEntity } from '../../../../domain/billing/entities/subscription.entity';
import { ISubscriptionRepository } from '../../../../domain/billing/repositories/subscription-repository.interface';

/**
 * IN-MEMORY SUBSCRIPTION REPOSITORY
 *
 * Default production implementation of `ISubscriptionRepository`. See
 * `in-memory-student.repository.ts` for the rationale and Sprint
 * 16A.4.1 relocation notes. Behavior is unchanged from the previous
 * implementation in `src/application/__tests__/fixtures.ts`.
 */
export class InMemorySubscriptionRepository implements ISubscriptionRepository {
  private subs = new Map<string, SubscriptionEntity>();

  public async findByStudentId(studentId: string): Promise<SubscriptionEntity | null> {
    for (const sub of this.subs.values()) {
      if (sub.studentId === studentId) return sub;
    }
    return null;
  }

  public async save(subscription: SubscriptionEntity): Promise<void> {
    this.subs.set(subscription.id, subscription);
  }
}
