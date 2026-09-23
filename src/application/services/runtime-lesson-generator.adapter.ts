import { z } from 'zod';
import { ILessonGeneratorAiService } from '../contracts/ai.contract';
import { AIRuntime } from '@/src/lib/ai-runtime/ai-runtime';
import { UserProfile } from '@/types/profile';
import { LongitudinalMemory } from '@/types/coach';
import { Lesson } from '@/types/lesson';
import { lessonPromptBuilder } from './lesson-prompt-builder.service';
import { lessonRulesService } from '../../domain/lesson/services/lesson-rules.service';

// Zod schema for Lesson structure validation
const LessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
  content: z.object({
    vocabulary: z.array(z.object({
      word: z.string(),
      translation: z.string(),
      phonetic: z.string().optional(),
      example: z.string().min(1),
      exampleTranslation: z.string().optional()
    })),
    grammarNotes: z.array(z.string()),
    dialogue: z.array(z.object({
      speaker: z.string(),
      text: z.string(),
      translation: z.string().min(1)
    })),
    exercises: z.array(z.object({
      id: z.string(),
      type: z.string(),
      prompt: z.string(),
      options: z.array(z.object({
        id: z.string(),
        text: z.string()
      })).optional(),
      correctAnswer: z.string().min(1),
      explanation: z.string().min(1)
    })),
    explainBetter: z.object({
      concept: z.string(),
      simpleExplanation: z.string(),
      analogy: z.string(),
      nativeLanguageBridge: z.string()
    })
  }),
  smartIntroduction: z.object({
    whyThisLessonExists: z.string(),
    whyItIsImportant: z.string(),
    howItHelpsGoal: z.string()
  }).optional(),
  smartEnding: z.object({
    whatImproved: z.string(),
    whatNeedsWork: z.string(),
    previewTomorrow: z.string()
  }).optional(),
  pedagogicalDecision: z.object({
    studentNeeds: z.string(),
    rationale: z.string(),
    methodology: z.string(),
    estimatedMinutes: z.number(),
    expectedFriction: z.string(),
    motivationalHook: z.string()
  }).optional(),
  intelligentHomework: z.object({
    title: z.string(),
    type: z.enum(['video', 'podcast', 'news', 'speech', 'writing']),
    description: z.string(),
    estimatedMinutes: z.number(),
    goalTag: z.string().optional(),
    actionInstruction: z.string().optional()
  }).optional()
});

/**
 * RUNTIME LESSON GENERATOR AI ADAPTER
 * 
 * Migrates Lesson Generation to the modern AI Runtime.
 * Uses Domain LessonRulesService for deterministic grounding and validation.
 */
export class RuntimeLessonGeneratorAiAdapter implements ILessonGeneratorAiService {
  constructor(
    private readonly aiRuntime: AIRuntime
  ) {}

  public async generateLesson(
    targetLanguage: string,
    nativeLanguage: string,
    topic: string,
    difficulty: string,
    profile?: Partial<UserProfile>,
    memory?: LongitudinalMemory
  ): Promise<Lesson> {
    const { systemInstruction, prompt } = lessonPromptBuilder.buildLessonPrompt(
      targetLanguage,
      nativeLanguage,
      topic,
      difficulty,
      profile,
      memory
    );

    try {
      const response = await this.aiRuntime.execute({
        systemInstruction,
        prompt,
        temperature: 0.7,
        providerPreference: ['gemini', 'openai'],
        sessionId: profile?.id || memory?.userId,
        studentId: profile?.id || memory?.userId,
      });

      const jsonContent = this.extractJson(response.content);
      
      try {
        const parsed = JSON.parse(jsonContent);
        
        // Zod validation
        const validated = LessonSchema.parse(parsed);

        // Deterministic Fallback/Consistency Enrichment from Domain Rules
        const deterministicDecision = lessonRulesService.computePedagogicalDecision(
          topic, 
          difficulty, 
          profile, 
          memory
        );
        const deterministicIntro = lessonRulesService.generateSmartIntroduction(topic, profile);
        const deterministicEnding = lessonRulesService.generateSmartEnding();
        const deterministicHomework = lessonRulesService.generateIntelligentHomework(topic);

        // Merge with deterministic fields
        const lesson: Lesson = {
          ...validated,
          id: `lesson-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
          targetLanguage,
          nativeLanguage,
          difficulty,
          type: 'conversation', // Default type for adaptive lessons
          completed: false,
          createdAt: new Date().toISOString(),
          // Use deterministic results as preferred defaults for pedagogical alignment
          pedagogicalDecision: validated.pedagogicalDecision || deterministicDecision,
          smartIntroduction: validated.smartIntroduction || deterministicIntro,
          smartEnding: validated.smartEnding || deterministicEnding,
          intelligentHomework: validated.intelligentHomework || deterministicHomework,
          // Ensure nested IDs are also application-controlled
          content: validated.content ? {
            ...validated.content,
            exercises: validated.content.exercises?.map((ex, idx) => ({
              ...ex,
              id: ex.id || `ex-${idx + 1}-${crypto.randomUUID().slice(0, 4)}`
            }))
          } : undefined
        };

        return lesson;
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          console.error('Lesson Validation Error:', validationError.issues);
          throw new Error('AI Lesson Generator produced invalid content structure');
        }
        throw validationError;
      }
    } catch (err) {
      // Propagate AI Runtime errors (like AI_NOT_CONFIGURED)
      throw err;
    }
  }

  /**
   * Helper to extract JSON from potentially markdown-wrapped AI output.
   */
  private extractJson(content: string): string {
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/```\n([\s\S]*?)\n```/) ||
                      [null, content];
    return (jsonMatch[1] || content).trim();
  }
}
