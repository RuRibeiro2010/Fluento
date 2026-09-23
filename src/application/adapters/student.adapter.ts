import { ApplicationQueryHandlers } from '../queries/query-handlers';
import { StudentDTO } from '../dto/application.dtos';
import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { StudentProfileData } from '../dto/student-profile.dto';
import { DigitalTwinDTO } from '../dto/digital-twin.dto';
import { StudentProfileSyncService, ProfileChangeListener, SynchronizedStudentState } from '../services/student-profile-sync.service';
import { UserProfile } from '../../../types/profile';
import { StudentProfileMapper } from '../mappers/student-profile.mapper';

export interface StudentProfileViewModelDTO {
  readonly id: string;
  readonly email: string;
  readonly nativeLanguage: string;
  readonly targetLanguages: string[];
  readonly currentLevel: string;
  readonly currentFocus: string;
  readonly motivation: string;
  readonly active: boolean;
  readonly skillMatrix: {
    readonly speaking: number;
    readonly listening: number;
    readonly reading: number;
    readonly writing: number;
    readonly grammar: number;
    readonly vocabulary: number;
  };
  readonly preferences: {
    readonly dailyGoalMinutes: number;
    readonly preferredTeacherPersona: string;
    readonly correctionStrictness: string;
  };
  readonly source: 'application_layer' | 'legacy_fallback';
}

export class StudentProfileAdapter {
  constructor(
    private readonly queryHandlers: ApplicationQueryHandlers,
    private readonly studentRepo: IStudentRepository,
    private readonly syncService?: StudentProfileSyncService
  ) {}

  /**
   * Retrieves the canonical Student Profile data model.
   * Single point of entry for the UI layer to access student data.
   */
  public async getCanonicalProfile(studentId = 'usr_fluento_primary'): Promise<StudentProfileData> {
    if (this.syncService) {
      return this.syncService.getProfile(studentId);
    }

    // Fallback if syncService not provided: return default
    return {
      id: studentId,
      name: 'Aluno Executivo',
      email: `${studentId}@fluento.ai`,
      nativeLanguage: 'pt',
      targetLanguages: ['es'],
      currentLevel: 'B1',
      targetLevel: 'B2',
      objectives: {
        primaryMotivation: 'Crescimento de carreira internacional',
        currentFocus: 'Apresentação Executiva & Negociação de Ideias',
      },
      interests: ['Negócios', 'Viagens'],
      preferences: {
        dailyGoalMinutes: 15,
        weeklyGoalMinutes: 60,
        preferredTeacherPersona: 'Prof. Sofia',
        correctionStrictness: 'balanced',
        pace: 'moderate',
        learningStyle: 'interactive',
      },
      version: 1,
      createdAtIso: new Date().toISOString(),
      updatedAtIso: new Date().toISOString(),
    } as any;
  }

  /**
   * Retrieves the Student Digital Twin DTO.
   */
  public async getDigitalTwin(studentId = 'usr_fluento_primary'): Promise<DigitalTwinDTO> {
    if (this.syncService) {
      return this.syncService.getDigitalTwin(studentId);
    }
    throw new Error('SyncService required for Digital Twin');
  }

  /**
   * Updates student profile with partial data via the sync service.
   */
  public async updateProfile(
    studentId: string,
    updates: Partial<StudentProfileData>
  ): Promise<SynchronizedStudentState> {
    if (this.syncService) {
      return this.syncService.updateProfile(studentId, updates);
    }
    const profile = await this.getCanonicalProfile(studentId);
    const twin = await this.getDigitalTwin(studentId);
    return { profile: { ...profile, ...updates }, digitalTwin: twin };
  }

  /**
   * Saves onboarding profile to the canonical application store.
   */
  public async saveOnboardingProfile(
    profile: UserProfile | Partial<StudentProfileData>
  ): Promise<SynchronizedStudentState> {
    if (this.syncService) {
      if ('native_language' in profile) {
        return this.syncService.syncLegacyProfile(profile as UserProfile);
      }
      return this.syncService.updateProfile(profile.id || 'usr_fluento_primary', profile);
    }
    throw new Error('SyncService required');
  }

  /**
   * Returns a legacy UserProfile representation for backwards-compatible UI components.
   */
  public async getLegacyUserProfile(studentId = 'usr_fluento_primary'): Promise<UserProfile> {
    if (this.syncService) {
      const state = await this.syncService.getSynchronizedState(studentId);
      return StudentProfileMapper.profileToLegacy(state.profile, state.digitalTwin);
    }
    const profile = await this.getCanonicalProfile(studentId);
    return StudentProfileMapper.profileToLegacy(profile as any);
  }

  /**
   * Backward-compatible method for Sprint 16A.2 queries.
   */
  public async getProfile(studentId: string): Promise<StudentProfileViewModelDTO> {
    try {
      const studentDto: StudentDTO = await this.queryHandlers.getStudentProfile({ studentId });
      return {
        id: studentDto.id,
        email: studentDto.email,
        nativeLanguage: studentDto.nativeLanguage,
        targetLanguages: studentDto.targetLanguages,
        currentLevel: studentDto.currentLevel,
        currentFocus: studentDto.currentFocus,
        motivation: studentDto.motivation,
        active: studentDto.active,
        skillMatrix: studentDto.skillMatrix,
        preferences: studentDto.preferences,
        source: 'application_layer',
      };
    } catch (error) {
      console.warn('[StudentProfileAdapter] Error fetching student profile, returning safe fallback:', error);
      return {
        id: studentId,
        email: `${studentId}@fluento.ai`,
        nativeLanguage: 'pt',
        targetLanguages: ['es'],
        currentLevel: 'B1',
        currentFocus: 'Fluência Corporativa & Reuniões',
        motivation: 'Crescimento de carreira internacional',
        active: true,
        skillMatrix: {
          speaking: 72,
          listening: 78,
          reading: 80,
          writing: 70,
          grammar: 74,
          vocabulary: 76,
        },
        preferences: {
          dailyGoalMinutes: 15,
          preferredTeacherPersona: 'Prof. Sofia',
          correctionStrictness: 'balanced',
        },
        source: 'legacy_fallback',
      };
    }
  }

  /**
   * Subscribes to profile changes across application events.
   */
  public subscribe(listener: ProfileChangeListener): () => void {
    if (this.syncService) {
      return this.syncService.subscribe(listener);
    }
    return () => {};
  }
}

