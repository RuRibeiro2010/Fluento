/**
 * Emotional Memory Module (Human Learning Experience - HLX)
 * Tracks and stores significant student milestones, emotional victories,
 * key struggles, confidence fluctuations, and motivational trajectories across time.
 */

export interface StudentEmotionalMilestone {
  id: string;
  timestampMs: number;
  type: 'breakthrough_victory' | 'persistent_struggle' | 'confidence_surge' | 'frustration_overcome';
  conceptOrTopic: string;
  contextDescription: string;
  emotionalSentimentScore: number; // -1.0 (highly anxious) to +1.0 (elated)
}

export interface StudentEmotionalState {
  userId: string;
  currentConfidenceLevel: number; // 0 to 100
  currentMotivationIndex: number; // 0 to 100
  recentFrustrationTrend: 'decreasing' | 'stable' | 'elevated';
  milestonesHistory: StudentEmotionalMilestone[];
  lastSessionEmotionalOutcome: 'empowered' | 'satisfied' | 'neutral' | 'fatigued';
}

export function createInitialEmotionalState(userId: string): StudentEmotionalState {
  return {
    userId,
    currentConfidenceLevel: 70,
    currentMotivationIndex: 85,
    recentFrustrationTrend: 'decreasing',
    milestonesHistory: [],
    lastSessionEmotionalOutcome: 'empowered',
  };
}

export function recordEmotionalMilestone(
  state: StudentEmotionalState,
  milestone: Omit<StudentEmotionalMilestone, 'id' | 'timestampMs'>
): StudentEmotionalState {
  const now = Date.now();
  const newMilestone: StudentEmotionalMilestone = {
    ...milestone,
    id: `emo-${now}-${Math.random().toString(36).slice(2, 6)}`,
    timestampMs: now,
  };

  const updatedMilestones = [newMilestone, ...state.milestonesHistory].slice(0, 30); // Keep top 30 emotional events

  // Adjust confidence and motivation indices dynamically
  let newConfidence = state.currentConfidenceLevel;
  let newMotivation = state.currentMotivationIndex;

  if (milestone.type === 'breakthrough_victory' || milestone.type === 'confidence_surge') {
    newConfidence = Math.min(100, newConfidence + 5);
    newMotivation = Math.min(100, newMotivation + 4);
  } else if (milestone.type === 'frustration_overcome') {
    newConfidence = Math.min(100, newConfidence + 6);
    newMotivation = Math.min(100, newMotivation + 6);
  }

  return {
    ...state,
    currentConfidenceLevel: newConfidence,
    currentMotivationIndex: newMotivation,
    milestonesHistory: updatedMilestones,
    lastSessionEmotionalOutcome: milestone.emotionalSentimentScore > 0.3 ? 'empowered' : 'satisfied',
  };
}

export function getTopEmotionalAnchors(state: StudentEmotionalState): StudentEmotionalMilestone[] {
  return state.milestonesHistory.filter(
    (m) => m.type === 'breakthrough_victory' || m.type === 'frustration_overcome'
  ).slice(0, 5);
}
