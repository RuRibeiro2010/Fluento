import { LessonSessionHistoryLog, StudentModel } from '@/types/brain';
import { StudentModelEngine, defaultStudentModel } from './student-model';
import { TrackedWord, CommonErrorItem } from '@/types/profile';

/**
 * Longitudinal Memory Service
 * Records every lesson, conversation, exercise session, and diagnostic assessment.
 * Automatically feeds updates into the Student Model, Weakness Engine, and Review Engine.
 */
export class LongitudinalMemoryService {
  private historyLogs: LessonSessionHistoryLog[] = [];
  private studentModelEngine: StudentModelEngine;

  constructor(studentModelEngine: StudentModelEngine = defaultStudentModel) {
    this.studentModelEngine = studentModelEngine;

    // Seed initial session history log
    this.historyLogs = [
      {
        sessionId: 'sess-init-1',
        theme: 'Ordering Coffee & Small Talk at Café',
        level: 'A2',
        durationMinutes: 8,
        overallScore: 88,
        wordsLearned: [
          {
            id: 'w10',
            word: 'quisiera',
            translation: 'I would like',
            state: 'uses_naturally',
            errorCount: 0,
            timesUsedCorrectly: 4,
            lastUsedDate: new Date().toISOString(),
            confidenceScore: 92,
            categoryTag: 'dining',
          },
        ],
        forgottenWords: [],
        grammarUsed: ['Polite requests with quisiera', 'Direct object pronouns'],
        errors: [
          {
            id: 'err-1',
            concept: 'Ser vs Estar for temporary state',
            category: 'grammar',
            frequency: 1,
            lastOccurred: new Date().toISOString(),
            examples: ['Used "soy cansado" instead of "estoy cansado"'],
          },
        ],
        pronunciationScore: 85,
        vocabularyScore: 88,
        fluencyScore: 82,
        expressionsLearned: ['¿Qué me recomienda?', 'Para llevar, por favor'],
        aiFeedback: 'Excellent conversational flow and clear intent! Minor slip on ser/estar.',
        averageResponseTimeSeconds: 3.2,
        confidenceScore: 84,
        motivationScore: 90,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }

  /**
   * Logs a completed lesson or Virtual Teacher session and updates internal student model
   */
  public recordSessionLog(log: Omit<LessonSessionHistoryLog, 'sessionId' | 'timestamp'>): LessonSessionHistoryLog {
    const fullLog: LessonSessionHistoryLog = {
      ...log,
      sessionId: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    this.historyLogs.unshift(fullLog);

    // Update active/passive vocabulary states
    fullLog.wordsLearned.forEach((word) => {
      this.studentModelEngine.updateWordState(word.word, word.translation, true);
    });

    fullLog.forgottenWords.forEach((word) => {
      this.studentModelEngine.updateWordState(word.word, word.translation, false);
    });

    // Update mindset scores in model
    const currentModel = this.studentModelEngine.getModel();
    this.studentModelEngine.updateModel({
      confidenceScore: Math.round((currentModel.confidenceScore + fullLog.confidenceScore) / 2),
      motivationScore: Math.round((currentModel.motivationScore + fullLog.motivationScore) / 2),
      grammarMasteryPercent: Math.round((currentModel.grammarMasteryPercent * 0.8 + fullLog.overallScore * 0.2)),
      vocabularyMasteryPercent: Math.round((currentModel.vocabularyMasteryPercent * 0.8 + fullLog.vocabularyScore * 0.2)),
      speakingMasteryPercent: Math.round((currentModel.speakingMasteryPercent * 0.8 + fullLog.fluencyScore * 0.2)),
    });

    return fullLog;
  }

  /**
   * Returns history logs timeline
   */
  public getHistoryLogs(limit: number = 10): LessonSessionHistoryLog[] {
    return this.historyLogs.slice(0, limit);
  }

  /**
   * Summary calculation over session history
   */
  public getLongitudinalSummary(): {
    totalSessionsCount: number;
    totalMinutesPracticed: number;
    averageOverallScore: number;
    averageResponseTimeSeconds: number;
  } {
    if (this.historyLogs.length === 0) {
      return {
        totalSessionsCount: 0,
        totalMinutesPracticed: 0,
        averageOverallScore: 0,
        averageResponseTimeSeconds: 0,
      };
    }

    const totalSessionsCount = this.historyLogs.length;
    const totalMinutesPracticed = this.historyLogs.reduce((acc, s) => acc + s.durationMinutes, 0);
    const averageOverallScore = Math.round(
      this.historyLogs.reduce((acc, s) => acc + s.overallScore, 0) / totalSessionsCount
    );
    const averageResponseTimeSeconds = Number(
      (
        this.historyLogs.reduce((acc, s) => acc + s.averageResponseTimeSeconds, 0) / totalSessionsCount
      ).toFixed(1)
    );

    return {
      totalSessionsCount,
      totalMinutesPracticed,
      averageOverallScore,
      averageResponseTimeSeconds,
    };
  }
}

export const defaultLongitudinalMemory = new LongitudinalMemoryService();
