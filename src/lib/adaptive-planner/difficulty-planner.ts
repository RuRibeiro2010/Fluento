/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - DIFFICULTY PLANNER
 * 
 * Applies Krashen's Affective Filter Hypothesis and Vygotsky's Zone of Proximal Development (ZPD)
 * to decide scaffolding levels and difficulty challenge settings.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { LearningAnalyticsReport } from '@/src/lib/learning-analytics';
import { ScaffoldingLevel, DifficultySetting, TutorStyleConfig } from './types';

export interface DifficultyPlanResult {
  scaffoldingLevel: ScaffoldingLevel;
  difficultySetting: DifficultySetting;
  tutorStyle: TutorStyleConfig;
}

export class DifficultyPlanner {
  public planDifficulty(
    twin: StudentDigitalTwinState,
    analytics?: LearningAnalyticsReport
  ): DifficultyPlanResult {
    const anxietyLevel = analytics ? analytics.anxietyTrend.currentAnxietyLevel : 40;
    const confidenceScore = analytics ? analytics.confidence.score : 60;
    const independenceScore = analytics ? analytics.independence.score : 60;

    let scaffoldingLevel: ScaffoldingLevel = 'moderate';
    let difficultySetting: DifficultySetting = 'optimal_challenge';

    // High anxiety or low confidence -> lower difficulty, higher scaffolding
    if (anxietyLevel > 60 || confidenceScore < 50) {
      scaffoldingLevel = 'high';
      difficultySetting = 'comfortable';
    } else if (independenceScore > 80 && confidenceScore > 75) {
      scaffoldingLevel = 'minimal';
      difficultySetting = 'stretch';
    } else if (independenceScore > 65) {
      scaffoldingLevel = 'minimal';
      difficultySetting = 'optimal_challenge';
    }

    // Tutor style adjustment based on affective state
    let pace: 'slow' | 'moderate' | 'brisk' = 'moderate';
    let tone: 'supportive' | 'direct' | 'socratic' | 'encouraging' = 'encouraging';
    let correctionStrategy: 'immediate' | 'delayed_summary' | 'gentle_implicit' = 'gentle_implicit';

    if (difficultySetting === 'comfortable') {
      pace = 'slow';
      tone = 'supportive';
      correctionStrategy = 'gentle_implicit';
    } else if (difficultySetting === 'stretch') {
      pace = 'brisk';
      tone = 'socratic';
      correctionStrategy = 'delayed_summary';
    }

    return {
      scaffoldingLevel,
      difficultySetting,
      tutorStyle: {
        pace,
        tone,
        correctionStrategy
      }
    };
  }
}

export const difficultyPlanner = new DifficultyPlanner();
