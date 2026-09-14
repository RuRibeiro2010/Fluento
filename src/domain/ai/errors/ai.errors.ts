import { DomainError } from '../../shared/domain-error';

export class AiGenerationError extends DomainError {
  constructor(modelAlias: string, reason: string) {
    super(`AI generation with model '${modelAlias}' failed: ${reason}`, 'AI_GENERATION_FAILED');
  }
}

export class InvalidModelAliasError extends DomainError {
  constructor(alias: string) {
    super(`Model alias '${alias}' is not supported in domain rules.`, 'INVALID_MODEL_ALIAS');
  }
}
