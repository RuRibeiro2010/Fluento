import { UserProfile } from '@/types/profile';
import { LongitudinalMemory } from '@/types/coach';
import { 
  PedagogicalDecision, 
  SmartLessonIntroduction, 
  SmartLessonEnding, 
  IntelligentHomework 
} from '../types';

/**
 * LESSON RULES SERVICE (Domain)
 * 
 * Contains pure deterministic business and pedagogical rules for lesson generation.
 * Extracted from legacy lib/ai/lesson-generator.ts
 */
export class LessonRulesService {
  /**
   * Computes the pedagogical decision based on student profile and memory.
   */
  public computePedagogicalDecision(
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
   * Generates a deterministic smart introduction.
   */
  public generateSmartIntroduction(
    topic: string,
    profile?: Partial<UserProfile>
  ): SmartLessonIntroduction {
    return {
      whyThisLessonExists: `Com base nas tuas sessões anteriores, identificámos a necessidade de consolidar "${topic}" para eliminar pequenas hesitações.`,
      whyItIsImportant: `Esta lição foca em expressões que os nativos usam no dia a dia para soar mais fluídos e profissionais.`,
      howItHelpsGoal: `Aproxima-te diretamente do teu objetivo de ${profile?.motivation || 'comunicar com total confiança sem pensar nas regras'}.`,
    };
  }

  /**
   * Generates a deterministic smart ending.
   */
  public generateSmartEnding(): SmartLessonEnding {
    return {
      whatImproved: 'Excelente evolução na precisão dos conectores de opinião e vocabulário ativo.',
      whatNeedsWork: 'Manter a atenção no ritmo e entoação em frases interrogativas longas.',
      previewTomorrow: 'Amanhã avançaremos para simulação prática de resolução de problemas e tomada de decisões em grupo.',
    };
  }

  /**
   * Generates a deterministic intelligent homework.
   */
  public generateIntelligentHomework(topic: string): IntelligentHomework {
    return {
      title: `Tarefa Prática: Ouvir & Replicar (${topic})`,
      type: 'podcast',
      description: 'Ouve um excerto de 3 minutos de um podcast na língua alvo e grava uma nota de voz de 1 minuto a resumir o ponto principal.',
      estimatedMinutes: 5,
      goalTag: 'Treino de Fluência & Retenção',
      actionInstruction: 'Abre a tua aplicação de podcasts ou gravador e practica a síntese sem olhar para apontamentos.',
    };
  }
}

export const lessonRulesService = new LessonRulesService();
