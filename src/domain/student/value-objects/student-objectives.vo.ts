import { ValueObject } from '../../shared/value-object';

export interface StudentObjectivesProps {
  readonly primaryMotivation: string;
  readonly professionalDomain?: string;
  readonly currentFocus: string;
  readonly targetExamOrMilestone?: string;
}

export class StudentObjectives extends ValueObject<StudentObjectivesProps> {
  private constructor(props: StudentObjectivesProps) {
    super(props);
  }

  public static create(props: Partial<StudentObjectivesProps>): StudentObjectives {
    return new StudentObjectives({
      primaryMotivation: props.primaryMotivation || 'Fluência executiva e internacional',
      professionalDomain: props.professionalDomain || 'Gestão & Tecnologia',
      currentFocus: props.currentFocus || 'Apresentação Executiva & Negociação de Ideias',
      targetExamOrMilestone: props.targetExamOrMilestone || 'Certificação B2 / Reuniões Globais',
    });
  }

  get primaryMotivation(): string {
    return this.props.primaryMotivation;
  }

  get professionalDomain(): string | undefined {
    return this.props.professionalDomain;
  }

  get currentFocus(): string {
    return this.props.currentFocus;
  }

  get targetExamOrMilestone(): string | undefined {
    return this.props.targetExamOrMilestone;
  }
}
