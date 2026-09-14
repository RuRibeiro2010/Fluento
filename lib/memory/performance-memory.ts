import { PerformanceMemory, PerformanceSnapshot } from '@/types/memory';

/**
 * Performance Memory Module
 * Logs fluency, accuracy, confidence trends, and learning velocity.
 */
export class PerformanceMemoryService {
  private memory: PerformanceMemory;

  constructor(userId: string = 'usr_default', targetLanguage: string = 'es') {
    this.memory = {
      userId,
      targetLanguage,
      history: [
        {
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          fluencyScore: 72,
          grammarScore: 75,
          vocabularyScore: 70,
          pronunciationScore: 80,
          listeningScore: 85,
          speakingScore: 74,
          overallConfidence: 72,
        },
        {
          date: new Date(Date.now() - 86400000).toISOString(),
          fluencyScore: 78,
          grammarScore: 78,
          vocabularyScore: 76,
          pronunciationScore: 82,
          listeningScore: 88,
          speakingScore: 79,
          overallConfidence: 77,
        },
      ],
      currentConfidenceScore: 77,
      learningVelocity: 'accelerating',
      averageSessionDurationMinutes: 12,
    };
  }

  public get(): PerformanceMemory {
    return { ...this.memory };
  }

  public addSnapshot(snapshot: PerformanceSnapshot): void {
    this.memory.history.push(snapshot);
    this.memory.currentConfidenceScore = snapshot.overallConfidence;
    this.reevaluateVelocity();
  }

  private reevaluateVelocity(): void {
    if (this.memory.history.length < 2) return;
    const latest = this.memory.history[this.memory.history.length - 1];
    const previous = this.memory.history[this.memory.history.length - 2];

    const diff = latest.overallConfidence - previous.overallConfidence;
    if (diff > 3) this.memory.learningVelocity = 'accelerating';
    else if (diff < -2) this.memory.learningVelocity = 'needs_reinforcement';
    else this.memory.learningVelocity = 'steady';
  }
}
