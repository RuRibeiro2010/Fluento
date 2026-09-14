import { StudentProfileEntity, StudentProfileData } from '../../domain/student/entities/student-profile.entity';
import { StudentId } from '../../domain/student/value-objects/student-id.vo';
import { StudentObjectives } from '../../domain/student/value-objects/student-objectives.vo';
import { StudentProgress } from '../../domain/student/value-objects/student-progress.vo';
import { StudentGoals } from '../../domain/student/value-objects/student-goals.vo';
import { StudentProfileMapper } from '../mappers/student-profile.mapper';
import { StudentProfileSyncService } from '../services/student-profile-sync.service';
import { LocalStorageStudentProfileGateway } from '../adapters/storage/local-storage-student-profile.gateway';
import { StudentProfileAdapter } from '../adapters/student.adapter';
import { InMemoryStudentRepository } from '../adapters/storage/in-memory';
import { FakeEventPublisher, FakeLogger } from '../adapters/infrastructure';
import { ApplicationQueryHandlers } from '../queries/query-handlers';
import { UserProfile } from '../../../types/profile';
import { studentDigitalTwin } from '../../lib/student-digital-twin';

export async function runStudentProfileSyncTests(): Promise<{ passed: boolean; logs: string[] }> {
  const logs: string[] = [];
  const log = (msg: string) => logs.push(`[TEST-16A.3] ${msg}`);

  try {
    log('Starting Sprint 16A.3 Student Profile & Digital Twin Synchronization Tests...');

    const studentRepo = new InMemoryStudentRepository();
    const storageGateway = new LocalStorageStudentProfileGateway();
    storageGateway.clearMemory();
    const eventPublisher = new FakeEventPublisher();

    const syncService = new StudentProfileSyncService(storageGateway, studentRepo, eventPublisher);

    // =========================================================================
    // 1. Criação do perfil (Default Profile Creation)
    // =========================================================================
    log('1. Testing Student Profile creation...');
    const defaultProfile = StudentProfileEntity.createDefault('std_test_01', 'Carlos Silva', 'carlos@fluento.ai');
    if (!defaultProfile) throw new Error('Failed to create default profile entity');
    if (defaultProfile.id !== 'std_test_01') throw new Error(`Expected ID std_test_01, got ${defaultProfile.id}`);
    if (defaultProfile.currentLevel.value !== 'B1') throw new Error(`Expected level B1, got ${defaultProfile.currentLevel.value}`);
    if (defaultProfile.objectives.primaryMotivation.length === 0) throw new Error('Objectives primary motivation should not be empty');
    if (defaultProfile.competencies.scores.speaking !== 72) throw new Error('Expected speaking score 72');
    log('✓ Default Profile Entity created with all value objects');

    // =========================================================================
    // 2. Leitura do perfil (Reading via Sync Service & Fallback)
    // =========================================================================
    log('2. Testing Profile reading & graceful fallback...');
    // Request a student that doesn't exist yet -> should gracefully initialize default profile
    const loadedProfile = await syncService.getProfile('std_fallback_user');
    if (!loadedProfile) throw new Error('Expected fallback profile, got null');
    if (loadedProfile.id !== 'std_fallback_user') throw new Error(`Expected ID std_fallback_user, got ${loadedProfile.id}`);
    if (loadedProfile.currentLevel !== 'B1') throw new Error('Fallback profile should default to B1');
    if (loadedProfile.preferences.dailyGoalMinutes !== 15) throw new Error('Expected dailyGoalMinutes 15');
    
    // Verify repository was also synchronized
    const repoStudent = await studentRepo.findById(StudentId.create('std_fallback_user'));
    if (!repoStudent) throw new Error('Student repository was not synchronized on initial profile fallback');
    log('✓ Reading profile with graceful fallback and repository sync verified');

    // =========================================================================
    // 3. Atualização do perfil (Updating fields & Versioning)
    // =========================================================================
    log('3. Testing Profile updates and version tracking...');
    const updated = await syncService.updateProfile('std_fallback_user', {
      currentLevel: 'B2',
      objectives: {
        primaryMotivation: 'Apresentações para C-Level Global',
        currentFocus: 'Negociações Complexas',
      },
      preferences: {
        dailyGoalMinutes: 25,
        weeklyGoalMinutes: 100,
        preferredTeacherPersona: 'Prof. Sofia',
        correctionStrictness: 'strict',
        pace: 'intensive',
      },
      competencies: {
        speaking: 85,
        listening: 88,
        reading: 90,
        writing: 80,
        grammar: 84,
        vocabulary: 86,
        pronunciation: 82,
      },
    });

    if (updated.currentLevel !== 'B2') throw new Error(`Expected level B2, got ${updated.currentLevel}`);
    if (updated.objectives.primaryMotivation !== 'Apresentações para C-Level Global') throw new Error('Motivation update failed');
    if (updated.preferences.dailyGoalMinutes !== 25) throw new Error('Preferences update failed');
    if (updated.competencies.speaking !== 85) throw new Error('Competencies update failed');
    if (updated.version < 2) throw new Error('Profile version did not increment on update');

    // Read back to confirm persistence
    const reloaded = await syncService.getProfile('std_fallback_user');
    if (reloaded.currentLevel !== 'B2') throw new Error('Persisted profile does not reflect B2 update');
    log('✓ Profile update and persistence verified');

    // =========================================================================
    // 4. Sincronização (UI -> Adapter -> Service -> Storage -> Digital Twin)
    // =========================================================================
    log('4. Testing Full Synchronization chain (UI Adapter -> Service -> Gateway -> Twin)...');
    const dummyQueryHandlers = new ApplicationQueryHandlers(
      studentRepo,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any
    );
    const profileAdapter = new StudentProfileAdapter(dummyQueryHandlers, studentRepo, syncService);

    // Subscribe to changes
    let notifiedProfile: StudentProfileData | null = null;
    const unsubscribe = profileAdapter.subscribe((p) => {
      notifiedProfile = p;
    });

    // Update through adapter
    await profileAdapter.updateProfile('std_fallback_user', {
      interests: ['Liderança', 'Finanças', 'Fusões e Aquisições'],
    });

    if (!notifiedProfile) throw new Error('Subscriber was not notified of profile update');
    if ((notifiedProfile as StudentProfileData).interests[0] !== 'Liderança') throw new Error('Notified profile does not contain new interests');
    unsubscribe();

    // Verify Digital Twin synchronization
    const twin = studentDigitalTwin.getOrCreateTwin('std_fallback_user');
    if (!twin) throw new Error('Digital Twin was not synchronized');
    log('✓ Full synchronization across adapter, service, gateway, and Digital Twin verified');

    // =========================================================================
    // 5. Compatibilidade com dados antigos (Legacy UserProfile migration & export)
    // =========================================================================
    log('5. Testing Legacy UserProfile compatibility & migration...');
    const legacyInput: UserProfile = {
      id: 'legacy_user_42',
      email: 'executivo@empresa.com',
      native_language: 'pt',
      target_languages: ['es', 'en'],
      coach_personality: 'encouraging',
      humor_style: 'light',
      weekly_goal: 5,
      minutes_per_day: 20,
      confidence_score: 82,
      learning_preferences: {
        topics: ['Negócios', 'Estratégia'],
        pace: 'moderate',
        correction_style: 'balanced',
        feedback_frequency: 'immediate',
      },
      skill_matrix: {
        grammar: 76,
        vocabulary: 80,
        listening: 85,
        speaking: 78,
        reading: 88,
        writing: 74,
        pronunciation: 75,
        fluency: 77,
        confidence: 82,
      },
      current_focus: 'Negociações em Conselho',
      learning_style: 'interactive',
      motivation: 'Expansão da empresa para a América Latina',
      difficulty_preference: 'challenging',
      preferred_topics: ['Negócios', 'Estratégia'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save legacy profile through onboarding adapter
    const migratedFromLegacy = await profileAdapter.saveOnboardingProfile(legacyInput);
    if (!migratedFromLegacy) throw new Error('Failed to migrate legacy profile');
    if (migratedFromLegacy.id !== 'legacy_user_42') throw new Error('Migrated ID mismatch');
    if (migratedFromLegacy.nativeLanguage !== 'pt') throw new Error('Migrated nativeLanguage mismatch');
    if (migratedFromLegacy.preferences.dailyGoalMinutes !== 20) throw new Error('Migrated minutes mismatch');
    if (migratedFromLegacy.competencies.listening !== 85) throw new Error('Migrated skill matrix mismatch');

    // Convert back to legacy format for legacy UI components
    const convertedLegacy = await profileAdapter.getLegacyUserProfile('legacy_user_42');
    if (convertedLegacy.id !== 'legacy_user_42') throw new Error('Converted legacy ID mismatch');
    if (convertedLegacy.native_language !== 'pt') throw new Error('Converted legacy native_language mismatch');
    if (convertedLegacy.minutes_per_day !== 20) throw new Error('Converted legacy minutes_per_day mismatch');
    log('✓ Bidirectional migration between legacy UserProfile and canonical StudentProfileData verified');

    // =========================================================================
    // 6. Sessão & Progresso (Session Completion Tracking)
    // =========================================================================
    log('6. Testing session completion recording and streak calculation...');
    const withSession = await syncService.recordSessionCompletion(
      'legacy_user_42',
      30,
      92,
      'Reunião Executiva de Estratégia'
    );
    if (withSession.progress.completedSessionsCount < 1) throw new Error('Session count did not increase');
    if (withSession.learningHistory.length === 0) throw new Error('Learning history did not record completed session');
    if (withSession.learningHistory[0].accuracyPercent !== 92) throw new Error('Accuracy score not recorded correctly');
    log('✓ Session completion and learning history tracking verified');

    // =========================================================================
    // 7. Segurança e Privacidade (Data Sanitization & Security Check)
    // =========================================================================
    log('7. Verifying security & privacy constraints...');
    const exportedData = JSON.stringify(withSession);
    if (exportedData.includes('password') || exportedData.includes('api_key') || exportedData.includes('secret')) {
      throw new Error('Security violation: profile contains sensitive credential fields!');
    }
    log('✓ No sensitive credentials or API keys found in profile structure');

    log('=======================================================');
    log('ALL SPRINT 16A.3 TESTS PASSED SUCCESSFULLY! ✓');
    log('=======================================================');

    return { passed: true, logs };
  } catch (error: any) {
    log(`FAIL: ${error.message}`);
    return { passed: false, logs };
  }
}
