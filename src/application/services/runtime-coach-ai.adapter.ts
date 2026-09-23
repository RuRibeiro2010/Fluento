import { ICoachAiService } from '../contracts/ai.contract';
import { AIRuntime } from '@/src/lib/ai-runtime/ai-runtime';
import { UserProfile } from '@/types/profile';
import { LongitudinalMemory, DailyCoachMessage, SundayWeeklyReview, MonthlyEvolutionData } from '@/types/coach';
import { StudyPlan } from '@/types/study-plan';
import { coachPromptBuilder } from './coach-prompt-builder.service';
import { longitudinalMemoryService } from '../../domain/memory/services/longitudinal-memory.service';
import { coachDashboardService } from './coach-dashboard.service';

/**
 * RUNTIME COACH AI ADAPTER
 * 
 * Migrates Coach capabilities to the modern AI Runtime.
 * Delegates non-migrated capabilities to a legacy fallback.
 * 
 * Implementation follows the Ports and Adapters pattern.
 */
export class RuntimeCoachAiAdapter implements ICoachAiService {
  constructor(
    private readonly aiRuntime: AIRuntime
  ) {}

  public createInitialLongitudinalMemory(userId: string, targetLanguage: string, profile?: Partial<UserProfile>): LongitudinalMemory {
    // Memory initialization is a deterministic domain task, using Domain Service directly
    return longitudinalMemoryService.createInitial(userId, targetLanguage, profile);
  }

  /**
   * MIGRATED: Uses AI Runtime to generate a truly dynamic coach message.
   */
  public async generateDailyCoachMessage(profile: Partial<UserProfile>, memory?: LongitudinalMemory): Promise<DailyCoachMessage> {
    const { systemInstruction, prompt } = coachPromptBuilder.buildDailyMessagePrompt(profile, memory);

    try {
      const response = await this.aiRuntime.execute({
        systemInstruction,
        prompt,
        temperature: 0.7,
        providerPreference: ['gemini', 'openai'],
        sessionId: memory?.userId,
        studentId: memory?.userId,
      });

      // Extract and parse JSON from AI response
      const jsonContent = this.extractJson(response.content);
      
      try {
        const parsed = JSON.parse(jsonContent);
        // Basic validation of required fields
        if (!parsed.greeting || !parsed.advice) {
          throw new Error('AI response missing required Coach message fields');
        }
        return parsed as DailyCoachMessage;
      } catch (parseError) {
        console.error('Failed to parse AI Coach JSON response. Content:', response.content);
        throw new Error('AI Coach returned invalid JSON format');
      }
    } catch (err) {
      // Errors are propagated to the Use Case which has established UI fallback behavior
      throw err;
    }
  }

  public async generateSundayWeeklyReview(profile: Partial<UserProfile>, memory?: LongitudinalMemory): Promise<SundayWeeklyReview> {
    const { systemInstruction, prompt } = coachPromptBuilder.buildWeeklyReviewPrompt(profile, memory);

    try {
      const response = await this.aiRuntime.execute({
        systemInstruction,
        prompt,
        temperature: 0.7,
        providerPreference: ['gemini', 'openai'],
        sessionId: memory?.userId,
        studentId: memory?.userId,
      });

      // Extract and parse JSON from AI response
      const jsonContent = this.extractJson(response.content);
      
      try {
        const parsed = JSON.parse(jsonContent);
        // Basic validation
        if (!parsed.achievements || !parsed.coachPersonalNote) {
          throw new Error('AI response missing required Weekly Review fields');
        }
        return parsed as SundayWeeklyReview;
      } catch (parseError) {
        console.error('Failed to parse AI Coach Weekly Review JSON response. Content:', response.content);
        throw new Error('AI Coach returned invalid JSON format for Weekly Review');
      }
    } catch (err) {
      // Errors are propagated to the Use Case
      throw err;
    }
  }

  public async generateStudyPlan(profile: Partial<UserProfile>, targetLanguage: string, nativeLanguage: string): Promise<StudyPlan> {
    const { systemInstruction, prompt } = coachPromptBuilder.buildStudyPlanPrompt(profile, targetLanguage, nativeLanguage);

    try {
      const response = await this.aiRuntime.execute({
        systemInstruction,
        prompt,
        temperature: 0.7,
        providerPreference: ['gemini', 'openai'],
        sessionId: profile.id,
        studentId: profile.id,
      });

      const jsonContent = this.extractJson(response.content);
      
      try {
        const parsed = JSON.parse(jsonContent);
        
        // Validation and deterministic field mapping
        if (!parsed.title || !parsed.modules || !Array.isArray(parsed.modules)) {
          throw new Error('AI response missing required Study Plan fields');
        }

        const studyPlan: StudyPlan = {
          id: `plan-${crypto.randomUUID()}`,
          userId: profile.id || 'anonymous',
          targetLanguage,
          nativeLanguage,
          title: parsed.title,
          goal: parsed.goal || 'Domínio linguístico acelerado',
          currentLevel: parsed.currentLevel || profile.last_assessment?.level || 'A1',
          estimatedWeeks: Number(parsed.estimatedWeeks) || 12,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          modules: parsed.modules.map((m: any, idx: number) => ({
            id: `module-${idx + 1}-${crypto.randomUUID().slice(0, 8)}`,
            title: m.title || `Módulo ${idx + 1}`,
            description: m.description || '',
            focus: m.focus || 'Grammar',
            lessonIds: [], // Placeholders for future generation
            completedCount: 0,
            totalLessons: Number(m.totalLessons) || 5
          }))
        };

        return studyPlan;
      } catch (parseError) {
        console.error('Failed to parse AI Coach Study Plan JSON response. Content:', response.content);
        throw new Error('AI Coach returned invalid JSON format for Study Plan');
      }
    } catch (err) {
      throw err;
    }
  }

  public generateMonthlyEvolutionData(profile: Partial<UserProfile>, memory?: LongitudinalMemory): MonthlyEvolutionData {
    // Monthly evolution is a deterministic dashboard task, using Application Service directly
    return coachDashboardService.getMonthlyEvolution(profile, memory);
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
