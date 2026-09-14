import { BrainRecommendation, StudentModel, WeaknessAnalysis } from '@/types/brain';

/**
 * Recommendation Engine
 * Analyzes the student model, weakness logs, and review priorities to generate
 * actionable, non-random next steps for the Dashboard and AI Coach interface.
 */
export class RecommendationEngine {
  /**
   * Generates prioritized AI Coach recommendations for the student
   */
  public generateRecommendations(
    model: StudentModel,
    weakness: WeaknessAnalysis
  ): BrainRecommendation[] {
    const recs: BrainRecommendation[] = [];
    const now = new Date().toISOString();

    // 1. High priority grammar/weakness recommendation
    if (weakness.verbTenseStruggles.length > 0) {
      const targetTense = weakness.verbTenseStruggles[0];
      recs.push({
        id: `rec-grm-${Date.now()}-1`,
        title: `Review ${targetTense}`,
        category: 'review',
        urgency: 'high',
        explanation: `Your error rate in ${targetTense} was detected in recent sessions. A 5-minute review will solidify your accuracy.`,
        targetActivity: 'lesson',
        estimatedMinutes: 5,
        createdAt: now,
      });
    }

    // 2. Listening / Speaking balance recommendation
    if (model.speakingMasteryPercent < model.readingMasteryPercent - 15) {
      recs.push({
        id: `rec-spk-${Date.now()}-2`,
        title: 'Practice Speaking & Conversational Flow',
        category: 'practice',
        urgency: 'high',
        explanation: `Your reading level is high (${model.readingMasteryPercent}%), but your speaking confidence (${model.speakingMasteryPercent}%) needs active practice.`,
        targetActivity: 'scenario',
        estimatedMinutes: 10,
        createdAt: now,
      });
    } else {
      recs.push({
        id: `rec-lst-${Date.now()}-3`,
        title: 'Focus on Listening Comprehension Tomorrow',
        category: 'practice',
        urgency: 'medium',
        explanation: `Listening accuracy is at ${model.listeningMasteryPercent}%. Listening to native dialogues at 0.9x speed will boost comprehension.`,
        targetActivity: 'listening_drill',
        estimatedMinutes: 8,
        createdAt: now,
      });
    }

    // 3. Positive Milestone Acknowledgement
    if (model.vocabularyMasteryPercent >= 70) {
      recs.push({
        id: `rec-mstr-${Date.now()}-4`,
        title: 'Vocabulary Milestone Unlocked!',
        category: 'milestone',
        urgency: 'low',
        explanation: `You now actively command over ${model.vocabularyInventory.filter((w) => w.state === 'uses_naturally').length} words naturally in context.`,
        targetActivity: 'coaching_chat',
        estimatedMinutes: 3,
        createdAt: now,
      });
    }

    // 4. Irregular verbs / vocabulary recall
    if (weakness.difficultVocabulary.length > 0) {
      const wordCount = weakness.difficultVocabulary.length;
      recs.push({
        id: `rec-voc-${Date.now()}-5`,
        title: `Review ${wordCount} Weak Words`,
        category: 'review',
        urgency: 'medium',
        explanation: `Words like "${weakness.difficultVocabulary[0]?.word}" are in your passive memory. Escalate them to active natural usage!`,
        targetActivity: 'review_quiz',
        estimatedMinutes: 5,
        createdAt: now,
      });
    }

    // 5. Mindset / Burnout prevention check
    if (model.burnoutIndex >= 60) {
      recs.push({
        id: `rec-bnd-${Date.now()}-6`,
        title: 'Relaxed Conversation Session Suggested',
        category: 'mindset',
        urgency: 'high',
        explanation: 'You have been pushing hard! Switch to a relaxed 5-minute coffee chat with Sofia to keep practice enjoyable.',
        targetActivity: 'scenario',
        estimatedMinutes: 5,
        createdAt: now,
      });
    }

    return recs;
  }
}

export const defaultRecommendationEngine = new RecommendationEngine();
