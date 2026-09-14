import {
  FullPedagogicalLessonPlan,
  PedagogicalDecision,
  PedagogicalModulePlan,
  ProficiencyFramework,
} from '@/types/pedagogy';
import { StudentModel, WeaknessAnalysis } from '@/types/brain';
import { CurriculumEngine, defaultCurriculumEngine } from './curriculum-engine';
import { DifficultyEngine, defaultDifficultyEngine } from './difficulty-engine';
import { LessonBalanceEngine, defaultLessonBalanceEngine } from './lesson-balance';
import { GrammarEngine, defaultGrammarEngine } from './grammar-engine';
import { VocabularyEngine, defaultVocabularyEngine } from './vocabulary-engine';
import { PronunciationEngine, defaultPronunciationEngine } from './pronunciation-engine';
import { ListeningEngine, defaultListeningEngine } from './listening-engine';
import { SpeakingEngine, defaultSpeakingEngine } from './speaking-engine';
import { WritingEngine, defaultWritingEngine } from './writing-engine';
import { ReviewPlanner, defaultReviewPlanner } from './review-planner';
import { ImmersionEngine, defaultImmersionEngine } from '@/lib/teacher/immersion-engine';

export interface LessonPlannerConfig {
  studentModel: StudentModel;
  weaknessAnalysis: WeaknessAnalysis;
  framework?: ProficiencyFramework;
  frameworkLevelCode?: string;
  sessionDurationMinutes?: number;
}

/**
 * Pedagogical Lesson Planner
 * Central Orchestrator of the Fluento Pedagogical Engine.
 * Explicitly decides WHAT, WHY, ORDER, DURATION, REVIEWS, and DIFFICULTY
 * before generating a complete structured lesson plan with full pedagogical rationale.
 */
export class LessonPlanner {
  private curriculumEngine: CurriculumEngine;
  private difficultyEngine: DifficultyEngine;
  private lessonBalanceEngine: LessonBalanceEngine;
  private grammarEngine: GrammarEngine;
  private vocabularyEngine: VocabularyEngine;
  private pronunciationEngine: PronunciationEngine;
  private listeningEngine: ListeningEngine;
  private speakingEngine: SpeakingEngine;
  private writingEngine: WritingEngine;
  private reviewPlanner: ReviewPlanner;
  private immersionEngine: ImmersionEngine;

  constructor() {
    this.curriculumEngine = defaultCurriculumEngine;
    this.difficultyEngine = defaultDifficultyEngine;
    this.lessonBalanceEngine = defaultLessonBalanceEngine;
    this.grammarEngine = defaultGrammarEngine;
    this.vocabularyEngine = defaultVocabularyEngine;
    this.pronunciationEngine = defaultPronunciationEngine;
    this.listeningEngine = defaultListeningEngine;
    this.speakingEngine = defaultSpeakingEngine;
    this.writingEngine = defaultWritingEngine;
    this.reviewPlanner = defaultReviewPlanner;
    this.immersionEngine = defaultImmersionEngine;
  }

  /**
   * Plans and constructs a complete Pedagogical Lesson Plan.
   */
  public planLesson(config: LessonPlannerConfig): FullPedagogicalLessonPlan {
    const { studentModel, weaknessAnalysis, framework = 'CEFR', frameworkLevelCode, sessionDurationMinutes } = config;

    const targetLang = studentModel.targetLanguage || 'es';
    const nativeLang = studentModel.nativeLanguage || 'en';
    const duration = sessionDurationMinutes || studentModel.preferredSessionLengthMinutes || 15;
    const levelCode = frameworkLevelCode || studentModel.currentCefr || 'B1';

    // 1. Resolve Curriculum Scope & Level
    const curriculumScope = this.curriculumEngine.resolveScope(
      targetLang,
      nativeLang,
      framework,
      levelCode,
      studentModel.currentFocusArea
    );

    // 2. Determine Dynamic Difficulty Action
    const diffParams = this.difficultyEngine.calculateDifficulty(studentModel, weaknessAnalysis);

    // 3. Determine Dynamic Skill Balance & Minutes Allocation
    const skillBalance = this.lessonBalanceEngine.calculateBalance(
      studentModel,
      weaknessAnalysis,
      duration
    );

    // 4. Decide WHAT and WHY
    let focusType: PedagogicalDecision['focusType'] = 'balanced';
    let whatToTeach = curriculumScope.scope.focusArea;
    let rationale = `Selected based on level ${curriculumScope.mapping.title} progress and balance across skills.`;

    if (weaknessAnalysis.overallWeaknessScore > 60 && weaknessAnalysis.verbTenseStruggles.length > 0) {
      focusType = 'grammar';
      whatToTeach = `Targeted Grammar Focus: ${weaknessAnalysis.verbTenseStruggles[0]}`;
      rationale = `High weakness density (${weaknessAnalysis.overallWeaknessScore}%) detected in ${weaknessAnalysis.verbTenseStruggles[0]}. Prioritizing grammar clarity before new topics.`;
    } else if (studentModel.vocabularyMasteryPercent < 60 && weaknessAnalysis.difficultVocabulary.length > 0) {
      focusType = 'vocabulary';
      whatToTeach = `Active Vocabulary Escalation (${weaknessAnalysis.difficultVocabulary.length} words)`;
      rationale = `Vocabulary mastery is at ${studentModel.vocabularyMasteryPercent}%. Escalating passive words into active speech.`;
    }

    const decision: PedagogicalDecision = {
      whatToTeach,
      pedagogicalRationale: `${rationale} Difficulty Action: ${diffParams.action.toUpperCase()} (${diffParams.rationale})`,
      targetSkills: ['speaking', 'grammar', 'vocabulary', 'listening'],
      recommendedDurationMinutes: duration,
      difficultyAction: diffParams.action,
      focusType,
      frameworkLevel: curriculumScope.mapping,
      skillBalance,
      reviewItemsCount: weaknessAnalysis.difficultVocabulary.length + weaknessAnalysis.verbTenseStruggles.length,
    };

    // 5. Build Module Sequence in Pedagogical Order:
    // Order: [Review -> Vocabulary -> Grammar -> Conversation/Speaking -> Listening -> Writing]
    const modules: PedagogicalModulePlan[] = [];

    // Module 1: Spaced Repetition Review (if decay present)
    if (weaknessAnalysis.difficultVocabulary.length > 0 || weaknessAnalysis.verbTenseStruggles.length > 0) {
      modules.push(
        this.reviewPlanner.createReviewModule({
          studentModel,
          weakness: weaknessAnalysis,
          targetLanguage: targetLang,
          nativeLanguage: nativeLang,
          durationMinutes: skillBalance.timeAllocationMinutes.review,
        })
      );
    }

    // Module 2: Vocabulary
    modules.push(
      this.vocabularyEngine.createVocabularyModule({
        targetWords: weaknessAnalysis.difficultVocabulary.map((v) => v.word).slice(0, 4),
        targetLanguage: targetLang,
        nativeLanguage: nativeLang,
        durationMinutes: skillBalance.timeAllocationMinutes.vocabulary,
      })
    );

    // Module 3: Grammar
    modules.push(
      this.grammarEngine.createGrammarModule({
        grammarTopic: weaknessAnalysis.verbTenseStruggles[0] || 'Conversational Tenses',
        targetLanguage: targetLang,
        nativeLanguage: nativeLang,
        durationMinutes: skillBalance.timeAllocationMinutes.grammar,
      })
    );

    // Module 4: Speaking / Unscripted Roleplay
    modules.push(
      this.speakingEngine.createSpeakingModule({
        scenarioTitle: `${studentModel.profession || 'General'} Workplace & Daily Life Dialogue`,
        targetLanguage: targetLang,
        nativeLanguage: nativeLang,
        durationMinutes: skillBalance.timeAllocationMinutes.conversation,
      })
    );

    // Module 5: Listening Discrimination
    modules.push(
      this.listeningEngine.createListeningModule({
        dialogueContext: 'Authentic Native Speed Scene',
        targetLanguage: targetLang,
        nativeLanguage: nativeLang,
        durationMinutes: skillBalance.timeAllocationMinutes.listening,
      })
    );

    // Module 6: Pronunciation / Accent Drill
    modules.push(
      this.pronunciationEngine.createPronunciationModule({
        focusPhonemesOrWords: weaknessAnalysis.difficultVocabulary.map((v) => v.word).slice(0, 2),
        targetLanguage: targetLang,
        nativeLanguage: nativeLang,
        durationMinutes: skillBalance.timeAllocationMinutes.pronunciation,
      })
    );

    // Module 7: Guided Writing / Composition
    modules.push(
      this.writingEngine.createWritingModule({
        compositionTopic: `Workplace email or message using new vocabulary`,
        targetLanguage: targetLang,
        nativeLanguage: nativeLang,
        durationMinutes: skillBalance.timeAllocationMinutes.writing,
      })
    );

    // Calculate Immersion Ratio
    const immersionRatio = this.immersionEngine.calculateRatio(curriculumScope.cefrEquivalent);

    const totalDurationMinutes = modules.reduce((sum, m) => sum + m.durationMinutes, 0);

    return {
      planId: `ped-plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId: studentModel.userId,
      targetLanguage: targetLang,
      nativeLanguage: nativeLang,
      proficiencyFramework: framework,
      frameworkLevel: curriculumScope.mapping,
      decision,
      modules,
      totalDurationMinutes,
      immersionRatio,
      createdTimestamp: new Date().toISOString(),
    };
  }
}

export const defaultLessonPlanner = new LessonPlanner();
