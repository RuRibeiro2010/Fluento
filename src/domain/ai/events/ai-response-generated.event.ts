import { BaseDomainEvent } from '../../shared/domain-event';

export class AiResponseGeneratedEvent extends BaseDomainEvent {
  constructor(sessionId: string, modelUsed: string, latencyMs: number) {
    super('AiResponseGenerated', sessionId, {
      sessionId,
      modelUsed,
      latencyMs,
    });
  }
}
