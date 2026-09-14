import { Entity } from '../../shared/entity';
import { SessionId } from '../value-objects/session-id.vo';
import { TurnEntity } from './turn.entity';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';
import { SessionAlreadyClosedError } from '../errors/session.errors';
import { SessionEndedEvent, TurnProcessedEvent } from '../events/session-started.event';

export type SessionState = 'active' | 'paused' | 'completed' | 'abandoned';

export interface SessionProps {
  studentId: string;
  lessonId: string;
  teacherId: string;
  state: SessionState;
  turns: TurnEntity[];
  startedAt: TimeStamp;
  endedAt?: TimeStamp;
  overallScore?: number;
}

export class SessionEntity extends Entity<SessionProps> {
  private constructor(id: string, props: SessionProps) {
    super(id, props);
  }

  public static create(id: SessionId, props: SessionProps): SessionEntity {
    return new SessionEntity(id.value, props);
  }

  get sessionId(): SessionId {
    return SessionId.create(this._id);
  }

  get studentId(): string {
    return this._props.studentId;
  }

  get lessonId(): string {
    return this._props.lessonId;
  }

  get teacherId(): string {
    return this._props.teacherId;
  }

  get state(): SessionState {
    return this._props.state;
  }

  get turns(): ReadonlyArray<TurnEntity> {
    return [...this._props.turns];
  }

  get startedAt(): TimeStamp {
    return this._props.startedAt;
  }

  get endedAt(): TimeStamp | undefined {
    return this._props.endedAt;
  }

  get overallScore(): number | undefined {
    return this._props.overallScore;
  }

  public addTurn(turn: TurnEntity): void {
    if (this._props.state === 'completed' || this._props.state === 'abandoned') {
      throw new SessionAlreadyClosedError(this._id);
    }
    this._props.turns.push(turn);
    const turnScore = turn.metrics ? turn.metrics.calculateCompositeScore() : 75;
    this.addDomainEvent(new TurnProcessedEvent(this._id, turn.id, turn.turnIndex, turnScore));
  }

  public closeSession(finalScore?: number): void {
    if (this._props.state === 'completed') return;

    this._props.state = 'completed';
    this._props.endedAt = TimeStamp.now();

    const calculatedScore = finalScore !== undefined ? finalScore : this.calculateAverageScore();
    this._props.overallScore = calculatedScore;

    const durationSec = Math.round(
      (this._props.endedAt.value.getTime() - this._props.startedAt.value.getTime()) / 1000
    );

    this.addDomainEvent(
      new SessionEndedEvent(
        this._id,
        this._props.studentId,
        this._props.turns.length,
        calculatedScore,
        durationSec
      )
    );
  }

  private calculateAverageScore(): number {
    if (this._props.turns.length === 0) return 70;
    let sum = 0;
    let count = 0;
    for (const t of this._props.turns) {
      if (t.metrics) {
        sum += t.metrics.calculateCompositeScore();
        count++;
      }
    }
    return count > 0 ? Math.round(sum / count) : 75;
  }
}
