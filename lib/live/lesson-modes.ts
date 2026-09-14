/**
 * Lesson Modes Module (Live Experience Engine)
 * Defines and configures distinct pedagogical live lesson modes:
 * Free Conversation, Real Situations, Roleplay, Interactive Story, Listening,
 * Writing, Grammar Lab, Vocabulary Builder, Pronunciation Coach.
 */

export type LessonMode =
  | 'free_conversation'
  | 'real_situations'
  | 'roleplay'
  | 'interactive_story'
  | 'listening'
  | 'writing'
  | 'grammar_lab'
  | 'vocabulary_builder'
  | 'pronunciation_coach';

export interface LessonModeDefinition {
  id: LessonMode;
  name: string;
  description: string;
  primaryFocus: string;
  correctionStrictness: 'low' | 'balanced' | 'high';
  suggestedSubtitleMode: 'off' | 'target_only' | 'difficult_words_only' | 'full';
  promptInstructions: string;
}

export const LESSON_MODE_REGISTRY: Record<LessonMode, LessonModeDefinition> = {
  free_conversation: {
    id: 'free_conversation',
    name: 'Conversação Livre',
    description: 'Diálogo fluido sobre tópicos do interesse do aluno com correções mínimas no momento certo.',
    primaryFocus: 'Fluência contínua e confiança relacional',
    correctionStrictness: 'low',
    suggestedSubtitleMode: 'target_only',
    promptInstructions: 'Mantém um diálogo natural e descontraído. Interrompe o menos possível e prioriza a troca de ideias.',
  },
  real_situations: {
    id: 'real_situations',
    name: 'Situações Reais',
    description: 'Simulações de cenários práticos do dia a dia (viagens, compras, trabalho, emergências).',
    primaryFocus: 'Autonomia utilitária no mundo real',
    correctionStrictness: 'balanced',
    suggestedSubtitleMode: 'target_only',
    promptInstructions: 'Age de acordo com o papel na situação real. Ajuda o aluno a cumprir o objetivo prático com cortesia.',
  },
  roleplay: {
    id: 'roleplay',
    name: 'Roleplay Imersivo',
    description: 'Interação com personagens virtuais com personalidades e objetivos próprios.',
    primaryFocus: 'Expressividade emocional e adaptabilidade sociocultural',
    correctionStrictness: 'low',
    suggestedSubtitleMode: 'target_only',
    promptInstructions: 'Encarna a personagem com vivacidade. Reage de forma realista às frases e tom do aluno.',
  },
  interactive_story: {
    id: 'interactive_story',
    name: 'História Interativa',
    description: 'Aventura narrativa contínua onde as decisões do aluno moldam o enredo.',
    primaryFocus: 'Engajamento narrativo e compreensão contextual profunda',
    correctionStrictness: 'low',
    suggestedSubtitleMode: 'difficult_words_only',
    promptInstructions: 'Narra episódios vivos e coloca dilemas práticos ao aluno para ele responder em voz alta.',
  },
  listening: {
    id: 'listening',
    name: 'Treino de Escuta (Listening)',
    description: 'Sessão focada na discriminação auditiva, compreensão de sotaques e velocidade nativa.',
    primaryFocus: 'Decodificação fonética e compreensão auditiva',
    correctionStrictness: 'balanced',
    suggestedSubtitleMode: 'off',
    promptInstructions: 'Fala com articulação natural e faz perguntas de verificação de compreensão sobre o áudio.',
  },
  writing: {
    id: 'writing',
    name: 'Laboratório de Escrita',
    description: 'Prática de composição de e-mails, mensagens e ensaios com feedback imediato de elegância.',
    primaryFocus: 'Estruturação textual, pontuação e precisão formal',
    correctionStrictness: 'high',
    suggestedSubtitleMode: 'full',
    promptInstructions: 'Analisa o texto escrito e sugere refinamentos na coesão, tom e vocabulário formal.',
  },
  grammar_lab: {
    id: 'grammar_lab',
    name: 'Grammar Lab',
    description: 'Prática direcionada de estruturas gramaticais com descoberta guiada Socrática.',
    primaryFocus: 'Consolidação de regras e exceções gramaticais',
    correctionStrictness: 'high',
    suggestedSubtitleMode: 'full',
    promptInstructions: 'Foca na aplicação correta da estrutura-alvo através de perguntas orientadoras.',
  },
  vocabulary_builder: {
    id: 'vocabulary_builder',
    name: 'Vocabulary Builder',
    description: 'Expansão de léxico ativo com sinónimos, antónimos, e collocations no contexto correto.',
    primaryFocus: 'Ampliação do vocabulário ativo em uso',
    correctionStrictness: 'balanced',
    suggestedSubtitleMode: 'difficult_words_only',
    promptInstructions: 'Insere novas palavras no diálogo e encoraja o aluno a reutilizá-las de imediato.',
  },
  pronunciation_coach: {
    id: 'pronunciation_coach',
    name: 'Coach de Pronúncia',
    description: 'Treino de articulação, entoação, ritmo e ligação fonética de palavras.',
    primaryFocus: 'Clareza fonética e ritmo natural',
    correctionStrictness: 'high',
    suggestedSubtitleMode: 'target_only',
    promptInstructions: 'Oferece dicas visuais/auditivas de articulação para sons desafiantes.',
  },
};

export function getLessonModeDefinition(mode: LessonMode): LessonModeDefinition {
  return LESSON_MODE_REGISTRY[mode] || LESSON_MODE_REGISTRY.real_situations;
}
