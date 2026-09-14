import { StudentModel } from '@/types/brain';
import { defaultImmersionEngine, ImmersionEngine } from './immersion-engine';
import { defaultHelpEngine, HelpEngine, HelpResponse } from './help-engine';
import { defaultTranslationEngine, TranslationEngine } from './translation-engine';
import { defaultExplanationEngine, ExplanationEngine } from './explanation-engine';
import { StudentModelEngine, defaultStudentModel } from '@/lib/brain/student-model';

export interface StudentInteractionState {
  wrongAnswersCount: number;
  silenceSeconds: number;
  helpRequestsCount: number;
  consecutiveSuccessesCount: number;
  lastTopicStudied?: string;
}

export interface AdaptiveTeacherSpeechConfig {
  speechRate: number; // 0.75 - 1.1x
  sentenceLengthPreference: 'short' | 'medium' | 'normal';
  difficultyAdjustment: 'lowered' | 'standard' | 'elevated';
  positiveReinforcementMessage?: string;
  increasedExamples: boolean;
}

export interface TeachingAdaptationRecord {
  timestamp: string;
  difficultTopics: string[];
  difficultGrammar: string[];
  difficultVocabulary: string[];
  helpRequestsFrequency: number;
  bestExplanationStyle: string;
}

/**
 * Adaptive Teaching Engine
 * Coordinates real-time pedagogical adjustments during Virtual Teacher sessions.
 * Automatically detects wrong answers, silence, low confidence, or repeated help requests
 * and adjusts speech rate, difficulty, and example density, updating the AI Brain continuously.
 */
export class AdaptiveTeachingEngine {
  public immersionEngine: ImmersionEngine;
  public helpEngine: HelpEngine;
  public translationEngine: TranslationEngine;
  public explanationEngine: ExplanationEngine;
  public studentModelEngine: StudentModelEngine;

  private adaptationHistory: TeachingAdaptationRecord[] = [];

  constructor(
    immersionEngine: ImmersionEngine = defaultImmersionEngine,
    helpEngine: HelpEngine = defaultHelpEngine,
    translationEngine: TranslationEngine = defaultTranslationEngine,
    explanationEngine: ExplanationEngine = defaultExplanationEngine,
    studentModelEngine: StudentModelEngine = defaultStudentModel
  ) {
    this.immersionEngine = immersionEngine;
    this.helpEngine = helpEngine;
    this.translationEngine = translationEngine;
    this.explanationEngine = explanationEngine;
    this.studentModelEngine = studentModelEngine;
  }

  /**
   * Analyzes real-time interaction signals to detect student struggles and adjust teacher delivery.
   */
  public evaluateAndAdjustDelivery(
    interactionState: StudentInteractionState,
    studentModel?: StudentModel
  ): AdaptiveTeacherSpeechConfig {
    const model = studentModel || this.studentModelEngine.getModel();

    const isStruggling =
      interactionState.wrongAnswersCount >= 2 ||
      interactionState.silenceSeconds >= 15 ||
      interactionState.helpRequestsCount >= 2 ||
      model.confidenceScore < 60;

    if (isStruggling) {
      // Lower difficulty, slow down speech, use short sentences and positive reinforcement
      return {
        speechRate: 0.8,
        sentenceLengthPreference: 'short',
        difficultyAdjustment: 'lowered',
        increasedExamples: true,
        positiveReinforcementMessage: `🌟 You are doing fantastic! Let's take this step by step at a relaxed pace.`,
      };
    }

    if (interactionState.consecutiveSuccessesCount >= 3 && model.confidenceScore >= 80) {
      return {
        speechRate: 1.0,
        sentenceLengthPreference: 'normal',
        difficultyAdjustment: 'elevated',
        increasedExamples: false,
        positiveReinforcementMessage: `🚀 Great momentum! Let's try a slightly richer phrasing.`,
      };
    }

    return {
      speechRate: 0.95,
      sentenceLengthPreference: 'medium',
      difficultyAdjustment: 'standard',
      increasedExamples: false,
    };
  }

  /**
   * Triggers the "Explain Better" feature and updates AI Brain memory with difficulty log.
   */
  public triggerExplainBetter(
    lastConcept: string,
    targetLanguage: string,
    nativeLanguage: string,
    studentModel?: StudentModel
  ): {
    helpResponse: HelpResponse;
    speechConfig: AdaptiveTeacherSpeechConfig;
  } {
    const model = studentModel || this.studentModelEngine.getModel();

    const helpResponse = this.helpEngine.handleExplainBetter(
      lastConcept,
      targetLanguage,
      nativeLanguage,
      model.currentCefr
    );

    const speechConfig = this.evaluateAndAdjustDelivery(
      {
        wrongAnswersCount: 1,
        silenceSeconds: 0,
        helpRequestsCount: 2,
        consecutiveSuccessesCount: 0,
      },
      model
    );

    // Save adaptation metadata to history
    this.recordAdaptationEvent({
      topic: lastConcept,
      explanationStyle: 'native_comparison',
    });

    return {
      helpResponse,
      speechConfig,
    };
  }

  /**
   * Records difficulty occurrences into AI Brain memory for long-term personalization.
   */
  public recordAdaptationEvent(params: {
    topic: string;
    grammar?: string;
    word?: string;
    explanationStyle?: string;
  }): void {
    const record: TeachingAdaptationRecord = {
      timestamp: new Date().toISOString(),
      difficultTopics: [params.topic],
      difficultGrammar: params.grammar ? [params.grammar] : [],
      difficultVocabulary: params.word ? [params.word] : [],
      helpRequestsFrequency: 1,
      bestExplanationStyle: params.explanationStyle || 'daily_life',
    };

    this.adaptationHistory.push(record);
  }

  public getAdaptationHistory(): TeachingAdaptationRecord[] {
    return [...this.adaptationHistory];
  }
}

export const defaultAdaptiveTeachingEngine = new AdaptiveTeachingEngine();
