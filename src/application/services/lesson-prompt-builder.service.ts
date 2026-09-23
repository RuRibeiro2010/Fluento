import { UserProfile } from '@/types/profile';
import { LongitudinalMemory } from '@/types/coach';
import { BuiltPromptResult } from './coach-prompt-builder.service';

export class LessonPromptBuilderService {
  /**
   * Builds the prompt for generating a personalized lesson.
   */
  public buildLessonPrompt(
    targetLanguage: string,
    nativeLanguage: string,
    topic: string,
    difficulty: string,
    profile?: Partial<UserProfile>,
    memory?: LongitudinalMemory
  ): BuiltPromptResult {
    const personality = profile?.coach_personality || 'encouraging';
    const name = profile?.email?.split('@')[0] || 'aluno';
    
    const systemInstruction = `Tu és o Engenheiro Pedagógico do Fluento AI, com uma personalidade ${personality}.
O teu objetivo é criar uma lição de línguas completa, estruturada e altamente eficaz sobre o tópico: "${topic}".
O aluno fala ${nativeLanguage} e quer aprender ${targetLanguage}.
O nível de dificuldade alvo é ${difficulty} (CEFR).

Responde SEMPRE em formato JSON estrito. TODOS os campos abaixo são OBRIGATÓRIOS.
Estrutura JSON:
{
  "title": "string",
  "description": "string",
  "estimatedMinutes": number,
  "content": {
    "vocabulary": [
      { "word": "string", "translation": "string", "phonetic": "string", "example": "string", "exampleTranslation": "string" }
    ],
    "grammarNotes": ["string"],
    "dialogue": [
      { "speaker": "string", "text": "string", "translation": "string" }
    ],
    "exercises": [
      { 
        "id": "string", 
        "type": "multiple_choice | fill_in | translation | speaking", 
        "prompt": "string", 
        "options": [{ "id": "string", "text": "string" }],
        "correctAnswer": "string",
        "explanation": "string"
      }
    ],
    "explainBetter": {
      "concept": "string",
      "simpleExplanation": "string",
      "analogy": "string",
      "nativeLanguageBridge": "string"
    }
  },
  "smartIntroduction": {
    "whyThisLessonExists": "string",
    "whyItIsImportant": "string",
    "howItHelpsGoal": "string"
  },
  "smartEnding": {
    "whatImproved": "string",
    "whatNeedsWork": "string",
    "previewTomorrow": "string"
  },
  "pedagogicalDecision": {
    "studentNeeds": "string",
    "rationale": "string",
    "methodology": "string",
    "estimatedMinutes": number,
    "expectedFriction": "string",
    "motivationalHook": "string"
  },
  "intelligentHomework": {
    "title": "string",
    "type": "video | podcast | news | speech | writing",
    "description": "string",
    "estimatedMinutes": number,
    "goalTag": "string",
    "actionInstruction": "string"
  }
}
Garante que as traduções e exemplos estão sempre presentes.
`;

    const prompt = `Gera uma lição completa sobre "${topic}" para o aluno ${name}.
A lição deve ser em ${targetLanguage}, mas as explicações, traduções e pontes linguísticas devem ser em ${nativeLanguage}.
Dificuldade: ${difficulty}.
Personalidade do Coach: ${personality}.
Histórico do Aluno: ${memory ? 'O aluno tem progresso registado.' : 'Primeira lição.'}

Garante que os exercícios são variados e que o vocabulário é prático para o nível ${difficulty}.
IMPORTANTE: Não omitas nenhum campo da estrutura JSON. Todos são necessários para a aplicação.`;

    return { systemInstruction, prompt };
  }
}

export const lessonPromptBuilder = new LessonPromptBuilderService();
