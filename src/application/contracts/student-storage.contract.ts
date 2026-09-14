import { StudentProfileData } from '../../domain/student/entities/student-profile.entity';

/**
 * Interface for Student Profile Storage Gateway.
 * Decouples profile persistence from the concrete storage engine (localStorage, Supabase, Cloud SQL, etc.).
 */
export interface IStudentProfileStorageGateway {
  /**
   * Loads a profile by studentId. Returns null if not found.
   */
  loadProfile(studentId: string): Promise<StudentProfileData | null>;

  /**
   * Persists a student profile to storage.
   */
  saveProfile(profile: StudentProfileData): Promise<void>;

  /**
   * Removes a student profile from storage.
   */
  deleteProfile(studentId: string): Promise<void>;

  /**
   * Checks if a profile exists in storage.
   */
  hasProfile(studentId: string): Promise<boolean>;
}
