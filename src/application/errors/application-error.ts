export abstract class ApplicationError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, code: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

export class PermissionDeniedError extends ApplicationError {
  constructor(message = 'Acesso negado para realizar esta operação.') {
    super(message, 'PERMISSION_DENIED');
  }
}

export class SubscriptionExpiredError extends ApplicationError {
  constructor(message = 'Subscrição expirada ou inativa.') {
    super(message, 'SUBSCRIPTION_EXPIRED');
  }
}

export class LessonUnavailableError extends ApplicationError {
  constructor(lessonId: string, reason?: string) {
    super(`A lição '${lessonId}' não está disponível${reason ? `: ${reason}` : '.'}`, 'LESSON_UNAVAILABLE');
  }
}

export class AnalyticsUnavailableError extends ApplicationError {
  constructor(studentId: string) {
    super(`Os dados analíticos do aluno '${studentId}' não se encontram disponíveis.`, 'ANALYTICS_UNAVAILABLE');
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resourceName: string, identifier: string) {
    super(`${resourceName} com identificador '${identifier}' não foi encontrado.`, 'NOT_FOUND');
  }
}
