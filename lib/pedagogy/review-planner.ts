import { PedagogicalModulePlan } from '@/types/pedagogy';
import { StudentModel, WeaknessAnalysis } from '@/types/brain';

export interface ReviewPlannerParams {
  studentModel: StudentModel;
  weakness: WeaknessAnalysis;
  targetLanguage: string;
  nativeLanguage: string;
  durationMinutes: number;
}

/**
 * Review Planner
 * Schedules spaced repetition items (decayed items < 70%, forgotten words, grammar errors)
 * into structured pedagogical lesson blocks.
 */
export class ReviewPlanner {
  public createReviewModule(params: ReviewPlannerParams): PedagogicalModulePlan {
    const { weakness, targetLanguage, nativeLanguage, durationMinutes } = params;

    const problematicTenses = weakness.verbTenseStruggles.join(', ') || 'Recent Grammar Decay Points';
    const forgottenWords = weakness.difficultVocabulary.map((v) => v.word).slice(0, 3).join(', ') || 'Spaced Repetition Vocabulary';

    return {
      id: `ped-rev-${Date.now()}`,
      moduleType: 'review',
      title: `Intelligent Spaced Repetition Review`,
      targetLanguage,
      nativeLanguage,
      durationMinutes,
      pedagogicalGoal: `Reinforcing memory stability ($S$) for items near retention decay threshold (< 70%): ${problematicTenses} & [${forgottenWords}].`,
      instructions: `Targeted rapid-fire review in ${targetLanguage.toUpperCase()}. Immediately correct syntax or vocabulary mistakes to prevent fossilization.`,
      exercises: [
        {
          prompt: `Quick Recall: How do you use [${forgottenWords || 'target vocabulary'}] in ${targetLanguage.toUpperCase()}?`,
          targetResponse: `Accurate recall sentence.`,
          hints: [`Think back to your last session logs.`],
        },
      ],
    };
  }
}

export const defaultReviewPlanner = new ReviewPlanner();
