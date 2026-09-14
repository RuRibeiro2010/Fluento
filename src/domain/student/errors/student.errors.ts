import { DomainError } from '../../shared/domain-error';

export class StudentNotFoundError extends DomainError {
  constructor(studentId: string) {
    super(`Student with ID '${studentId}' was not found.`, 'STUDENT_NOT_FOUND');
  }
}

export class InvalidSkillMatrixError extends DomainError {
  constructor(reason: string) {
    super(`Invalid Skill Matrix: ${reason}`, 'INVALID_SKILL_MATRIX');
  }
}

export class InactiveStudentError extends DomainError {
  constructor(studentId: string) {
    super(`Student '${studentId}' is inactive and cannot perform this operation.`, 'INACTIVE_STUDENT');
  }
}
