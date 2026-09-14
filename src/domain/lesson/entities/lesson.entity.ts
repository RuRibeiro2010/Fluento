import { Entity } from '../../shared/entity';
import { LessonId } from '../value-objects/lesson-id.vo';
import { LessonObjective } from '../value-objects/lesson-objective.vo';
import { LessonStatus } from '../value-objects/lesson-status.vo';
import { CEFRLevel } from '../../shared/value-objects/cefr-level.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';
import { LessonCompletedEvent } from '../events/lesson-created.event';

export interface LessonProps {
  title: string;
  objective: LessonObjective;
  cefrLevel: CEFRLevel;
  estimatedMinutes: number;
  topicTag: string;
  scenarioRoleplay?: string;
  status: LessonStatus;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
}

export class LessonEntity extends Entity<LessonProps> {
  private constructor(id: string, props: LessonProps) {
    super(id, props);
  }

  public static create(id: LessonId, props: LessonProps): LessonEntity {
    return new LessonEntity(id.value, props);
  }

  get lessonId(): LessonId {
    return LessonId.create(this._id);
  }

  get title(): string {
    return this._props.title;
  }

  get objective(): LessonObjective {
    return this._props.objective;
  }

  get cefrLevel(): CEFRLevel {
    return this._props.cefrLevel;
  }

  get estimatedMinutes(): number {
    return this._props.estimatedMinutes;
  }

  get topicTag(): string {
    return this._props.topicTag;
  }

  get status(): LessonStatus {
    return this._props.status;
  }

  public startLesson(): void {
    this._props.status = this._props.status.transitionTo('in_progress');
    this._props.updatedAt = TimeStamp.now();
  }

  public markCompleted(studentId: string, score: number, durationSeconds: number): void {
    this._props.status = this._props.status.transitionTo('completed');
    this._props.updatedAt = TimeStamp.now();
    this.addDomainEvent(new LessonCompletedEvent(this._id, studentId, score, durationSeconds));
  }
}
