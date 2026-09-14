import { IStudentProfileStorageGateway } from '../contracts/student-storage.contract';
import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { StudentProfileEntity, StudentProfileData } from '../../domain/student/entities/student-profile.entity';
import { StudentId } from '../../domain/student/value-objects/student-id.vo';
import { StudentProfileMapper } from '../mappers/student-profile.mapper';
import { UserProfile } from '../../../types/profile';
import { IEventPublisher } from '../contracts/infrastructure.contracts';

export type ProfileChangeListener = (profile: StudentProfileData) => void;

/**
 * Single source of truth application service for Student Profile & Digital Twin synchronization.
 * Handles reading, updating, persisting, and synchronizing profile data across domain repositories,
 * storage gateways (localStorage now, Supabase later), and legacy UI adapters.
 */
export class StudentProfileSyncService {
  private listeners: Set<ProfileChangeListener> = new Set();

  constructor(
    private readonly storageGateway: IStudentProfileStorageGateway,
    private readonly studentRepo: IStudentRepository,
    private readonly eventPublisher?: IEventPublisher
  ) {}

  /**
   * Retrieves the student profile.
   * If not found in storage, checks the domain repository.
   * If not found in domain repository, initializes a safe default profile.
   */
  public async getProfile(studentId = 'usr_fluento_primary'): Promise<StudentProfileData> {
    // 1. Try loading from storage gateway
    const storedData = await this.storageGateway.loadProfile(studentId);
    if (storedData) {
      const entity = StudentProfileEntity.fromData(storedData);
      // Keep domain repository in sync
      await this.studentRepo.save(entity.toStudentEntity());
      return entity.toData();
    }

    // 2. Try loading from domain repository
    const domainStudent = await this.studentRepo.findById(StudentId.create(studentId));
    if (domainStudent) {
      const entity = StudentProfileEntity.fromStudentEntity(domainStudent);
      const data = entity.toData();
      await this.storageGateway.saveProfile(data);
      return data;
    }

    // 3. Graceful Fallback: Initialize default profile
    const defaultEntity = StudentProfileEntity.createDefault(studentId);
    const defaultData = defaultEntity.toData();
    await this.storageGateway.saveProfile(defaultData);
    await this.studentRepo.save(defaultEntity.toStudentEntity());
    return defaultData;
  }

  /**
   * Updates student profile with partial data and persists changes.
   */
  public async updateProfile(
    studentId: string,
    updates: Partial<StudentProfileData>
  ): Promise<StudentProfileData> {
    const currentData = await this.getProfile(studentId);
    const entity = StudentProfileEntity.fromData(currentData);

    entity.updateProfile(updates);
    const updatedData = entity.toData();

    // 1. Persist to storage gateway (and synced adapters)
    await this.storageGateway.saveProfile(updatedData);

    // 2. Keep domain repository in sync
    await this.studentRepo.save(entity.toStudentEntity());

    // 3. Notify listeners
    this.notifyListeners(updatedData);

    return updatedData;
  }

  /**
   * Synchronizes legacy UserProfile into canonical profile.
   */
  public async syncLegacyProfile(legacy: Partial<UserProfile>): Promise<StudentProfileData> {
    const canonical = StudentProfileMapper.legacyToProfile(legacy);
    return this.updateProfile(canonical.id, canonical);
  }

  /**
   * Records completed session metrics and updates progress in the profile.
   */
  public async recordSessionCompletion(
    studentId: string,
    minutes: number,
    score: number,
    topic: string
  ): Promise<StudentProfileData> {
    const currentData = await this.getProfile(studentId);
    const entity = StudentProfileEntity.fromData(currentData);

    entity.recordSessionCompletion(minutes, score, topic);
    const updatedData = entity.toData();

    await this.storageGateway.saveProfile(updatedData);
    await this.studentRepo.save(entity.toStudentEntity());

    this.notifyListeners(updatedData);
    return updatedData;
  }

  /**
   * Converts canonical profile to legacy UserProfile.
   */
  public toLegacyUserProfile(profile: StudentProfileData): UserProfile {
    return StudentProfileMapper.profileToLegacy(profile);
  }

  /**
   * Subscribes to profile update events.
   */
  public subscribe(listener: ProfileChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(profile: StudentProfileData): void {
    for (const listener of this.listeners) {
      try {
        listener(profile);
      } catch (err) {
        console.warn('[StudentProfileSyncService] Error in listener callback:', err);
      }
    }
  }
}
