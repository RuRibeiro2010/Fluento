import { ValueObject } from '../../shared/value-object';
import { InvalidLessonStatusTransitionError } from '../errors/lesson.errors';

export type LessonStatusState = 'draft' | 'available' | 'in_progress' | 'completed' | 'archived';

interface LessonStatusProps {
  state: LessonStatusState;
}

export class LessonStatus extends ValueObject<LessonStatusProps> {
  private constructor(props: LessonStatusProps) {
    super(props);
  }

  public static create(state: LessonStatusState): LessonStatus {
    return new LessonStatus({ state });
  }

  get state(): LessonStatusState {
    return this.props.state;
  }

  public canTransitionTo(next: LessonStatusState): boolean {
    const current = this.props.state;
    if (current === next) return true;

    switch (current) {
      case 'draft':
        return next === 'available';
      case 'available':
        return next === 'in_progress' || next === 'archived';
      case 'in_progress':
        return next === 'completed' || next === 'available';
      case 'completed':
        return next === 'in_progress'; // replay
      case 'archived':
        return next === 'available';
      default:
        return false;
    }
  }

  public transitionTo(next: LessonStatusState): LessonStatus {
    if (!this.canTransitionTo(next)) {
      throw new InvalidLessonStatusTransitionError(this.props.state, next);
    }
    return LessonStatus.create(next);
  }
}
