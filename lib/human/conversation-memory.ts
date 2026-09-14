/**
 * Conversation Memory Module (Fluento Human Experience - Phase 19)
 * Stores episodic memories of past conversations to allow natural references
 * like "I remember a few weeks ago you found subjunctive verbs challenging...".
 */

export interface EpisodicMemoryEntry {
  id: string;
  topicCategory: string;
  keyStruggleOrBreakthrough: string;
  recordedIso: string;
  isResolved: boolean;
}

export function generateNaturalMemoryCallback(
  memories: EpisodicMemoryEntry[]
): string | null {
  if (memories.length === 0) return null;

  // Pick an entry that had a breakthrough or struggle
  const recentMemory = memories[memories.length - 1];

  if (recentMemory.isResolved) {
    return `Lembro-me de quando trabalhámos "${recentMemory.topicCategory}" há umas semanas e superaste a dificuldade inicial. A tua evolução nota-se claramente.`;
  }

  return `Lembras-te de quando praticámos "${recentMemory.topicCategory}"? Hoje vamos consolidar esse mesmo ponto com leveza.`;
}
