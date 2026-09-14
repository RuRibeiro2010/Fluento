export abstract class DomainError extends Error {
  public readonly code: string;
  public readonly occurredAt: Date;

  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.occurredAt = new Date();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidArgumentError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_ARGUMENT');
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, id: string) {
    super(`Entity '${entityName}' with ID '${id}' was not found.`, 'ENTITY_NOT_FOUND');
  }
}

export class BusinessRuleViolationError extends DomainError {
  constructor(ruleName: string, details: string) {
    super(`Business rule '${ruleName}' violated: ${details}`, 'BUSINESS_RULE_VIOLATION');
  }
}
