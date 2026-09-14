/**
 * Decision Journal Module (AI Teaching Orchestrator - Sprint 3)
 * Records internal audit trail of all major pedagogical decisions:
 * rationale, state before action, strategy switches, and difficulty adjustments.
 * Note: These records are strictly internal for continuous improvement and audit.
 */

export type DecisionType =
  | 'session_plan'
  | 'mid_session_adaptation'
  | 'recovery_strategy_switch'
  | 'difficulty_adjustment'
  | 'teacher_assignment'
  | 'review_prioritization';

export interface DecisionJournalEntry {
  id: string;
  timestampIso: string;
  userId: string;
  decisionType: DecisionType;
  primaryRationale: string;
  stateBefore: string;
  actionTaken: string;
  details: {
    selectedTopic?: string;
    teacherPersona?: string;
    mode?: string;
    targetCompetency?: string;
    previousDifficulty?: number;
    newDifficulty?: number;
    riskTriggered?: string;
  };
}

// Internal in-memory store for decision journal entries
const decisionJournalStore: Map<string, DecisionJournalEntry[]> = new Map();

/**
 * Records a new decision entry into the internal audit journal.
 */
export function recordDecisionEntry(
  entry: Omit<DecisionJournalEntry, 'id' | 'timestampIso'>
): DecisionJournalEntry {
  const fullEntry: DecisionJournalEntry = {
    ...entry,
    id: `dec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestampIso: new Date().toISOString(),
  };

  const userEntries = decisionJournalStore.get(entry.userId) || [];
  userEntries.unshift(fullEntry); // Store most recent first
  
  // Keep last 100 entries per user
  if (userEntries.length > 100) {
    userEntries.pop();
  }

  decisionJournalStore.set(entry.userId, userEntries);
  return fullEntry;
}

/**
 * Retrieves decision journal history for internal audit and system optimization.
 */
export function getDecisionJournalHistory(userId: string): DecisionJournalEntry[] {
  return decisionJournalStore.get(userId) || [];
}

/**
 * Clears decision journal for a user (e.g. testing or reset).
 */
export function clearDecisionJournal(userId: string): void {
  decisionJournalStore.delete(userId);
}
