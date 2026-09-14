import { GrammarMemory, GrammarRuleItem } from '@/types/memory';

/**
 * Grammar Memory Module
 * Tracks grammar concept error rates, struggle patterns, and mastery progression.
 */
export class GrammarMemoryService {
  private memory: GrammarMemory;

  constructor(userId: string = 'usr_default', targetLanguage: string = 'es') {
    this.memory = {
      userId,
      targetLanguage,
      rules: [
        {
          id: 'g1',
          conceptName: 'Ser vs Estar Distinction',
          category: 'tenses',
          errorRate: 0.35,
          timesEncountered: 12,
          lastReviewedDate: new Date().toISOString(),
          masteryStatus: 'review_needed',
          notes: 'Tends to confuse temporary states (estar) with inherent attributes (ser).',
        },
        {
          id: 'g2',
          conceptName: 'Preposition "Por" vs "Para"',
          category: 'prepositions',
          errorRate: 0.2,
          timesEncountered: 8,
          lastReviewedDate: new Date().toISOString(),
          masteryStatus: 'learning',
          notes: 'Good grasp on cause vs purpose, occasional slip on travel destinations.',
        },
        {
          id: 'g3',
          conceptName: 'Subjunctive Mood Basics',
          category: 'moods',
          errorRate: 0.55,
          timesEncountered: 5,
          lastReviewedDate: new Date().toISOString(),
          masteryStatus: 'learning',
          notes: 'Requires guided triggers for wishes and doubts.',
        },
      ],
      overallGrammarScore: 78,
    };
  }

  public get(): GrammarMemory {
    return { ...this.memory };
  }

  public logGrammarEncounter(
    conceptName: string,
    category: GrammarRuleItem['category'],
    hasError: boolean,
    notes?: string
  ): GrammarRuleItem {
    const existing = this.memory.rules.find(
      (r) => r.conceptName.toLowerCase() === conceptName.toLowerCase()
    );

    let updatedRule: GrammarRuleItem;

    if (existing) {
      const timesEncountered = existing.timesEncountered + 1;
      const previousErrors = Math.round(existing.errorRate * existing.timesEncountered);
      const newErrors = previousErrors + (hasError ? 1 : 0);
      const errorRate = Number((newErrors / timesEncountered).toFixed(2));

      let masteryStatus: GrammarRuleItem['masteryStatus'] = 'learning';
      if (errorRate < 0.15 && timesEncountered >= 5) masteryStatus = 'mastered';
      else if (errorRate >= 0.3) masteryStatus = 'review_needed';

      updatedRule = {
        ...existing,
        timesEncountered,
        errorRate,
        masteryStatus,
        lastReviewedDate: new Date().toISOString(),
        notes: notes || existing.notes,
      };

      this.memory.rules = this.memory.rules.map((r) => (r.id === existing.id ? updatedRule : r));
    } else {
      const errorRate = hasError ? 1.0 : 0.0;
      updatedRule = {
        id: `grm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        conceptName,
        category,
        errorRate,
        timesEncountered: 1,
        lastReviewedDate: new Date().toISOString(),
        masteryStatus: hasError ? 'review_needed' : 'learning',
        notes,
      };

      this.memory.rules.push(updatedRule);
    }

    this.recalculateOverallScore();
    return updatedRule;
  }

  public getRulesNeedingReview(): GrammarRuleItem[] {
    return this.memory.rules.filter((r) => r.masteryStatus === 'review_needed' || r.errorRate >= 0.3);
  }

  private recalculateOverallScore(): void {
    if (this.memory.rules.length === 0) return;
    const avgErrorRate =
      this.memory.rules.reduce((acc, r) => acc + r.errorRate, 0) / this.memory.rules.length;
    this.memory.overallGrammarScore = Math.max(0, Math.min(100, Math.round((1 - avgErrorRate) * 100)));
  }
}
