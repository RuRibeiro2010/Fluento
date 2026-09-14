import { SessionEntity } from '../entities/session.entity';

export class SessionEvaluationService {
  /**
   * Computes comprehensive learning metrics across a completed session.
   */
  public evaluateSessionPerformance(session: SessionEntity): {
    totalTurns: number;
    totalWordsSpoken: number;
    averageWpm: number;
    compositeScore: number;
    fluencyLevel: 'iniciante' | 'em_desenvolvimento' | 'fluente';
  } {
    const turns = session.turns;
    let totalWords = 0;
    let totalWpm = 0;
    let wpmCount = 0;

    for (const t of turns) {
      totalWords += t.userUtterance.wordCount;
      if (t.metrics) {
        totalWpm += t.metrics.wordsPerMinute;
        wpmCount++;
      }
    }

    const avgWpm = wpmCount > 0 ? Math.round(totalWpm / wpmCount) : 90;
    const compositeScore = session.overallScore || 75;

    let fluencyLevel: 'iniciante' | 'em_desenvolvimento' | 'fluente' = 'iniciante';
    if (avgWpm >= 120 && compositeScore >= 80) fluencyLevel = 'fluente';
    else if (avgWpm >= 85 || compositeScore >= 65) fluencyLevel = 'em_desenvolvimento';

    return {
      totalTurns: turns.length,
      totalWordsSpoken: totalWords,
      averageWpm: avgWpm,
      compositeScore,
      fluencyLevel,
    };
  }
}
