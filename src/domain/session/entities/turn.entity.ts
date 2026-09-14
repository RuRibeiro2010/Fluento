import { Entity } from '../../shared/entity';
import { TurnId } from '../value-objects/turn-id.vo';
import { Utterance } from '../value-objects/utterance.vo';
import { SpeakingMetrics } from '../value-objects/speaking-metrics.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';

export interface TurnProps {
  turnIndex: number;
  userUtterance: Utterance;
  teacherUtterance: Utterance;
  pedagogicalFeedback?: string;
  metrics?: SpeakingMetrics;
  timestamp: TimeStamp;
}

export class TurnEntity extends Entity<TurnProps> {
  private constructor(id: string, props: TurnProps) {
    super(id, props);
  }

  public static create(id: TurnId, props: TurnProps): TurnEntity {
    return new TurnEntity(id.value, props);
  }

  get turnId(): TurnId {
    return TurnId.create(this._id);
  }

  get turnIndex(): number {
    return this._props.turnIndex;
  }

  get userUtterance(): Utterance {
    return this._props.userUtterance;
  }

  get teacherUtterance(): Utterance {
    return this._props.teacherUtterance;
  }

  get pedagogicalFeedback(): string | undefined {
    return this._props.pedagogicalFeedback;
  }

  get metrics(): SpeakingMetrics | undefined {
    return this._props.metrics;
  }

  get timestamp(): TimeStamp {
    return this._props.timestamp;
  }
}
