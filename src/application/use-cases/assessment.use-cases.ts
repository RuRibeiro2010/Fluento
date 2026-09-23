import { AssessmentTurnResponseDTO, AssessmentResultDTO } from '../dto/assessment.dtos';
import { IAssessmentAiService } from '../contracts/ai.contract';
import { applicationTelemetry } from '../telemetry/telemetry.service';
import { ILogger } from '../contracts/infrastructure.contracts';

export class RunAdaptiveAssessmentUseCase {
  constructor(
    private readonly assessmentAiService: IAssessmentAiService,
    private readonly logger: ILogger
  ) {}

  public async execute(
    turns: AssessmentTurnResponseDTO[],
    targetLanguage: string = 'es'
  ): Promise<AssessmentResultDTO> {
    const span = applicationTelemetry.startSpan('RunAdaptiveAssessmentUseCase', { turnCount: turns.length, targetLanguage });
    try {
      this.logger.info(`Running multimodal assessment for ${targetLanguage} with ${turns.length} turns.`);
      const result = await this.assessmentAiService.evaluateUserLevelMultimodal(turns as any, targetLanguage);
      
      applicationTelemetry.endSpan(span, true);
      
      return {
        assignedLevel: result.assignedLevel,
        score: result.score,
        skillMatrix: result.skillMatrix,
        confidenceScore: result.confidenceScore,
        learningProfile: result.learningProfile,
        initialPlan: result.initialPlan,
        strengths: result.strengths,
        focusAreas: result.focusAreas,
        summary: result.summary,
      };
    } catch (err: any) {
      applicationTelemetry.endSpan(span, false, { error: err.message });
      this.logger.error(`Assessment failed: ${err.message}`);
      throw err;
    }
  }

  public getNextDifficulty(currentDifficulty: number, lastTurn: AssessmentTurnResponseDTO): number {
    return this.assessmentAiService.calculateNextAdaptiveDifficulty(currentDifficulty, lastTurn as any);
  }
}
