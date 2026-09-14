/**
 * Celebration Engine Module (Fluento Human Experience - Phase 19)
 * Celebrates major learning milestones (e.g. 100 words mastered, first conversation,
 * level advancement) with mature, professional, and genuinely encouraging praise.
 */

export interface MilestoneCelebration {
  milestoneType: 'first_conversation' | 'words_100_mastered' | 'cefr_advancement' | 'interview_completed';
  headlineTitle: string;
  celebrationMessage: string;
  isMatureTone: boolean;
}

export function generateMilestoneCelebration(
  type: MilestoneCelebration['milestoneType'],
  studentName: string = 'Aluno'
): MilestoneCelebration {
  switch (type) {
    case 'first_conversation':
      return {
        milestoneType: 'first_conversation',
        headlineTitle: 'Primeira Conversa Ativa Concluída',
        celebrationMessage: `Parabéns, ${studentName}! Derrotaste a hesitação inicial e completaste a tua primeira conversa espontânea.`,
        isMatureTone: true,
      };
    case 'words_100_mastered':
      return {
        milestoneType: 'words_100_mastered',
        headlineTitle: '100 Expressões no Léxico Ativo',
        celebrationMessage: 'Atingiste o marco de 100 palavras e expressões consolidadas na tua memória de longo prazo.',
        isMatureTone: true,
      };
    case 'cefr_advancement':
      return {
        milestoneType: 'cefr_advancement',
        headlineTitle: 'Evolução de Nível CEFR',
        celebrationMessage: 'Demostraste autonomia suficiente para avançar para o próximo patamar de fluência.',
        isMatureTone: true,
      };
    default:
      return {
        milestoneType: 'interview_completed',
        headlineTitle: 'Simulação Profissional Concluída',
        celebrationMessage: 'Excelente desempenho na simulação corporativa com vocabulário de alto nível.',
        isMatureTone: true,
      };
  }
}
