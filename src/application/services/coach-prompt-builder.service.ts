import { UserProfile } from '@/types/profile';
import { LongitudinalMemory } from '@/types/coach';

export interface BuiltPromptResult {
  systemInstruction: string;
  prompt: string;
}

export class CoachPromptBuilderService {
  /**
   * Builds the prompt for generating a daily coach message.
   */
  public buildDailyMessagePrompt(
    profile: Partial<UserProfile>,
    memory?: LongitudinalMemory
  ): BuiltPromptResult {
    const personality = profile.coach_personality || 'encouraging';
    const targetLang = profile.target_languages?.[0] || 'Spanish';
    const nativeLang = profile.native_language || 'Portuguese';
    const name = profile.email?.split('@')[0] || 'aluno';
    const level = profile.last_assessment?.level || 'B1';

    const systemInstruction = `Tu és o Coach de línguas do Fluento AI, com uma personalidade ${personality}.
O teu objetivo é motivar o aluno e fornecer um conselho prático diário para a sua aprendizagem de ${targetLang}.
O aluno fala ${nativeLang} e está no nível ${level}.
Mantém o tom pessoal, encorajador e focado em fluência executiva.
Responde SEMPRE em formato JSON com a seguinte estrutura:
{
  "greeting": "string",
  "advice": "string",
  "focusSkill": "vocabulary" | "grammar" | "listening" | "speaking" | "reading" | "writing",
  "recommendedAction": "string",
  "motivationQuote": "string",
  "tone": "string"
}`;

    const prompt = `Gera a mensagem do dia para o aluno ${name}.
Contexto de Memória: ${memory ? JSON.stringify(memory) : 'Nenhum histórico prévio.'}
A mensagem deve ser em ${nativeLang} (ou bilingue se apropriado para o nível ${level}).`;

    return { systemInstruction, prompt };
  }

  /**
   * Builds the prompt for generating a Sunday weekly review.
   */
  public buildWeeklyReviewPrompt(
    profile: Partial<UserProfile>,
    memory?: LongitudinalMemory
  ): BuiltPromptResult {
    const personality = profile.coach_personality || 'encouraging';
    const targetLang = profile.target_languages?.[0] || 'Spanish';
    const nativeLang = profile.native_language || 'Portuguese';
    const name = profile.email?.split('@')[0] || 'aluno';
    const level = profile.last_assessment?.level || 'B1';

    const systemInstruction = `Tu és o Coach de línguas do Fluento AI, com uma personalidade ${personality}.
O teu objetivo é gerar o resumo semanal de domingo (Sunday Weekly Review) para o aluno ${name}.
O aluno fala ${nativeLang} e está no nível ${level} de ${targetLang}.
O resumo deve ser encorajador, analítico e focado no progresso real.

Responde SEMPRE em formato JSON com a seguinte estrutura:
{
  "id": "string (ex: weekly-review-123)",
  "weekNumber": number,
  "dateRange": "string (ex: 17 a 23 de Julho)",
  "achievements": ["string"],
  "weaknessesIdentified": ["string"],
  "completedGoals": ["string"],
  "nextWeekPlan": ["string"],
  "coachPersonalNote": "string"
}`;

    const prompt = `Gera o resumo semanal para o aluno ${name}.
Contexto de Memória Longitudinal: ${memory ? JSON.stringify(memory) : 'Histórico básico disponível no perfil.'}
O resumo deve ser em ${nativeLang} e refletir a personalidade ${personality} do coach.
Foca-te nos dados de progresso, erros comuns e plano para a próxima semana.`;

    return { systemInstruction, prompt };
  }

  /**
   * Builds the prompt for generating a personalized study plan.
   */
  public buildStudyPlanPrompt(
    profile: Partial<UserProfile>,
    targetLanguage: string,
    nativeLanguage: string
  ): BuiltPromptResult {
    const personality = profile.coach_personality || 'encouraging';
    const name = profile.email?.split('@')[0] || 'aluno';
    const level = profile.last_assessment?.level || 'A1';
    const goals = profile.reasons_to_learn || [];

    const systemInstruction = `Tu és o Arquiteto Pedagógico do Fluento AI, com uma personalidade ${personality}.
O teu objetivo é criar um Plano de Estudo (Study Plan) estruturado e motivador para o aluno ${name}.
O aluno fala ${nativeLanguage} e quer aprender ${targetLanguage}.
O nível atual é ${level}.
Objetivos do aluno: ${goals.join(', ') || 'Domínio geral da língua'}.

Responde SEMPRE em formato JSON com a seguinte estrutura:
{
  "title": "string (ex: Jornada de Domínio de ${targetLanguage})",
  "goal": "string (resumo pedagógico do plano)",
  "currentLevel": "string (A1, A2, B1, B2, C1, ou C2)",
  "estimatedWeeks": number,
  "modules": [
    {
      "title": "string",
      "description": "string",
      "focus": "string (Grammar, Vocabulary, Conversation, ou Culture)",
      "totalLessons": number
    }
  ]
}`;

    const prompt = `Gera um plano de estudo personalizado para ${name} aprender ${targetLanguage}.
O plano deve ser em ${nativeLanguage} e refletir a personalidade ${personality} do coach.
O plano deve ter entre 4 a 8 módulos lógicos.
Foca-te nos objetivos: ${goals.join(', ') || 'fluência prática'}.`;

    return { systemInstruction, prompt };
  }
}

export const coachPromptBuilder = new CoachPromptBuilderService();
