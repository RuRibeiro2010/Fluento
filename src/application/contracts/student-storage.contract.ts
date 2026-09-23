import { StudentProfileDomainData } from '../../domain/student/entities/student-profile.entity';
import { DigitalTwinDomainData } from '../../domain/student/entities/digital-twin.entity';

/**
 * Interface for Student Profile Storage Gateway.
 * Decouples profile persistence from the concrete storage engine (localStorage, Supabase, Cloud SQL, etc.).
 */
export interface IStudentProfileStorageGateway {
  /**
   * Loads a profile by studentId. Returns null if not found.
   */
  loadProfile(studentId: string): Promise<StudentProfileDomainData | null>;

  /**
   * Persists a student profile to storage.
   */
  saveProfile(profile: StudentProfileDomainData): Promise<void>;

  /**
   * Removes a student profile from storage.
   */
  deleteProfile(studentId: string): Promise<void>;

  /**
   * Checks if a profile exists in storage.
   */
  hasProfile(studentId: string): Promise<boolean>;
}

/**
 * Interface for Student Digital Twin Storage Gateway.
 */
export interface IDigitalTwinStorageGateway {
  /**
   * Loads a digital twin by studentId. Returns null if not found.
   */
  loadTwin(studentId: string): Promise<DigitalTwinDomainData | null>;

  /**
   * Persists a digital twin to storage.
   */
  saveTwin(twin: DigitalTwinDomainData): Promise<void>;

  /**
   * Removes a digital twin from storage.
   */
  deleteTwin(studentId: string): Promise<void>;
}
