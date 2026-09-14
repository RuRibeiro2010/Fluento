/**
 * FLUENTO STUDENT DIGITAL TWIN - IDENTITY PROFILE
 * 
 * Manages core identity parameters for student profiles.
 */

import { IdentityProfile } from './types';

export class IdentityProfileManager {
  public createDefaultIdentity(studentId: string, name?: string, email?: string): IdentityProfile {
    const nowIso = new Date().toISOString();
    return {
      studentId,
      name: name || 'Aluno Fluento',
      email: email || `${studentId}@aluno.fluento.ai`,
      nativeLanguage: 'pt-PT',
      targetLanguage: 'en-US',
      timezone: 'Europe/Lisbon',
      createdAtIso: nowIso,
      lastActiveIso: nowIso
    };
  }
}

export const identityProfileManager = new IdentityProfileManager();
