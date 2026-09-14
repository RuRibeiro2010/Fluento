import { Entity } from '../../shared/entity';
import { ModelAlias } from '../value-objects/model-alias.vo';
import { PedagogicalDirective } from '../value-objects/pedagogical-directive.vo';

export interface AiPromptContextProps {
  systemInstructions: string;
  teacherPersonaName: string;
  studentLevel: string;
  directive: PedagogicalDirective;
  modelAlias: ModelAlias;
  temperature: number;
}

export class AiPromptContextEntity extends Entity<AiPromptContextProps> {
  private constructor(id: string, props: AiPromptContextProps) {
    super(id, props);
  }

  public static create(id: string, props: AiPromptContextProps): AiPromptContextEntity {
    return new AiPromptContextEntity(id, props);
  }

  get systemInstructions(): string {
    return this._props.systemInstructions;
  }

  get teacherPersonaName(): string {
    return this._props.teacherPersonaName;
  }

  get studentLevel(): string {
    return this._props.studentLevel;
  }

  get directive(): PedagogicalDirective {
    return this._props.directive;
  }

  get modelAlias(): ModelAlias {
    return this._props.modelAlias;
  }

  get temperature(): number {
    return this._props.temperature;
  }
}
