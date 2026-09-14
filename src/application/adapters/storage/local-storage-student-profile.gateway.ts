import { IStudentProfileStorageGateway } from '../../contracts/student-storage.contract';
import { StudentProfileData } from '../../../domain/student/entities/student-profile.entity';
import { StudentProfileMapper } from '../../mappers/student-profile.mapper';
import { studentDigitalTwin } from '../../../lib/student-digital-twin';
import { UserProfile } from '../../../../types/profile';

export class LocalStorageStudentProfileGateway implements IStudentProfileStorageGateway {
  private inMemoryFallback: Map<string, StudentProfileData> = new Map();

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  public async loadProfile(studentId: string): Promise<StudentProfileData | null> {
    // 1. Check in-memory store
    if (this.inMemoryFallback.has(studentId)) {
      return this.inMemoryFallback.get(studentId)!;
    }

    if (!this.isBrowser()) {
      return null;
    }

    try {
      // 2. Check canonical student profile key
      const canonicalKey = `fluento_student_profile_${studentId}`;
      const rawCanonical = window.localStorage.getItem(canonicalKey);
      if (rawCanonical) {
        const parsed = JSON.parse(rawCanonical) as StudentProfileData;
        this.inMemoryFallback.set(studentId, parsed);
        return parsed;
      }

      // 3. Fallback & Migration: Check legacy fluento_user_profile
      const rawLegacy = window.localStorage.getItem('fluento_user_profile');
      if (rawLegacy) {
        const parsedLegacy = JSON.parse(rawLegacy) as UserProfile;
        if (!parsedLegacy.id || parsedLegacy.id === studentId || studentId === 'usr_fluento_primary' || studentId === 'demo-user') {
          const migrated = StudentProfileMapper.legacyToProfile(parsedLegacy);
          // Persist the migrated profile for future canonical access
          await this.saveProfile(migrated);
          return migrated;
        }
      }

      // 4. Fallback: Check existing Digital Twin snapshot
      const rawTwin = window.localStorage.getItem(`fluento_twin_${studentId}`);
      if (rawTwin) {
        const parsedTwin = JSON.parse(rawTwin);
        if (parsedTwin.identity && parsedTwin.language) {
          const profileFromTwin = StudentProfileMapper.twinToProfile(parsedTwin);
          await this.saveProfile(profileFromTwin);
          return profileFromTwin;
        }
      }
    } catch (err) {
      console.warn('[LocalStorageStudentProfileGateway] Error reading profile from storage:', err);
    }

    return null;
  }

  public async saveProfile(profile: StudentProfileData): Promise<void> {
    const updatedProfile: StudentProfileData = {
      ...profile,
      updatedAtIso: new Date().toISOString(),
      lastSyncedAtIso: new Date().toISOString(),
    };

    // 1. Update in-memory fallback
    this.inMemoryFallback.set(profile.id, updatedProfile);

    if (this.isBrowser()) {
      try {
        // 2. Save canonical student profile
        const canonicalKey = `fluento_student_profile_${profile.id}`;
        window.localStorage.setItem(canonicalKey, JSON.stringify(updatedProfile));

        // 3. Backward Compatibility: Synchronize legacy fluento_user_profile
        const legacyProfile = StudentProfileMapper.profileToLegacy(updatedProfile);
        window.localStorage.setItem('fluento_user_profile', JSON.stringify(legacyProfile));

        // 4. Backward Compatibility: Synchronize Digital Twin state
        try {
          const partialTwin = StudentProfileMapper.profileToTwin(updatedProfile);
          studentDigitalTwin.updateTwin(profile.id, partialTwin);
        } catch (twinErr) {
          // If twin doesn't exist yet, getOrCreateTwin will initialize it
          studentDigitalTwin.getOrCreateTwin(profile.id, profile.name, profile.email);
        }
      } catch (err) {
        console.warn('[LocalStorageStudentProfileGateway] Error persisting profile to localStorage:', err);
      }
    }
  }

  public async deleteProfile(studentId: string): Promise<void> {
    this.inMemoryFallback.delete(studentId);

    if (this.isBrowser()) {
      try {
        window.localStorage.removeItem(`fluento_student_profile_${studentId}`);
        const rawLegacy = window.localStorage.getItem('fluento_user_profile');
        if (rawLegacy) {
          const parsed = JSON.parse(rawLegacy);
          if (parsed.id === studentId) {
            window.localStorage.removeItem('fluento_user_profile');
          }
        }
      } catch (err) {
        console.warn('[LocalStorageStudentProfileGateway] Error removing profile from localStorage:', err);
      }
    }
  }

  public async hasProfile(studentId: string): Promise<boolean> {
    if (this.inMemoryFallback.has(studentId)) {
      return true;
    }
    if (this.isBrowser()) {
      return window.localStorage.getItem(`fluento_student_profile_${studentId}`) !== null ||
        window.localStorage.getItem('fluento_user_profile') !== null;
    }
    return false;
  }

  /**
   * Clears memory cache (useful for testing).
   */
  public clearMemory(): void {
    this.inMemoryFallback.clear();
  }
}
