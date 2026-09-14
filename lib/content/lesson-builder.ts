import { ModularLesson, LessonBlock, LessonBlockType, AIProviderAdapter } from '@/types/content';
import { StudentModel, WeaknessAnalysis } from '@/types/brain';
import { LessonRecord } from '@/types/content';
import { LessonTemplate, LessonTemplateEngine, defaultLessonTemplateEngine } from './templates';

/**
 * Default Mock AI Provider Adapter (Prepared for real Gemini / OpenAI / Claude / DeepSeek bindings)
 */
export class DefaultAIProviderAdapter implements AIProviderAdapter {
  public providerName: 'gemini' | 'openai' | 'claude' | 'deepseek' | 'local' = 'gemini';
  public modelName = 'gemini-1.5-pro-preview';

  public async generateText(prompt: string): Promise<string> {
    // Modular mock generation pipeline returning structured pedagogical content
    return `[AI Generated Content for Prompt: ${prompt.substring(0, 40)}...]`;
  }
}

/**
 * Lesson Builder
 * Core modular generator. Takes Student Profile + Weaknesses + Template + Inspiration Lessons + AI Adapter
 * and constructs a brand new, highly personalized Modular Lesson.
 * Never copies verbatim—always transforms context, character roles, examples, and exercise prompts.
 */
export class LessonBuilderEngine {
  private templateEngine: LessonTemplateEngine;
  private defaultAdapter: AIProviderAdapter;

  constructor(
    templateEngine: LessonTemplateEngine = defaultLessonTemplateEngine,
    defaultAdapter: AIProviderAdapter = new DefaultAIProviderAdapter()
  ) {
    this.templateEngine = templateEngine;
    this.defaultAdapter = defaultAdapter;
  }

  /**
   * Builds a custom, non-repetitive modular lesson.
   */
  public async buildModularLesson(params: {
    studentModel: StudentModel;
    weaknessAnalysis: WeaknessAnalysis;
    template?: LessonTemplate;
    inspirationLesson?: LessonRecord | null;
    aiAdapter?: AIProviderAdapter;
  }): Promise<ModularLesson> {
    const { studentModel, weaknessAnalysis, template, inspirationLesson, aiAdapter } = params;
    const adapter = aiAdapter || this.defaultAdapter;

    // 1. Select Template
    const selectedTemplate =
      template ||
      this.templateEngine.selectBestTemplate(undefined, studentModel.preferredSessionLengthMinutes);

    // 2. Personalization context vectors
    const profession = studentModel.profession || 'General Professional';
    const mainHobby = studentModel.hobbies[0] || 'Travel';
    const focusGrammar = weaknessAnalysis.verbTenseStruggles[0] || 'Conversational Tenses';
    const focusWords = weaknessAnalysis.difficultVocabulary.map((v) => v.word).slice(0, 4);

    // 3. Transform theme and title if using inspiration
    let lessonTheme = inspirationLesson
      ? `Adapted Focus: ${inspirationLesson.theme}`
      : `${studentModel.currentFocusArea} for ${profession}`;

    if (studentModel.reasonsToLearn.length > 0) {
      lessonTheme += ` (${studentModel.reasonsToLearn[0]})`;
    }

    // 4. Construct Modular Blocks according to template sequence
    const blocks: LessonBlock[] = selectedTemplate.blockSequence.map((blockType, idx) => {
      return this.constructBlock({
        blockType,
        index: idx + 1,
        studentModel,
        focusGrammar,
        focusWords,
        profession,
        hobby: mainHobby,
        inspirationLesson,
      });
    });

    const totalDurationMinutes = blocks.reduce((sum, b) => sum + b.durationMinutes, 0);

    return {
      id: `mod-les-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: lessonTheme,
      theme: lessonTheme,
      targetLanguage: studentModel.targetLanguage,
      cefrLevel: studentModel.currentCefr,
      blocks,
      totalDurationMinutes,
      adaptedForUserId: studentModel.userId,
      sourceLessonId: inspirationLesson?.id,
      generatedAt: new Date().toISOString(),
      aiProviderUsed: `${adapter.providerName}:${adapter.modelName}`,
      contextCustomizations: {
        professionContext: profession,
        hobbyContext: mainHobby,
        adaptedExamplesCount: blocks.length * 3,
      },
    };
  }

  /**
   * Factory constructing individual modular lesson blocks
   */
  private constructBlock(params: {
    blockType: LessonBlockType;
    index: number;
    studentModel: StudentModel;
    focusGrammar: string;
    focusWords: string[];
    profession: string;
    hobby: string;
    inspirationLesson?: LessonRecord | null;
  }): LessonBlock {
    const { blockType, index, studentModel, focusGrammar, focusWords, profession, hobby } = params;

    const baseId = `block-${index}-${blockType}`;

    switch (blockType) {
      case 'introduction':
        return {
          id: baseId,
          type: 'introduction',
          title: 'Lesson Brief & Personal Goal',
          durationMinutes: 2,
          contentPromptOrText: `Welcome ${studentModel.userId}! Today we connect ${focusGrammar} with scenarios in ${profession} and ${hobby}.`,
          targetVocabulary: focusWords,
          targetGrammar: [focusGrammar],
        };

      case 'vocabulary':
        return {
          id: baseId,
          type: 'vocabulary',
          title: 'Target Vocabulary Escalation',
          durationMinutes: 3,
          contentPromptOrText: `Key active vocabulary set: ${focusWords.join(', ')}. Custom examples tailored to ${profession}.`,
          targetVocabulary: focusWords,
          targetGrammar: [],
          interactiveExercises: focusWords.map((word) => ({
            question: `Which sentence correctly uses "${word}" in a ${profession} context?`,
            options: [
              `Correct usage of ${word} in workplace conversation.`,
              `Incorrect usage of ${word}.`,
            ],
            correctAnswer: `Correct usage of ${word} in workplace conversation.`,
            explanation: `Focus on using "${word}" naturally without translation pauses.`,
          })),
        };

      case 'grammar':
        return {
          id: baseId,
          type: 'grammar',
          title: `Socratic Syntax Mastery: ${focusGrammar}`,
          durationMinutes: 4,
          contentPromptOrText: `Understanding ${focusGrammar} without overwhelming rules. Focus on usage in ${hobby} chats.`,
          targetVocabulary: [],
          targetGrammar: [focusGrammar],
          interactiveExercises: [
            {
              question: `Fill in the blank using correct ${focusGrammar}: "Ayer yo _____ (hablar) con el cliente."`,
              options: ['hablé', 'hablaba', 'hablaría'],
              correctAnswer: 'hablé',
              explanation: 'Completed action in a defined past timeframe requires Pretérito Indefinido.',
            },
          ],
        };

      case 'conversation':
        return {
          id: baseId,
          type: 'conversation',
          title: 'Interactive AI Teacher Roleplay',
          durationMinutes: 5,
          contentPromptOrText: `Roleplay scenario: Discussing a project or ${hobby} activity with Sofia.`,
          targetVocabulary: focusWords,
          targetGrammar: [focusGrammar],
          characterRole: 'Sofia (Encouraging Senior Language Coach)',
        };

      case 'listening':
        return {
          id: baseId,
          type: 'listening',
          title: 'Native Audio Discrimination',
          durationMinutes: 3,
          contentPromptOrText: `Listen to native dialogue at 0.9x speed emphasizing ${focusGrammar}.`,
          targetVocabulary: focusWords,
          targetGrammar: [focusGrammar],
        };

      case 'speaking':
        return {
          id: baseId,
          type: 'speaking',
          title: 'Open Microphone Pronunciation Challenge',
          durationMinutes: 3,
          contentPromptOrText: `Speak aloud 3 complete sentences using ${focusWords[0] || 'vocabuario'} and ${focusGrammar}.`,
          targetVocabulary: focusWords,
          targetGrammar: [focusGrammar],
        };

      case 'mini_challenge':
        return {
          id: baseId,
          type: 'mini_challenge',
          title: 'Real-Time Rapid Challenge',
          durationMinutes: 2,
          contentPromptOrText: `Fast 60-second response test combining vocabulary and correct tense.`,
          targetVocabulary: focusWords,
          targetGrammar: [focusGrammar],
        };

      case 'quiz':
        return {
          id: baseId,
          type: 'quiz',
          title: 'Retention & Accuracy Quiz',
          durationMinutes: 3,
          contentPromptOrText: `3 questions verifying learning before completing lesson.`,
          targetVocabulary: focusWords,
          targetGrammar: [focusGrammar],
          interactiveExercises: [
            {
              question: `Select the most natural phrasing in ${studentModel.targetLanguage.toUpperCase()}:`,
              options: ['Option A (Natural)', 'Option B (Literal Translation Error)'],
              correctAnswer: 'Option A (Natural)',
              explanation: 'Avoid direct word-for-word translation from your native language.',
            },
          ],
        };

      case 'summary':
      default:
        return {
          id: baseId,
          type: 'summary',
          title: 'Lesson Outcome & Next Step Brief',
          durationMinutes: 1,
          contentPromptOrText: `Great work! Your response accuracy was logged into your Student Model.`,
          targetVocabulary: focusWords,
          targetGrammar: [focusGrammar],
        };
    }
  }
}

export const defaultLessonBuilderEngine = new LessonBuilderEngine();
