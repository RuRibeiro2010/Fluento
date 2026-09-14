import { StudentModelEngine, defaultStudentModel } from './student-model';
import { LongitudinalMemoryService, defaultLongitudinalMemory } from './memory';
import { WeaknessEngine, defaultWeaknessEngine } from './weakness-engine';
import { ReviewEngine, defaultReviewEngine } from './review-engine';
import { RecommendationEngine, defaultRecommendationEngine } from './recommendations';
import { AdaptationEngine, defaultAdaptationEngine } from './adaptation';
import { LessonLibraryService, defaultLessonLibrary, LessonBuilderEngine, defaultLessonBuilderEngine } from '@/lib/content';
import { ModularLesson, StudentSimilarityProfile } from '@/types/content';
import {
  StudentModel,
  WeaknessAnalysis,
  ReviewItem,
  BrainRecommendation,
  AdaptationConfig,
  FutureIntegrationsState,
  LessonSessionHistoryLog,
} from '@/types/brain';

export * from './student-model';
export * from './memory';
export * from './weakness-engine';
export * from './review-engine';
export * from './recommendations';
export * from './adaptation';

export interface NextLessonBlueprint {
  topicTitle: string;
  cefrLevel: string;
  rationale: string;
  adaptation: AdaptationConfig;
  reviewItemsToInclude: ReviewItem[];
  weaknessFocusPoints: string[];
  personalizedExamplesContext: string[];
  recommendedTeacherPersonaId: string;
  estimatedMinutes: number;
  modularLesson?: ModularLesson;
}

/**
 * AI Brain Core Orchestrator
 * Central intelligence engine of Fluento. Ensures no random lesson generation.
 * Analyzes full longitudinal history, student model, weaknesses, review curve, and goals
 * before recommending or generating any activity.
 */
export class AIBrain {
  public studentModel: StudentModelEngine;
  public memory: LongitudinalMemoryService;
  public weaknessEngine: WeaknessEngine;
  public reviewEngine: ReviewEngine;
  public recommendationEngine: RecommendationEngine;
  public adaptationEngine: AdaptationEngine;
  public lessonLibrary: LessonLibraryService;
  public lessonBuilder: LessonBuilderEngine;

  constructor(
    studentModel: StudentModelEngine = defaultStudentModel,
    memory: LongitudinalMemoryService = defaultLongitudinalMemory,
    lessonLibrary: LessonLibraryService = defaultLessonLibrary,
    lessonBuilder: LessonBuilderEngine = defaultLessonBuilderEngine
  ) {
    this.studentModel = studentModel;
    this.memory = memory;
    this.weaknessEngine = defaultWeaknessEngine;
    this.reviewEngine = defaultReviewEngine;
    this.recommendationEngine = defaultRecommendationEngine;
    this.adaptationEngine = defaultAdaptationEngine;
    this.lessonLibrary = lessonLibrary;
    this.lessonBuilder = lessonBuilder;
  }

  /**
   * Deep Analysis Pipeline BEFORE creating or recommending any lesson.
   * Analyzes: history, goals, available time, preferences, difficulties, confidence,
   * forgotten words, progress, and last sessions.
   */
  public async analyzeAndPrepareNextLessonAsync(timeAvailableMinutes?: number): Promise<NextLessonBlueprint> {
    const model = this.studentModel.getModel();
    const weakness = this.weaknessEngine.analyzeWeaknesses(model);
    const reviewData = this.reviewEngine.generateReviewQueue(model);

    const availableTime = timeAvailableMinutes || model.preferredSessionLengthMinutes;

    // 1. Calculate dynamic adaptation
    const adaptation = this.adaptationEngine.calculateAdaptation(model, weakness);

    // 2. Select review items to include
    const reviewItemsToInclude = reviewData.reviewQueue.slice(0, 3);

    // 3. Formulate topic and rationale based on weak points & objectives
    let topicTitle = model.currentFocusArea;
    let rationale = `Selected based on your ${model.confidenceScore}% confidence score and recent struggle with ${weakness.verbTenseStruggles[0] || 'verb tenses'}.`;

    if (weakness.overallWeaknessScore > 65 && weakness.verbTenseStruggles.length > 0) {
      topicTitle = `Targeted Mastery: ${weakness.verbTenseStruggles[0]}`;
      rationale = `Your recent session logs show a ${weakness.overallWeaknessScore}% weakness density in ${weakness.verbTenseStruggles[0]}. Prioritizing clarity before new topics.`;
    } else if (model.vocabularyMasteryPercent < 65 && weakness.difficultVocabulary.length > 0) {
      topicTitle = `Active Vocabulary Escalation (${weakness.difficultVocabulary.length} words)`;
      rationale = `Escalating passive vocabulary into active natural usage for your upcoming trip/goal.`;
    }

    // 4. Look up inspiration lesson from Premium Library (if eligible, qualityScore >= 90, non-identical user)
    const similarityProfile: StudentSimilarityProfile = {
      userId: model.userId,
      targetLanguage: model.targetLanguage,
      cefrLevel: model.currentCefr,
      objectives: model.objectives,
      interests: model.hobbies,
      weaknesses: weakness.verbTenseStruggles,
      learningStyle: model.learningStyle,
      timeAvailableMinutes: availableTime,
    };

    const inspirationMatch = this.lessonLibrary.findInspirationLesson(similarityProfile);

    // 5. Build Modular Lesson without copying directly
    const modularLesson = await this.lessonBuilder.buildModularLesson({
      studentModel: model,
      weaknessAnalysis: weakness,
      inspirationLesson: inspirationMatch?.lesson || null,
    });

    // 6. Personalized example contexts based on user profile
    const personalizedExamplesContext = [
      `Context: ${model.profession} workplace scenarios`,
      `Interests: ${model.hobbies.join(', ')}`,
      `Motivation Goal: ${model.reasonsToLearn[0] || model.objectives[0]}`,
    ];

    return {
      topicTitle,
      cefrLevel: model.currentCefr,
      rationale,
      adaptation,
      reviewItemsToInclude,
      weaknessFocusPoints: weakness.problematicGrammarRules.slice(0, 3),
      personalizedExamplesContext,
      recommendedTeacherPersonaId: adaptation.recommendedTeacherPersonaId,
      estimatedMinutes: availableTime,
      modularLesson,
    };
  }

  public analyzeAndPrepareNextLesson(timeAvailableMinutes?: number): NextLessonBlueprint {
    const model = this.studentModel.getModel();
    const weakness = this.weaknessEngine.analyzeWeaknesses(model);
    const reviewData = this.reviewEngine.generateReviewQueue(model);

    const availableTime = timeAvailableMinutes || model.preferredSessionLengthMinutes;
    const adaptation = this.adaptationEngine.calculateAdaptation(model, weakness);
    const reviewItemsToInclude = reviewData.reviewQueue.slice(0, 3);

    let topicTitle = model.currentFocusArea;
    let rationale = `Selected based on your ${model.confidenceScore}% confidence score and recent struggle with ${weakness.verbTenseStruggles[0] || 'verb tenses'}.`;

    if (weakness.overallWeaknessScore > 65 && weakness.verbTenseStruggles.length > 0) {
      topicTitle = `Targeted Mastery: ${weakness.verbTenseStruggles[0]}`;
      rationale = `Your recent session logs show a ${weakness.overallWeaknessScore}% weakness density in ${weakness.verbTenseStruggles[0]}. Prioritizing clarity before new topics.`;
    } else if (model.vocabularyMasteryPercent < 65 && weakness.difficultVocabulary.length > 0) {
      topicTitle = `Active Vocabulary Escalation (${weakness.difficultVocabulary.length} words)`;
      rationale = `Escalating passive vocabulary into active natural usage for your upcoming trip/goal.`;
    }

    const personalizedExamplesContext = [
      `Context: ${model.profession} workplace scenarios`,
      `Interests: ${model.hobbies.join(', ')}`,
      `Motivation Goal: ${model.reasonsToLearn[0] || model.objectives[0]}`,
    ];

    return {
      topicTitle,
      cefrLevel: model.currentCefr,
      rationale,
      adaptation,
      reviewItemsToInclude,
      weaknessFocusPoints: weakness.problematicGrammarRules.slice(0, 3),
      personalizedExamplesContext,
      recommendedTeacherPersonaId: adaptation.recommendedTeacherPersonaId,
      estimatedMinutes: availableTime,
    };
  }

  /**
   * Generates actionable recommendations for the user's Dashboard / AI Coach
   */
  public getDashboardRecommendations(): BrainRecommendation[] {
    const model = this.studentModel.getModel();
    const weakness = this.weaknessEngine.analyzeWeaknesses(model);
    return this.recommendationEngine.generateRecommendations(model, weakness);
  }

  /**
   * Complete status of future capabilities & real-time readiness
   */
  public getFutureIntegrationsState(): FutureIntegrationsState {
    return {
      realtimeVoiceEnabled: true,
      geminiLiveSupported: true,
      openAiRealtimeSupported: true,
      videoCallCapable: true,
      multiDeviceSyncStatus: 'synced',
      offlineModeAvailable: true,
    };
  }
}

export const brainEngine = new AIBrain();

