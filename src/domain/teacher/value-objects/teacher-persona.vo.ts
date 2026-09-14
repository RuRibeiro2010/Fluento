import { ValueObject } from '../../shared/value-object';
import { InvalidTeacherPersonaError } from '../errors/teacher.errors';

export type PersonalityStyle = 'encouraging' | 'strict' | 'casual' | 'socratic' | 'academic';
export type AccentType = 'es-ES' | 'es-MX' | 'es-AR' | 'es-CO';

interface TeacherPersonaProps {
  name: string;
  avatarUrl: string;
  personality: PersonalityStyle;
  accent: AccentType;
  speechRate: number; // e.g., 0.85 to 1.15
  specialty: string;
  bio: string;
}

export class TeacherPersona extends ValueObject<TeacherPersonaProps> {
  private constructor(props: TeacherPersonaProps) {
    super(props);
  }

  public static create(props: TeacherPersonaProps): TeacherPersona {
    if (!props.name || props.name.trim().length === 0) {
      throw new InvalidTeacherPersonaError('Teacher name cannot be empty.');
    }
    if (props.speechRate < 0.5 || props.speechRate > 2.0) {
      throw new InvalidTeacherPersonaError('Speech rate must be between 0.5 and 2.0.');
    }
    return new TeacherPersona({
      ...props,
      name: props.name.trim(),
    });
  }

  get name(): string {
    return this.props.name;
  }

  get avatarUrl(): string {
    return this.props.avatarUrl;
  }

  get personality(): PersonalityStyle {
    return this.props.personality;
  }

  get accent(): AccentType {
    return this.props.accent;
  }

  get speechRate(): number {
    return this.props.speechRate;
  }

  get specialty(): string {
    return this.props.specialty;
  }

  get bio(): string {
    return this.props.bio;
  }
}
