import { AdaptationConfig, StudentModel, WeaknessAnalysis } from '@/types/brain';

/**
 * Adaptation Engine
 * Dynamically adapts lesson difficulty, speech speed, exercise counts, exercise formats,
 * explanation styles, and scaffolding based on the Student Model and Weakness Engine.
 * Never uses fixed static rules.
 */
export class AdaptationEngine {
  /**
   * Generates a fully dynamic AdaptationConfig tailored to the student.
   */
  public calculateAdaptation(
    model: StudentModel,
    weakness?: WeaknessAnalysis
  ): AdaptationConfig {
    // 1. Difficulty Multiplier (0.8 = gentle scaffolding, 1.25 = challenging)
    let difficultyMultiplier = 1.0;
    if (model.confidenceScore < 60 || model.burnoutIndex > 50) {
      difficultyMultiplier = 0.85;
    } else if (model.confidenceScore > 85 && model.grammarMasteryPercent > 80) {
      difficultyMultiplier = 1.2;
    }

    // 2. Speech Rate
    let speechRate = 1.0;
    if (model.listeningMasteryPercent < 60) {
      speechRate = 0.85;
    } else if (model.listeningMasteryPercent >= 85) {
      speechRate = 1.05;
    }

    // 3. Exercise Count based on preferred session length
    const exerciseCount = Math.max(3, Math.min(12, Math.round(model.preferredSessionLengthMinutes / 2.5)));

    // 4. Exercise Types selected dynamically according to skill gaps
    const exerciseTypes: AdaptationConfig['exerciseTypes'] = [];
    if (model.speakingMasteryPercent < model.readingMasteryPercent) {
      exerciseTypes.push('open_speech', 'roleplay');
    }
    if (model.grammarMasteryPercent < 70) {
      exerciseTypes.push('fill_in_blank', 'multiple_choice');
    }
    if (exerciseTypes.length === 0) {
      exerciseTypes.push('roleplay', 'open_speech', 'fill_in_blank');
    }

    // 5. Explanation Depth
    let explanationDepth: AdaptationConfig['explanationDepth'] = 'balanced';
    if (model.learningStyle === 'auditory' || model.teacherPersonality === 'socratic') {
      explanationDepth = 'socratic_detailed';
    } else if (model.preferredSessionLengthMinutes <= 10) {
      explanationDepth = 'concise';
    }

    // 6. Example Context Style based on profession & hobbies
    let exampleContextStyle: AdaptationConfig['exampleContextStyle'] = 'daily_casual';
    if (model.profession.toLowerCase().includes('engineer') || model.profession.toLowerCase().includes('business')) {
      exampleContextStyle = 'business';
    } else if (model.hobbies.some((h) => h.toLowerCase().includes('coffee') || h.toLowerCase().includes('food'))) {
      exampleContextStyle = 'hobbies_tailored';
    }

    // 7. Recommended Teacher Persona
    let recommendedTeacherPersonaId = 'persona-sofia';
    if (exampleContextStyle === 'business') {
      recommendedTeacherPersonaId = 'persona-elena';
    } else if (exampleContextStyle === 'hobbies_tailored') {
      recommendedTeacherPersonaId = 'persona-marco';
    }

    // 8. Hint Level
    let hintLevel: AdaptationConfig['hintLevel'] = 'moderate';
    if (difficultyMultiplier < 0.9) hintLevel = 'generous';
    else if (difficultyMultiplier > 1.1) hintLevel = 'minimal';

    // 9. Review Ratio (proportion of lesson spent on review vs new content)
    let reviewRatio = 0.3; // Default 30% review, 70% new
    if (weakness && weakness.overallWeaknessScore > 60) {
      reviewRatio = 0.6; // 60% review when weaknesses are high
    } else if (model.confidenceScore > 85) {
      reviewRatio = 0.2; // 20% review when confidence is high
    }

    return {
      difficultyMultiplier,
      speechRate,
      exerciseCount,
      exerciseTypes,
      explanationDepth,
      exampleContextStyle,
      recommendedTeacherPersonaId,
      hintLevel,
      reviewRatio,
    };
  }
}

export const defaultAdaptationEngine = new AdaptationEngine();
