import { DomainError } from '../../shared/domain-error';

export class SessionNotFoundError extends DomainError {
  constructor(sessionId: string) {
    super(`Session with ID '${sessionId}' was not found.`, 'SESSION_NOT_FOUND');
  }
}

export class SessionAlreadyClosedError extends DomainError {
  constructor(sessionId: string) {
    super(`Session '${sessionId}' is already closed and cannot accept new turns.`, 'SESSION_ALREADY_CLOSED');
  }
}
