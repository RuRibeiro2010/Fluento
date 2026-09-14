import { BaseDomainEvent } from '../../shared/domain-event';

export class StudentRegisteredEvent extends BaseDomainEvent {
  constructor(studentId: string, email: string, nativeLanguage: string, targetLanguage: string) {
    super('StudentRegistered', studentId, {
      studentId,
      email,
      nativeLanguage,
      targetLanguage,
    });
  }
}

export class StudentProfileUpdatedEvent extends BaseDomainEvent {
  constructor(studentId: string, updatedFields: string[]) {
    super('StudentProfileUpdated', studentId, {
      studentId,
      updatedFields,
    });
  }
}
