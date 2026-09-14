/**
 * FLUENTO LESSON COMPOSER - CONVERSATION BUILDER
 * 
 * Builds the Main Conversation block.
 * Focuses on authentic communication, fluency development, meaning-first interaction,
 * and high Student Talk Time (STT).
 */

import { BaseBlockBuilder } from './block-builder';
import { LessonBlock, BlockBuilderContext, BlockType } from './types';

export class ConversationBuilder extends BaseBlockBuilder {
  readonly blockType: BlockType = 'conversation';

  public buildBlock(context: BlockBuilderContext): LessonBlock {
    const { blueprint, allocatedMinutes } = context;
    const { decision } = blueprint;

    const title = `Diálogo Fluído: ${decision.whatToTeach}`;
    const objective = 'Promover a comunicação autêntica centrada no significado, garantindo Student Talk Time superior a 65%.';

    const isHighAnxiety = decision.strategy.id === 'strat_anxiety_deescalation';
    const pattern = isHighAnxiety ? 'guided_q_and_a' : 'free_dialogue';

    const halfMinutes = Math.max(1, Math.floor(allocatedMinutes / 2));

    const activities = [
      this.createActivity(
        'conv_main_flow',
        'roleplay',
        'Interação Principal & Troca de Ideias',
        halfMinutes,
        `Nível de Scaffolding: ${decision.strategy.scaffoldingLevel}. Foco na mensagem.`,
        'Fluência Oral e Autonomia Comunicativa',
        `Conduzir o diálogo sobre '${decision.whatToTeach}' incentivando respostas elaboradas pelo aluno.`
      ),
      this.createActivity(
        'conv_deepening',
        'guided_question',
        'Aprofundamento & Nuance Comunicativa',
        allocatedMinutes - halfMinutes,
        'Usar perguntas de seguimento ("Why?", "How did that feel?") sem interromper o raciocínio.',
        'Expressão de Opinião e Nuance',
        'Desafiar o aluno a expandir a sua perspetiva, apoiando com vocabulário contextual se necessário.'
      )
    ];

    const guidelines = [
      `Manter tempo de fala do aluno acima de ${decision.strategy.targetStudentTalkTimeRatio}%.`,
      'Não interromper a meio da frase para correções gramaticais.',
      `Aplicar o tom de ensino '${decision.strategy.tone}'.`
    ];

    return this.createBlock(
      'block_conversation',
      title,
      allocatedMinutes,
      objective,
      pattern,
      activities,
      guidelines
    );
  }
}

export const conversationBuilder = new ConversationBuilder();
