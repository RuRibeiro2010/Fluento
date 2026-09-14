/**
 * FLUENTO SESSION RUNTIME - FIXTURES
 * 
 * Mock fixtures and sample data for Session Runtime validation.
 */

import { SessionSnapshot } from './types';
import { mockStudentStateNormal, mockComposedLesson } from '@/src/lib/conversation-orchestrator/fixtures';
import { mockMemoryThreads } from '@/src/lib/prompt-builder/fixtures';

export const mockSessionSnapshot: SessionSnapshot = {
  sessionId: 'sess_fixture_999',
  studentId: mockStudentStateNormal.studentId,
  status: 'active',
  startTimeIso: new Date().toISOString(),
  lastActiveTimeIso: new Date().toISOString(),
  activeBlockIndex: 1,
  studentState: mockStudentStateNormal,
  memoryThreads: mockMemoryThreads,
  lesson: mockComposedLesson,
  turns: [],
  totalStudentTalkTimeSeconds: 120,
  totalTeacherTalkTimeSeconds: 45,
  totalSilenceSeconds: 15,
  checkpointStateIso: new Date().toISOString()
};
