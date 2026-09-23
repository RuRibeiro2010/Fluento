import { IAssessmentAiService } from '../contracts/ai.contract';
import { AssessmentTurnResponse, AssessmentResult } from '../../domain/assessment/types';
import { AIRuntime } from '@/src/lib/ai-runtime/ai-runtime';
import { assessmentPromptBuilder } from './assessment-prompt-builder.service';
import { assessmentRulesService } from '../../domain/assessment/services/assessment-rules.service';

/**
 * RUNTIME ASSESSMENT AI ADAPTER
 * 
 * Migrates Assessment evaluation to the modern AI Runtime.
 * Deterministic rules (adaptive difficulty) are handled by the Domain Service.
 */
export class RuntimeAssessmentAiAdapter implements IAssessmentAiService {
  constructor(
    private readonly aiRuntime: AIRuntime
  ) {}

  /**
   * MIGRATED: Uses AI Runtime for multimodal level evaluation.
   */
  public async evaluateUserLevelMultimodal(turns: AssessmentTurnResponse[], targetLanguage: string): Promise<AssessmentResult> {
    const { systemInstruction, prompt } = assessmentPromptBuilder.buildEvaluationPrompt(turns, targetLanguage);

    try {
      const response = await this.aiRuntime.execute({
        systemInstruction,
        prompt,
        temperature: 0.3,
        providerPreference: ['gemini', 'openai'],
      });

      const jsonContent = this.extractJson(response.content);

      try {
        const parsed = JSON.parse(jsonContent);
        // Validate basic required fields from AssessmentResult
        if (!parsed.assignedLevel || !parsed.skillMatrix) {
          throw new Error('AI response missing required AssessmentResult fields');
        }
        return parsed as AssessmentResult;
      } catch (parseError) {
        console.error('Failed to parse AI Assessment JSON response. Content:', response.content);
        throw new Error('AI Assessment returned invalid JSON format');
      }
    } catch (err) {
      // Errors are propagated to the Use Case which has established UI fallback behavior
      throw err;
    }
  }

  /**
   * DETERMINISTIC: Uses Domain Service for adaptive difficulty calculation.
   */
  public calculateNextAdaptiveDifficulty(currentDifficulty: number, lastTurn: AssessmentTurnResponse): number {
    return assessmentRulesService.calculateNextAdaptiveDifficulty(currentDifficulty, lastTurn);
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
