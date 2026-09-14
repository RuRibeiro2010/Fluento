import { DomainError } from '../../shared/domain-error';

export class TeacherNotFoundError extends DomainError {
  constructor(teacherId: string) {
    super(`Teacher with ID '${teacherId}' was not found.`, 'TEACHER_NOT_FOUND');
  }
}

export class InvalidTeacherPersonaError extends DomainError {
  constructor(reason: string) {
    super(`Invalid Teacher Persona: ${reason}`, 'INVALID_TEACHER_PERSONA');
  }
}
