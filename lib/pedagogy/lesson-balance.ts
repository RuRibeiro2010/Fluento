import { SkillBalanceDistribution } from '@/types/pedagogy';
import { StudentModel, WeaknessAnalysis } from '@/types/brain';

/**
 * Lesson Balance Engine
 * Dynamically balances time distribution across 7 core skills:
 * Conversation, Grammar, Vocabulary, Pronunciation, Listening, Reading, Writing.
 */
export class LessonBalanceEngine {
  /**
   * Calculates time allocation and skill weights for a total session time (e.g., 15 mins)
   */
  public calculateBalance(
    studentModel: StudentModel,
    weakness: WeaknessAnalysis,
    totalMinutes: number = 15
  ): SkillBalanceDistribution {
    const gScore = studentModel.grammarMasteryPercent || 70;
    const vScore = studentModel.vocabularyMasteryPercent || 70;
    const pScore = studentModel.speakingMasteryPercent || 70;

    // Default balanced weights
    let conversationWeight = 30;
    let grammarWeight = 15;
    let vocabularyWeight = 15;
    let pronunciationWeight = 10;
    let listeningWeight = 10;
    let readingWeight = 10;
    let writingWeight = 10;

    // Shift weights dynamically based on gaps
    if (gScore < 60) {
      grammarWeight += 15;
      conversationWeight -= 10;
    }
    if (vScore < 60) {
      vocabularyWeight += 15;
      conversationWeight -= 10;
    }
    if (pScore < 60) {
      pronunciationWeight += 15;
      listeningWeight -= 5;
    }

    // Ensure weights sum to 100
    const sum =
      conversationWeight +
      grammarWeight +
      vocabularyWeight +
      pronunciationWeight +
      listeningWeight +
      readingWeight +
      writingWeight;

    const norm = (w: number) => Math.round((w / sum) * 100);

    const normConv = norm(conversationWeight);
    const normGram = norm(grammarWeight);
    const normVocab = norm(vocabularyWeight);
    const normPron = norm(pronunciationWeight);
    const normList = norm(listeningWeight);
    const normRead = norm(readingWeight);
    const normWrit = norm(writingWeight);

    // Calculate minute allocation
    const timeAlloc = (w: number) => Math.max(1, Math.round((w / 100) * totalMinutes));

    return {
      conversationWeight: normConv,
      grammarWeight: normGram,
      vocabularyWeight: normVocab,
      pronunciationWeight: normPron,
      listeningWeight: normList,
      readingWeight: normRead,
      writingWeight: normWrit,
      timeAllocationMinutes: {
        conversation: timeAlloc(normConv),
        grammar: timeAlloc(normGram),
        vocabulary: timeAlloc(normVocab),
        pronunciation: timeAlloc(normPron),
        listening: timeAlloc(normList),
        reading: timeAlloc(normRead),
        writing: timeAlloc(normWrit),
        review: Math.max(2, Math.round(totalMinutes * 0.15)),
      },
    };
  }
}

export const defaultLessonBalanceEngine = new LessonBalanceEngine();
