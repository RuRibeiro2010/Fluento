import { Lesson, PedagogicalDecision, SmartLessonIntroduction, SmartLessonEnding, IntelligentHomework } from '@/types/lesson';
import { UserProfile } from '@/types/profile';
import { LongitudinalMemory } from '@/types/coach';

/**
 * Internal AI Pedagogical Decision Engine
 * Before generating any lesson, the AI Coach evaluates:
 * 1. What does the student need?
 * 2. Why do they need it?
 * 3. Best teaching methodology?
 * 4. Duration & pace?
 * 5. Expected friction/difficulties?
 * 6. Motivational hook?
 */
export function computePedagogicalDecision(
  topic: string,
  difficulty: string,
  profile?: Partial<UserProfile>,
  memory?: LongitudinalMemory
): PedagogicalDecision {
  const goal = profile?.motivation || profile?.current_focus || 'Conversação e Fluência Profissional';
  const pastError = memory?.weakGrammar?.[0]?.concept || memory?.pastErrorsMemory?.[0] || 'uso de conectores e verbos no passado';
  const profession = profile?.profession || 'Profissional';

  return {
    studentNeeds: `Reforçar o vocabulário e a estrutura sintática de "${topic}", corrigindo a hesitação em ${pastError}.`,
    rationale: `O utilizador indicou foco em ${goal}. Para atingir este objetivo sem fraturas na comunicação, precisa de automatizar estruturas de nível ${difficulty}.`,
    methodology: 'Método Indutivo & Imersão Ativa: introdução contextualizada, exercícios práticos e simulação de diálogo do mundo real.',
    estimatedMinutes: profile?.minutes_per_day || 15,
    expectedFriction: `O aluno pode hesitar na escolha dos verbos auxiliares e na pronúncia de termos técnicos.`,
    motivationalHook: `Esta competência é essencial para ${profession} em ambientes internacionais e desbloqueia maior autonomia de comunicação.`,
  };
}

/**
 * Service: AI Lesson Generator
 * Generates human-teacher guided interactive language lessons with AI Pedagogical Decisions,
 * Smart Introductions, Smart Endings, Real-World Homework, and Explain Better content.
 */
export async function generateLesson(
  targetLanguage: string = 'es',
  nativeLanguage: string = 'pt',
  topic: string = 'Apresentação Executiva & Negociação de Ideias',
  difficulty: string = 'B1',
  profile?: Partial<UserProfile>,
  memory?: LongitudinalMemory
): Promise<Lesson> {
  const pedagogicalDecision = computePedagogicalDecision(topic, difficulty, profile, memory);

  const smartIntro: SmartLessonIntroduction = {
    whyThisLessonExists: `Com base nas tuas sessões anteriores, identificámos a necessidade de consolidar "${topic}" para eliminar pequenas hesitações.`,
    whyItIsImportant: `Esta lição foca em expressões que os nativos usam no dia a dia para soar mais fluídos e profissionais.`,
    howItHelpsGoal: `Aproxima-te diretamente do teu objetivo de ${profile?.motivation || 'comunicar com total confiança sem pensar nas regras'}.`,
  };

  const smartEnding: SmartLessonEnding = {
    whatImproved: 'Excelente evolução na precisão dos conectores de opinião e vocabulário ativo.',
    whatNeedsWork: 'Manter a atenção no ritmo e entoação em frases interrogativas longas.',
    previewTomorrow: 'Amanhã avançaremos para simulação prática de resolução de problemas e tomada de decisões em grupo.',
  };

  const homework: IntelligentHomework = {
    title: `Tarefa Prática: Ouvir & Replicar (${topic})`,
    type: 'podcast',
    description: 'Ouve um excerto de 3 minutos de um podcast na língua alvo e grava uma nota de voz de 1 minuto a resumir o ponto principal.',
    estimatedMinutes: 5,
    goalTag: 'Treino de Fluência & Retenção',
    actionInstruction: 'Abre a tua aplicação de podcasts ou gravador e practica a síntese sem olhar para apontamentos.',
  };

  return {
    id: `lesson-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    title: topic,
    description: `Aprenda e domine ${topic} em ${targetLanguage.toUpperCase()} com orientação do teu AI Coach.`,
    targetLanguage,
    nativeLanguage,
    difficulty,
    type: 'conversation',
    estimatedMinutes: pedagogicalDecision.estimatedMinutes,
    completed: false,
    pedagogicalDecision,
    smartIntroduction: smartIntro,
    smartEnding,
    intelligentHomework: homework,
    content: {
      vocabulary: [
        {
          word: targetLanguage === 'es' ? 'Desde mi punto de vista...' : 'From my perspective...',
          translation: 'Do meu ponto de vista...',
          example: targetLanguage === 'es' ? 'Desde mi punto de vista, la propuesta es sólida.' : 'From my perspective, the proposal is solid.',
        },
        {
          word: targetLanguage === 'es' ? 'Quisiera proponer una alternativa' : 'I would like to propose an alternative',
          translation: 'Gostaria de propor uma alternativa',
          example: targetLanguage === 'es' ? 'Quisiera proponer una alternativa para optimizar el tiempo.' : 'I would like to propose an alternative to save time.',
        },
        {
          word: targetLanguage === 'es' ? 'En cuanto a los plazos...' : 'Regarding the timelines...',
          translation: 'Relativamente aos prazos...',
          example: targetLanguage === 'es' ? 'En cuanto a los plazos, estamos totalmente coordinados.' : 'Regarding the timelines, we are fully aligned.',
        },
      ],
      grammarNotes: [
        'Uso de conectores de opinião para transições suaves no discurso.',
        'Manter o verbo no tom condicional cortês para negociações diplomáticas.',
      ],
      dialogue: [
        {
          speaker: 'Coach',
          text: targetLanguage === 'es' ? '¡Hola! ¿Cómo enfocarías la presentación del proyecto hoy?' : 'Hello! How would you approach today\'s project presentation?',
          translation: 'Olá! Como abordarias a apresentação do projeto hoje?',
        },
        {
          speaker: 'Student',
          text: targetLanguage === 'es' ? 'Desde mi punto de vista, debemos resaltar los resultados principales primero.' : 'From my perspective, we should highlight key results first.',
          translation: 'Do meu ponto de vista, devemos destacar os resultados principais primeiro.',
        },
      ],
      exercises: [
        {
          id: 'ex-1',
          type: 'multiple_choice',
          prompt: targetLanguage === 'es' ? '¿Cuál es la forma diplomática de sugerir un cambio?' : 'What is the polite way to suggest a change?',
          options: [
            { id: 'opt-1', text: targetLanguage === 'es' ? 'Quisiera proponer una alternativa' : 'I would like to propose an alternative' },
            { id: 'opt-2', text: targetLanguage === 'es' ? 'Tienes que cambiar esto' : 'You must change this' },
            { id: 'opt-3', text: targetLanguage === 'es' ? 'No me gusta nada' : 'I do not like this' },
          ],
          correctAnswer: targetLanguage === 'es' ? 'Quisiera proponer una alternativa' : 'I would like to propose an alternative',
          explanation: 'Usar o tom condicional cortês demonstra maturidade e elegância comunicativa.',
        },
      ],
      explainBetter: {
        concept: 'Estruturas Condicionais de Cortesia',
        simpleExplanation: 'São frases que tornam a tua comunicação elegante e profissional em reuniões ou viagens, evitando soar imperativo.',
        analogy: 'É como pedir um café dizendo "Gostaria de um café, por favor" em vez de "Dá-me um café".',
        nativeLanguageBridge: 'Em português equivale ao uso de "Gostaria de..." ou "Poderíamos ver...". Na língua alvo funciona exatamente da mesma forma.',
      },
    },
    createdAt: new Date().toISOString(),
  };
}
