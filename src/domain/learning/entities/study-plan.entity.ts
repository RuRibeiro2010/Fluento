import { Entity } from '../../shared/entity';
import { MissionEntity } from './mission.entity';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';
import { MissionCompletedEvent } from '../events/study-plan-generated.event';

export interface StudyPlanProps {
  studentId: string;
  primaryObjective: string;
  keyCompetencies: string[];
  estimatedEvolutionMonths: number;
  missions: MissionEntity[];
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
}

export class StudyPlanEntity extends Entity<StudyPlanProps> {
  private constructor(id: string, props: StudyPlanProps) {
    super(id, props);
  }

  public static create(id: string, props: StudyPlanProps): StudyPlanEntity {
    return new StudyPlanEntity(id, props);
  }

  get studentId(): string {
    return this._props.studentId;
  }

  get primaryObjective(): string {
    return this._props.primaryObjective;
  }

  get keyCompetencies(): string[] {
    return [...this._props.keyCompetencies];
  }

  get estimatedEvolutionMonths(): number {
    return this._props.estimatedEvolutionMonths;
  }

  get missions(): ReadonlyArray<MissionEntity> {
    return [...this._props.missions];
  }

  public completeMission(missionId: string): void {
    const mission = this._props.missions.find((m) => m.id === missionId);
    if (mission && !mission.isCompleted) {
      mission.complete();
      this._props.updatedAt = TimeStamp.now();
      this.addDomainEvent(new MissionCompletedEvent(this._props.studentId, mission.id, mission.title));
    }
  }
}
