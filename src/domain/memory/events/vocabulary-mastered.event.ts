import { BaseDomainEvent } from '../../shared/domain-event';

export class VocabularyMasteredEvent extends BaseDomainEvent {
  constructor(studentId: string, wordId: string, word: string) {
    super('VocabularyMastered', studentId, {
      studentId,
      wordId,
      word,
    });
  }
}

export class ErrorPatternDetectedEvent extends BaseDomainEvent {
  constructor(studentId: string, concept: string, category: string, frequency: number) {
    super('ErrorPatternDetected', studentId, {
      studentId,
      concept,
      category,
      frequency,
    });
  }
}
