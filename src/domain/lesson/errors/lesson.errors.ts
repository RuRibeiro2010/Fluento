import { DomainError } from '../../shared/domain-error';

export class LessonNotFoundError extends DomainError {
  constructor(lessonId: string) {
    super(`Lesson with ID '${lessonId}' was not found.`, 'LESSON_NOT_FOUND');
  }
}

export class InvalidLessonStatusTransitionError extends DomainError {
  constructor(fromStatus: string, toStatus: string) {
    super(`Cannot transition lesson status from '${fromStatus}' to '${toStatus}'.`, 'INVALID_LESSON_STATUS_TRANSITION');
  }
}
