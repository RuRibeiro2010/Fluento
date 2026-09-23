/**
 * FLUENTO LEARNING THREADS - UNIT TESTS
 * 
 * Comprehensive unit test suite for Sprint 9 - Learning Threads Runtime.
 */

import { learningThreadsRuntime } from '../learning-threads';
import { memoryClassifier } from '../memory-classifier';
import { memoryPromoter } from '../memory-promoter';
import { memoryDecay } from '../memory-decay';
import { memoryConsolidator } from '../memory-consolidator';
import { threadValidator } from '../thread-validator';
import { threadSearch } from '../thread-search';
import { threadTelemetry } from '../telemetry';
import { threadManager } from '../thread-manager';
import { studentDigitalTwin } from '@/src/lib/student-digital-twin';
import { mockThreadSnapshotNormal } from '../fixtures';

export async function runLearningThreadsTestSuite() {
  const results: { testName: string; passed: boolean; message: string }[] = [];

  function assert(condition: boolean, testName: string, message: string) {
    results.push({
      testName,
      passed: condition,
      message: condition ? 'PASSED' : `FAILED: ${message}`
    });
  }

  const studentId = 'test_student_s9_unit';
  threadManager.clear(studentId);
  threadTelemetry.clear();

  // 1. Classification Test
  const classificationSuccess = memoryClassifier.classifyNote('Aluno teve um grande sucesso no discurso livre');
  assert(
    classificationSuccess.classifiedCategory === 'success_breakthrough' &&
    classificationSuccess.importanceScore >= 80,
    'MemoryClassifier - Success Breakthrough',
    'Should correctly classify positive breakthrough notes as success_breakthrough'
  );

  const classificationDifficulty = memoryClassifier.classifyNote('Aluno apresentou hesitação e erro recorrente em phrasal verbs');
  assert(
    classificationDifficulty.classifiedCategory === 'persistent_difficulty',
    'MemoryClassifier - Persistent Difficulty',
    'Should correctly classify friction notes as persistent_difficulty'
  );

  // 2. Note Ingestion & Memory Promotion Test
  const ingestRes = learningThreadsRuntime.ingestNote(
    studentId,
    'sess_001',
    'Aluno teve um grande sucesso no discurso livre',
    'discurso livre'
  );

  assert(
    ingestRes.note.studentId === studentId &&
    ingestRes.promotionResult.promoted === true &&
    ingestRes.promotionResult.promotedItemType === 'success',
    'LearningThreadsRuntime - Ingestion & Promotion',
    'Ingesting milestone note should automatically promote it to a permanent SuccessMemory'
  );

  // 3. SRS Decay & Review Attempt Test
  const { reviewItem } = learningThreadsRuntime.addReviewItem(studentId, 'resilient', 'vocabulary');
  const decayRes = memoryDecay.calculateDecay(reviewItem, new Date(Date.now() + 5 * 24 * 60 * 60 * 1000));

  assert(
    decayRes.newDecayScore > 0 && decayRes.isDueForReview === true,
    'MemoryDecay - SRS Exponential Decay Calculation',
    'Elapsed time must increase decay score and mark item as due for review'
  );

  const updatedSnapshotAfterReview = learningThreadsRuntime.recordReviewAttempt(studentId, reviewItem.id, true);
  const reviewedItem = updatedSnapshotAfterReview.reviewItems.find(r => r.id === reviewItem.id);

  assert(
    reviewedItem !== undefined && reviewedItem.stability > reviewItem.stability && reviewedItem.decayScore === 0,
    'MemoryDecay - Post-Review Stability Increase',
    'Successful review attempt must increase item stability and reset decay score to 0'
  );

  // 4. Memory Consolidation Test
  // Add duplicate review item and matching success to resolve difficulty
  // Note: runtime facade already deduplicates, so we manually inject a duplicate to test consolidator's safety net
  const preSnapshot = learningThreadsRuntime.getSnapshot(studentId);
  if (preSnapshot.reviewItems.length > 0) {
    const duplicate = { ...preSnapshot.reviewItems[0], id: 'srs_dupe_test' };
    preSnapshot.reviewItems.push(duplicate);
    // @ts-ignore - bypassing facade to test internal consolidator safety net
    threadManager.saveSnapshot(preSnapshot);
  }

  learningThreadsRuntime.recordDifficultyMemory(studentId, 'Uso Incorreto de Phrasal Verbs', 'Dificuldade com phrasal verbs');
  learningThreadsRuntime.addSuccessMemory(studentId, 'Uso Incorreto de Phrasal Verbs', 'Demonstrou domínio total do Uso Incorreto de Phrasal Verbs');

  const { consolidatedSnapshot, report } = learningThreadsRuntime.consolidate(studentId);

  assert(
    report.difficultiesResolved >= 1 &&
    report.duplicateItemsRemoved >= 1 &&
    consolidatedSnapshot.difficulties.some(d => d.title.includes('Phrasal Verbs') && d.isResolved),
    'MemoryConsolidator - Deduplication & Difficulty Resolution',
    'Consolidation must resolve difficulty when matching success exists and merge duplicate review items'
  );

  // 5. Thread Validation & Search Test
  const validation = threadValidator.validateThreadSnapshot(consolidatedSnapshot);
  assert(
    validation.isValid,
    'ThreadValidator - Snapshot Integrity',
    'Consolidated snapshot must pass structural and bounds validation'
  );

  const searchRes = threadSearch.searchThreads(consolidatedSnapshot, { keyword: 'phrasal' });
  assert(
    searchRes.totalCount >= 1,
    'ThreadSearch - Query Filtering',
    'Should correctly return search matches filtering by keyword'
  );

  // 6. Student Digital Twin Sync Test
  const twin = studentDigitalTwin.getOrCreateTwin(studentId);
  assert(
    twin.memory.permanentSuccessMemories.length > 0 &&
    twin.memory.reviewItems.length > 0,
    'StudentDigitalTwin - Seamless Sync',
    'Learning Threads updates must seamlessly synchronize into Student Digital Twin memory state'
  );

  // 7. Telemetry Test
  const events = threadTelemetry.getEvents(studentId);
  assert(
    events.length >= 3,
    'ThreadTelemetry - Event Recording',
    'Should accurately record telemetry events for memory additions, promotions, and consolidation'
  );

  return results;
}
