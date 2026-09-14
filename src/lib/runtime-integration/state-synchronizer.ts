/**
 * FLUENTO RUNTIME INTEGRATION - STATE SYNCHRONIZER
 * 
 * Synchronizes pedagogical gains, conversation metrics, and thread updates back to
 * Student Digital Twin at session completion or checkpointing.
 */

import { studentDigitalTwin, StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { learningThreadsRuntime, ThreadSnapshot } from '@/src/lib/learning-threads';
import { SessionSnapshot } from '@/src/lib/session-runtime';

export class StateSynchronizer {
  /**
   * Synchronizes session state and thread snapshot back to Student Digital Twin.
   */
  public synchronizeStudentState(
    studentId: string,
    sessionSnapshot?: SessionSnapshot,
    threadsSnapshot?: ThreadSnapshot
  ): StudentDigitalTwinState {
    const twin = studentDigitalTwin.getOrCreateTwin(studentId);

    // 1. Sync thread memory to Digital Twin
    if (threadsSnapshot) {
      learningThreadsRuntime.syncToDigitalTwin(studentId, threadsSnapshot);
    } else {
      const currentThreads = learningThreadsRuntime.getSnapshot(studentId);
      learningThreadsRuntime.syncToDigitalTwin(studentId, currentThreads);
    }

    // 2. Sync session metrics if session snapshot exists
    if (sessionSnapshot) {
      const completedSessions = twin.behaviour.completedSessionsCount + (sessionSnapshot.status === 'completed' ? 1 : 0);
      const studentTurnCount = sessionSnapshot.turns.filter(t => t.speaker === 'student').length;
      const totalSpeakingSeconds = twin.behaviour.totalSpeakingTimeSeconds + (studentTurnCount * 12); // ~12s per turn estimate

      studentDigitalTwin.updateTwin(studentId, {
        identity: {
          ...twin.identity,
          lastActiveIso: new Date().toISOString()
        },
        behaviour: {
          ...twin.behaviour,
          completedSessionsCount: completedSessions,
          totalSpeakingTimeSeconds: totalSpeakingSeconds
        }
      });
    }

    return studentDigitalTwin.getOrCreateTwin(studentId);
  }
}

export const stateSynchronizer = new StateSynchronizer();
