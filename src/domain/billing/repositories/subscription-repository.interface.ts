import { SubscriptionEntity } from '../entities/subscription.entity';

export interface ISubscriptionRepository {
  findByStudentId(studentId: string): Promise<SubscriptionEntity | null>;
  save(subscription: SubscriptionEntity): Promise<void>;
}
