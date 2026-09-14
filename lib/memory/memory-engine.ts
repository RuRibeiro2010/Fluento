import {
  UserFullMemory,
  MemoryContextSummary,
} from '@/types/memory';
import { ProfileMemoryService } from './profile-memory';
import { VocabularyMemoryService } from './vocabulary-memory';
import { GrammarMemoryService } from './grammar-memory';
import { ConversationMemoryService } from './conversation-memory';
import { PerformanceMemoryService } from './performance-memory';
import { MotivationMemoryService } from './motivation-memory';
import { LearningDnaService } from './learning-dna';
import { SessionReport } from '@/types/teacher';

/**
 * AI Memory Engine Orchestrator
 * Centralized intelligent long-term memory layer for AI Coach and Virtual Teacher.
 * Prepared for Supabase / database persistence integration.
 */
export class AIMemoryEngine {
  public profile: ProfileMemoryService;
  public vocabulary: VocabularyMemoryService;
  public grammar: GrammarMemoryService;
  public conversation: ConversationMemoryService;
  public performance: PerformanceMemoryService;
  public motivation: MotivationMemoryService;
  public learningDna: LearningDnaService;

  private userId: string;
  private targetLanguage: string;

  constructor(userId: string = 'usr_default', targetLanguage: string = 'es') {
    this.userId = userId;
    this.targetLanguage = targetLanguage;

    this.profile = new ProfileMemoryService({ userId, targetLanguages: [targetLanguage] });
    this.vocabulary = new VocabularyMemoryService(userId, targetLanguage);
    this.grammar = new GrammarMemoryService(userId, targetLanguage);
    this.conversation = new ConversationMemoryService(userId, targetLanguage);
    this.performance = new PerformanceMemoryService(userId, targetLanguage);
    this.motivation = new MotivationMemoryService(userId);
    this.learningDna = new LearningDnaService(userId);
  }

  /**
   * Retrieves the unified, full memory state
   */
  public getFullMemory(): UserFullMemory {
    return {
      profile: this.profile.get(),
      vocabulary: this.vocabulary.get(),
      grammar: this.grammar.get(),
      conversation: this.conversation.get(),
      performance: this.performance.get(),
      motivation: this.motivation.get(),
      learningDna: this.learningDna.get(),
    };
  }

  /**
   * Synthesizes memory into high-density prompt briefs for AI Coach & Virtual Teacher
   */
  public generateContextSummary(): MemoryContextSummary {
    const prof = this.profile.get();
    const vocab = this.vocabulary.getWeakWords();
    const grm = this.grammar.getRulesNeedingReview();
    const conv = this.conversation.getRecentSessions(1)[0];
    const perf = this.performance.get();
    const mot = this.motivation.get();

    const urgentReviewWords = vocab.map((v) => v.word).slice(0, 5);
    const urgentGrammarConcepts = grm.map((g) => g.conceptName).slice(0, 3);

    const coachBrief = `Learner (${prof.cefrLevel} Level, ${mot.currentStreakDays}-day streak) is working towards "${mot.primaryMotivation}". Key weak spot: ${urgentGrammarConcepts.join(', ') || 'None'}. Focus words: ${urgentReviewWords.join(', ') || 'None'}. Confidence score: ${perf.currentConfidenceScore}%.`;

    const teacherBrief = `User level: ${prof.cefrLevel}. Prefers ${this.learningDna.get().preferredCorrectionMode} corrections. Recent topic: ${conv?.topicsDiscussed[0] || 'General conversation'}. Watch out for grammar errors in: ${urgentGrammarConcepts.join(', ') || 'basics'}.`;

    return {
      userId: this.userId,
      targetLanguage: this.targetLanguage,
      coachBrief,
      teacherBrief,
      urgentReviewWords,
      urgentGrammarConcepts,
      recommendedFocusArea: urgentGrammarConcepts[0] || 'Interactive Conversation Practice',
      confidenceScore: perf.currentConfidenceScore,
      streakDays: mot.currentStreakDays,
    };
  }

  /**
   * Incremental memory update after a Virtual Teacher session
   */
  public recordTeacherSessionOutcome(report: SessionReport): void {
    // 1. Log conversation
    this.conversation.logSession({
      id: report.sessionId,
      characterName: report.characterName,
      mode: report.mode,
      date: report.createdAt,
      durationMinutes: report.durationMinutes,
      totalUserTurns: report.totalUserTurns,
      fluencyScore: report.fluencyScore,
      pronunciationScore: report.pronunciationScore,
      topicsDiscussed: [report.characterName, report.mode],
      keyFeedbackSummary: report.summaryFeedback,
    });

    // 2. Update new vocabulary learned
    report.newWordsLearned.forEach((item) => {
      this.vocabulary.recordWordPractice(item.word, item.meaning, true, item.contextSentence);
    });

    // 3. Update frequent errors in grammar memory
    report.frequentErrors.forEach((err) => {
      const cat = (err.category === 'grammar' || err.category === 'style') ? 'syntax' : (err.category as any);
      this.grammar.logGrammarEncounter(err.error, cat, true, `Corrected to: ${err.correction}`);
    });

    // 4. Update performance snapshot
    this.performance.addSnapshot({
      date: new Date().toISOString(),
      fluencyScore: report.fluencyScore,
      grammarScore: report.grammarScore,
      vocabularyScore: report.vocabularyScore,
      pronunciationScore: report.pronunciationScore,
      listeningScore: Math.min(100, report.fluencyScore + 5),
      speakingScore: report.fluencyScore,
      overallConfidence: Math.round(
        (report.fluencyScore + report.grammarScore + report.vocabularyScore) / 3
      ),
    });

    // 5. Update streak activity
    this.motivation.registerActivity();
  }

  /**
   * Prepared for Supabase / PostgreSQL persistence synchronization
   */
  public exportForSupabase(): Record<string, any> {
    return {
      user_id: this.userId,
      target_language: this.targetLanguage,
      full_memory_json: JSON.stringify(this.getFullMemory()),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Import memory state from database
   */
  public importFromSupabase(dbPayload: Record<string, any>): void {
    if (!dbPayload?.full_memory_json) return;
    try {
      const parsed: UserFullMemory = JSON.parse(dbPayload.full_memory_json);
      if (parsed.profile) this.profile.update(parsed.profile);
      // Further module hydration if required...
    } catch (err) {
      console.error('Failed to import AI Memory Engine payload:', err);
    }
  }
}

// Singleton export for quick app usage
export const defaultMemoryEngine = new AIMemoryEngine();
