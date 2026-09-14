import { Entity } from '../../shared/entity';
import { CompetencyId } from '../value-objects/competency-id.vo';
import { MissionAlreadyCompletedError } from '../errors/learning.errors';

export interface MissionProps {
  title: string;
  description: string;
  targetCompetency: CompetencyId;
  completed: boolean;
  completedAt?: Date;
}

export class MissionEntity extends Entity<MissionProps> {
  private constructor(id: string, props: MissionProps) {
    super(id, props);
  }

  public static create(id: string, props: MissionProps): MissionEntity {
    return new MissionEntity(id, props);
  }

  get title(): string {
    return this._props.title;
  }

  get description(): string {
    return this._props.description;
  }

  get targetCompetency(): CompetencyId {
    return this._props.targetCompetency;
  }

  get isCompleted(): boolean {
    return this._props.completed;
  }

  public complete(): void {
    if (this._props.completed) {
      throw new MissionAlreadyCompletedError(this._id);
    }
    this._props.completed = true;
    this._props.completedAt = new Date();
  }
}
