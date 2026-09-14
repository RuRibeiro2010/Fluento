import { SubscriptionEntity } from '../entities/subscription.entity';

export class SubscriptionEligibilityService {
  /**
   * Verifies if a student's active subscription allows launching a new live AI session.
   */
  public canStartSession(subscription: SubscriptionEntity): {
    allowed: boolean;
    reason?: string;
  } {
    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      return {
        allowed: false,
        reason: 'A subscrição do utilizador encontra-se inativa ou pendente de pagamento.',
      };
    }

    if (!subscription.quota.canConsumeSession()) {
      return {
        allowed: false,
        reason: 'Limite mensal de aulas do seu plano atingido. Efetue upgrade para o plano Pro para continuar.',
      };
    }

    return { allowed: true };
  }
}
