import { RunAdaptiveAssessmentUseCase } from '../use-cases/assessment.use-cases';
import { AssessmentTurnResponseDTO, AssessmentResultDTO } from '../dto/assessment.dtos';

/**
 * UI ADAPTER FOR ADAPTIVE ASSESSMENT
 * Mediates between Assessment React views and the Application Use Cases.
 */
export class AssessmentAdapter {
  constructor(private readonly assessmentUseCase: RunAdaptiveAssessmentUseCase) {}

  public async evaluateLevel(
    turns: AssessmentTurnResponseDTO[],
    targetLanguage: string = 'es'
  ): Promise<AssessmentResultDTO> {
    return this.assessmentUseCase.execute(turns, targetLanguage);
  }

  public calculateNextDifficulty(
    currentDifficulty: number, 
    lastTurn: AssessmentTurnResponseDTO
  ): number {
    return this.assessmentUseCase.getNextDifficulty(currentDifficulty, lastTurn);
  }
}
