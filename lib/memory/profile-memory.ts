import { ProfileMemory } from '@/types/memory';

/**
 * Profile Memory Module
 * Manages user base preferences, native/target languages, and CEFR level.
 */
export class ProfileMemoryService {
  private memory: ProfileMemory;

  constructor(initialProfile?: Partial<ProfileMemory>) {
    this.memory = {
      userId: initialProfile?.userId || 'usr_default',
      nativeLanguage: initialProfile?.nativeLanguage || 'en',
      targetLanguages: initialProfile?.targetLanguages || ['es', 'fr', 'de'],
      uiLanguage: initialProfile?.uiLanguage || 'en',
      cefrLevel: initialProfile?.cefrLevel || 'A2',
      createdDate: initialProfile?.createdDate || new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };
  }

  public get(): ProfileMemory {
    return { ...this.memory };
  }

  public update(patch: Partial<ProfileMemory>): ProfileMemory {
    this.memory = {
      ...this.memory,
      ...patch,
      updatedDate: new Date().toISOString(),
    };
    return { ...this.memory };
  }

  public setCefrLevel(level: ProfileMemory['cefrLevel']): void {
    this.memory.cefrLevel = level;
    this.memory.updatedDate = new Date().toISOString();
  }
}
