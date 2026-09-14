import {
  StudentMinimalContextDTO,
  LessonSessionContextDTO,
} from '../dto/conversation.dtos';

export interface BuiltPromptResult {
  systemInstruction: string;
  prompt: string;
}

export class ConversationPromptBuilderService {
  /**
   * Builds the initial greeting prompt for opening the lesson room.
   */
  public buildGreetingPrompt(
    student: StudentMinimalContextDTO,
    lesson: LessonSessionContextDTO
  ): BuiltPromptResult {
    const systemInstruction = this.buildSystemInstruction(student, lesson);

    const prompt = `[AÇÃO DE ABERTURA DA AULA]
Inicia a sessão de conversação para a lição "${lesson.topic}".
Cumprimenta cordialmente o aluno ${student.name ? `(${student.name})` : ''} na língua alvo (${lesson.targetLanguage.toUpperCase()}) adaptada ao nível CEFR ${lesson.cefrLevel}.
Apresenta sucintamente o cenário da lição e faz a PRIMEIRA pergunta aberta para o aluno começar a falar.
Mantém a fala curta (máximo 3 frases) e natural.`;

    return { systemInstruction, prompt };
  }

  /**
   * Builds the prompt for a conversational turn responding to student utterance.
   */
  public buildTurnPrompt(
    student: StudentMinimalContextDTO,
    lesson: LessonSessionContextDTO,
    latestStudentUtterance: string
  ): BuiltPromptResult {
    const systemInstruction = this.buildSystemInstruction(student, lesson);

    // Format recent conversation history (last 6 messages max for context brevity)
    const recentTurns = lesson.conversationHistory
      .slice(-6)
      .map((m) => `${m.sender === 'teacher' ? 'PROFESSOR' : 'ALUNO'}: "${m.text}"`)
      .join('\n');

    const prompt = `[HISTÓRICO RECENTE DA CONVERSA]
${recentTurns ? recentTurns : '(Início da sessão)'}
ALUNO: "${latestStudentUtterance}"

[INSTRUÇÃO DO TURNO]
Como ${lesson.teacherPersona}, responde à fala do aluno na língua ${lesson.targetLanguage.toUpperCase()} no nível ${lesson.cefrLevel}:
1. Reconhece positivamente a intervenção do aluno.
2. Se houver pequenos desvios gramaticais ou de vocabulário, aplica recasting sutil de forma elegante e construtiva (sem quebrar a fluidez).
3. Termina SEMPRE com uma pergunta instigante ou continuação do cenário para estimular o tempo de fala do aluno.
4. Extensão máxima: 2 a 3 frases.`;

    return { systemInstruction, prompt };
  }

  private buildSystemInstruction(
    student: StudentMinimalContextDTO,
    lesson: LessonSessionContextDTO
  ): string {
    const strictnessGuideline =
      student.correctionStrictness === 'strict'
        ? 'Aplica correções claras e recasting pedagógico rigoroso em cada turno.'
        : student.correctionStrictness === 'gentle'
        ? 'Prioriza a confiança e o fluxo verbal sobre correções menores. Corrige apenas falhas que impeçam a compreensão.'
        : 'Equilibra correções naturais de vocabulário/gramática com estímulo constante à conversação.';

    return `Tu és ${lesson.teacherPersona}, professor de línguas do Fluento AI.
Língua de Ensino (Alvo): ${lesson.targetLanguage.toUpperCase()}
Língua Materna do Aluno: ${student.nativeLanguage.toUpperCase()}
Nível CEFR Atual do Aluno: ${lesson.cefrLevel}
Tópico da Lição: ${lesson.topic}
Objetivo Pedagógico: ${lesson.learningObjective}
Foco Atual do Aluno: ${student.currentFocus || 'Comunicação e Fluência Executiva'}
Estilo Pedagógico: ${strictnessGuideline}

DIRETRIZES FUNDAMENTAIS:
- Fala SEMPRE na língua alvo (${lesson.targetLanguage.toUpperCase()}) de forma clara, natural e adequada ao nível ${lesson.cefrLevel}.
- Não produzas monólogos longos. Mantém cada intervenção entre 2 e 3 frases concisas para dar espaço ao aluno.
- O aluno deve ter pelo menos 60% do tempo de fala.
- Nunca quebres a personagem. És um mentor executivo compreensivo, inteligente e empático.`;
  }
}

export const conversationPromptBuilder = new ConversationPromptBuilderService();
