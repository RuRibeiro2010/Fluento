import { DomainError } from '../../shared/domain-error';

export class MemoryItemNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Memory item '${id}' was not found.`, 'MEMORY_ITEM_NOT_FOUND');
  }
}
