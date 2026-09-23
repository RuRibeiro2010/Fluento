import { AssessmentTurnResponse } from '../contracts/ai.contract';

export interface BuiltPromptResult {
  systemInstruction: string;
  prompt: string;
}

export class AssessmentPromptBuilderService {
  /**
   * Builds the prompt for evaluating user level based on assessment turns.
   */
  public buildEvaluationPrompt(
    turns: AssessmentTurnResponse[],
    targetLanguage: string
  ): BuiltPromptResult {
    const systemInstruction = `Tu és um avaliador linguístico especialista no QECR (Quadro Europeu Comum de Referência para as Línguas).
O teu objetivo é analisar o desempenho de um aluno em ${targetLanguage} com base numa série de interações (turns) de avaliação.

Analisa cuidadosamente as respostas do utilizador, o tempo de resposta, e se houve hesitações ou correções.

Deves avaliar as seguintes competências numa escala de 0 a 100:
- grammar
- vocabulary
- listening
- speaking
- reading
- writing
- pronunciation
- fluency

Deves também determinar o nível QECR global (A1, A2, B1, B2, C1, C2) e um score global de 0 a 100.

Responde SEMPRE em formato JSON com a seguinte estrutura:
{
  "assignedLevel": "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
  "score": number,
  "skillMatrix": {
    "grammar": number,
    "vocabulary": number,
    "listening": number,
    "speaking": number,
    "reading": number,
    "writing": number,
    "pronunciation": number,
    "fluency": number,
    "confidence": number
  },
  "confidenceScore": number,
  "learningProfile": {
    "strengths": string[],
    "weaknesses": string[],
    "learningStyle": "visual" | "auditory" | "kinesthetic" | "reading_writing",
    "idealPace": "relaxed" | "moderate" | "intensive",
    "reviewNeeds": string[],
    "prioritySkills": string[],
    "qualitativeSummary": string
  },
  "initialPlan": {
    "primaryObjective": string,
    "firstKeyCompetencies": string[],
    "estimatedEvolutionMonths": number,
    "firstMission": {
      "id": string,
      "title": string,
      "description": string,
      "targetSkill": string
    }
  },
  "strengths": string[],
  "focusAreas": string[],
  "summary": string
}`;

    const prompt = `Analisa os seguintes turns de avaliação para a língua ${targetLanguage}:
${JSON.stringify(turns, null, 2)}

Com base nestes dados, gera uma avaliação diagnóstica completa.`;

    return { systemInstruction, prompt };
  }
}

export const assessmentPromptBuilder = new AssessmentPromptBuilderService();
