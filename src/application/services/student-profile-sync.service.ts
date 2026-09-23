import { IStudentProfileStorageGateway, IDigitalTwinStorageGateway } from '../contracts/student-storage.contract';
import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { StudentProfileEntity } from '../../domain/student/entities/student-profile.entity';
import { DigitalTwinEntity } from '../../domain/student/entities/digital-twin.entity';
import { StudentProfileData } from '../dto/student-profile.dto';
import { DigitalTwinDTO } from '../dto/digital-twin.dto';
import { StudentId } from '../../domain/student/value-objects/student-id.vo';
import { StudentProfileMapper } from '../mappers/student-profile.mapper';
import { UserProfile } from '../../../types/profile';
import { IEventPublisher } from '../contracts/infrastructure.contracts';
import { StudentEntity } from '../../domain/student/entities/student.entity';
import { SkillMatrix } from '../../domain/student/value-objects/skill-matrix.vo';

export interface SynchronizedStudentState {
  profile: StudentProfileData;
  digitalTwin: DigitalTwinDTO;
}

export type ProfileChangeListener = (state: SynchronizedStudentState) => void;

/**
 * Single source of truth application service for Student Profile & Digital Twin synchronization.
 * Handles reading, updating, persisting, and synchronizing profile data and digital twin learning state.
 */
export class StudentProfileSyncService {
  private listeners: Set<ProfileChangeListener> = new Set();

  constructor(
    private readonly storageGateway: IStudentProfileStorageGateway,
    private readonly twinStorageGateway: IDigitalTwinStorageGateway,
    private readonly studentRepo: IStudentRepository,
    private readonly eventPublisher?: IEventPublisher
  ) {}

  /**
   * Retrieves the synchronized student state (Profile + Digital Twin).
   */
  public async getSynchronizedState(studentId = 'usr_fluento_primary'): Promise<SynchronizedStudentState> {
    const profile = await this.getProfile(studentId);
    const digitalTwin = await this.getDigitalTwin(studentId);
    
    return { profile, digitalTwin };
  }

  /**
   * Retrieves the student profile.
   */
  public async getProfile(studentId = 'usr_fluento_primary'): Promise<StudentProfileData> {
    const storedData = await this.storageGateway.loadProfile(studentId);
    if (storedData) {
      return StudentProfileMapper.mapToDTO(StudentProfileEntity.fromData(storedData));
    }

    // Graceful Fallback: Initialize default profile
    const defaultEntity = StudentProfileEntity.createDefault(studentId);
    const profileDto = StudentProfileMapper.mapToDTO(defaultEntity);
    await this.storageGateway.saveProfile(defaultEntity.toData());
    
    // Ensure corresponding Digital Twin also exists or is created
    const twinDto = await this.getDigitalTwin(studentId);
    
    // Synchronize to domain repository
    await this.syncToRepository(defaultEntity, twinDto);
    
    return profileDto;
  }

  /**
   * Retrieves the student digital twin.
   */
  public async getDigitalTwin(studentId = 'usr_fluento_primary'): Promise<DigitalTwinDTO> {
    const storedData = await this.twinStorageGateway.loadTwin(studentId);
    let entity: DigitalTwinEntity;

    if (storedData) {
      entity = DigitalTwinEntity.fromData(storedData);
    } else {
      entity = DigitalTwinEntity.createNew(studentId);
      await this.twinStorageGateway.saveTwin(entity.toData());
    }

    return this.mapToTwinDTO(entity);
  }

  /**
   * Updates student profile with partial data.
   */
  public async updateProfile(
    studentId: string,
    updates: Partial<StudentProfileData>
  ): Promise<SynchronizedStudentState> {
    const currentData = await this.getProfile(studentId);
    const entity = StudentProfileEntity.fromData(currentData);

    entity.updateProfile(updates);
    const updatedData = entity.toData();

    await this.storageGateway.saveProfile(updatedData);
    
    // Synchronize to domain repository
    const twinDto = await this.getDigitalTwin(studentId);
    await this.syncToRepository(entity, twinDto);
    
    // Notify listeners with full state
    const state = await this.getSynchronizedState(studentId);
    this.notifyListeners(state);

    return state;
  }

  /**
   * Synchronizes legacy UserProfile into canonical profile.
   */
  public async syncLegacyProfile(legacy: Partial<UserProfile>): Promise<SynchronizedStudentState> {
    const studentId = legacy.id || 'usr_fluento_primary';
    const canonical = StudentProfileMapper.legacyToProfile(legacy);
    const twinUpdates = StudentProfileMapper.legacyToTwin(legacy);
    
    await this.updateProfile(studentId, canonical);
    await this.updateDigitalTwin(studentId, twinUpdates);
    
    return this.getSynchronizedState(studentId);
  }

  /**
   * Updates digital twin with partial data.
   */
  public async updateDigitalTwin(
    studentId: string,
    updates: Partial<DigitalTwinDTO>
  ): Promise<SynchronizedStudentState> {
    const currentData = await this.twinStorageGateway.loadTwin(studentId);
    const entity = currentData ? DigitalTwinEntity.fromData(currentData) : DigitalTwinEntity.createNew(studentId);

    if (updates.competencies) {
      entity.updateCompetencies(updates.competencies);
    }
    if (updates.currentLevel) {
      entity.updateLevel(updates.currentLevel);
    }

    await this.twinStorageGateway.saveTwin(entity.toData());
    
    // Synchronize to domain repository
    const profileData = await this.storageGateway.loadProfile(studentId);
    if (profileData) {
      const profileEntity = StudentProfileEntity.fromData(profileData);
      await this.syncToRepository(profileEntity, this.mapToTwinDTO(entity));
    }
    
    const state = await this.getSynchronizedState(studentId);
    this.notifyListeners(state);

    return state;
  }

  /**
   * Records completed session metrics and updates learning state in the Digital Twin.
   */
  public async recordSessionCompletion(
    studentId: string,
    minutes: number,
    score: number,
    topic: string
  ): Promise<SynchronizedStudentState> {
    const twinData = await this.twinStorageGateway.loadTwin(studentId);
    const entity = twinData ? DigitalTwinEntity.fromData(twinData) : DigitalTwinEntity.createNew(studentId);

    entity.recordLessonOutcome(minutes, score, topic);
    const updatedTwinData = entity.toData();

    await this.twinStorageGateway.saveTwin(updatedTwinData);

    // Synchronize to domain repository
    const profileData = await this.storageGateway.loadProfile(studentId);
    if (profileData) {
      const profileEntity = StudentProfileEntity.fromData(profileData);
      await this.syncToRepository(profileEntity, this.mapToTwinDTO(entity));
    }

    const state = await this.getSynchronizedState(studentId);
    this.notifyListeners(state);

    return state;
  }

  /**
   * Converts canonical profile to legacy UserProfile.
   */
  public toLegacyUserProfile(profile: StudentProfileData): UserProfile {
    return StudentProfileMapper.profileToLegacy(profile);
  }

  /**
   * Subscribes to synchronized state update events.
   */
  public subscribe(listener: ProfileChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private async syncToRepository(profile: StudentProfileEntity, twin: DigitalTwinDTO): Promise<void> {
    const studentId = StudentId.create(profile.id);

    const skillMatrix = SkillMatrix.create({
      grammar: twin.competencies?.grammar ?? 70,
      vocabulary: twin.competencies?.vocabulary ?? 70,
      listening: twin.competencies?.listening ?? 70,
      speaking: twin.competencies?.speaking ?? 70,
      reading: twin.competencies?.reading ?? 70,
      writing: twin.competencies?.writing ?? 70,
      pronunciation: twin.competencies?.pronunciation ?? 70,
      fluency: twin.competencies?.fluency ?? 70,
      confidence: twin.competencies?.confidence ?? 70,
    });

    const student = StudentEntity.create(studentId, {
      email: profile.email,
      nativeLanguage: profile.nativeLanguage,
      targetLanguages: profile.targetLanguages,
      currentLevel: profile.currentLevel,
      skillMatrix,
      preferences: profile.preferences,
      currentFocus: profile.objectives.currentFocus,
      motivation: profile.objectives.primaryMotivation,
      active: true,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    });

    await this.studentRepo.save(student);
  }

  private mapToTwinDTO(entity: DigitalTwinEntity): DigitalTwinDTO {
    return StudentProfileMapper.mapTwinToDTO(entity);
  }

  private notifyListeners(state: SynchronizedStudentState): void {
    for (const listener of this.listeners) {
      try {
        listener(state);
      } catch (err) {
        console.warn('[StudentProfileSyncService] Error in listener callback:', err);
      }
    }
  }
}
