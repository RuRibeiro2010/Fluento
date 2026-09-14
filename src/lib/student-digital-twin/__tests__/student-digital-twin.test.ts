/**
 * FLUENTO STUDENT DIGITAL TWIN - UNIT TESTS
 * 
 * Comprehensive test suite verifying student profile creation, partial updates,
 * profile validation, state persistence, telemetry recording, export adapters,
 * and post-session state sync.
 */

import { studentDigitalTwin } from '../student-digital-twin';
import { profileValidator } from '../profile-validator';
import { twinTelemetry } from '../telemetry';
import { twinPersistenceAdapter } from '../persistence-adapter';
import { mockStudentDigitalTwinNormal, mockStudentDigitalTwinAnxious } from '../fixtures';

export async function runStudentDigitalTwinTestSuite() {
  const results: { testName: string; passed: boolean; message: string }[] = [];

  function assert(condition: boolean, testName: string, message: string) {
    results.push({
      testName,
      passed: condition,
      message: condition ? 'PASSED' : `FAILED: ${message}`
    });
  }

  // 1. Get or Create Twin
  const studentId = 'test_std_888';
  twinPersistenceAdapter.clear(studentId);

  const twin = studentDigitalTwin.getOrCreateTwin(studentId, 'Carlos Mendes', 'carlos@fluento.pt');

  assert(
    twin.identity.studentId === studentId && twin.identity.name === 'Carlos Mendes',
    'StudentDigitalTwin - Get or Create Profile',
    'Should initialize new twin with default profiles and supplied identity'
  );

  // 2. Profile Validation
  const valResult = profileValidator.validateProfile(twin);
  assert(
    valResult.isValid,
    'ProfileValidator - Integrity Check',
    'Created Digital Twin must pass structural validation'
  );

  // 3. Partial Update Mutation
  const updatedTwin = studentDigitalTwin.updateTwin(studentId, {
    language: {
      grammarMasteryScore: 82,
      pronunciationScore: 88
    },
    emotional: {
      baselineAnxietyLevel: 15
    }
  });

  assert(
    updatedTwin.language.grammarMasteryScore === 82 &&
    updatedTwin.language.pronunciationScore === 88 &&
    updatedTwin.emotional.baselineAnxietyLevel === 15 &&
    updatedTwin.revision === 2,
    'StudentDigitalTwin - Partial Profile Update',
    'Should safely merge partial changes, update target fields, and increment revision number'
  );

  // 4. Export to StudentLearningState & MemoryThreadsContext
  const learningState = studentDigitalTwin.exportToLearningState(studentId);
  const memoryThreads = studentDigitalTwin.exportToMemoryThreads(studentId);

  assert(
    learningState.studentId === studentId &&
    learningState.currentCefr === 'A2' &&
    learningState.speakingAnxietyLevel === 15 &&
    Array.isArray(memoryThreads.permanentSuccessMemories),
    'StudentDigitalTwin - Export Adapters',
    'Should correctly export StudentLearningState and MemoryThreadsContext for downstream engines'
  );

  // 5. Post-Session State Synchronization
  const syncedTwin = studentDigitalTwin.syncFromSessionEnd(
    studentId,
    {
      ...learningState,
      currentCefr: 'B1',
      speakingAnxietyLevel: 10
    },
    {
      ...memoryThreads,
      permanentSuccessMemories: [...memoryThreads.permanentSuccessMemories, 'Primeiro discurso livre de 2 minutos']
    }
  );

  assert(
    syncedTwin.language.currentCefr === 'B1' &&
    syncedTwin.emotional.baselineAnxietyLevel === 10 &&
    syncedTwin.memory.permanentSuccessMemories.includes('Primeiro discurso livre de 2 minutos') &&
    syncedTwin.behaviour.completedSessionsCount === 1,
    'StudentDigitalTwin - Post-Session Sync',
    'Should synchronize updated learning state, memory threads, and completed session count back into twin'
  );

  // 6. Telemetry Recording
  const mutations = twinTelemetry.getEvents(studentId);
  assert(
    mutations.length === 2,
    'TwinTelemetry - Mutation Tracking',
    'Should record mutation events for profile updates and post-session sync'
  );

  return results;
}
