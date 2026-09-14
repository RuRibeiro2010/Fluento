/**
 * FLUENTO LESSON COMPOSER - CLOSING BUILDER
 * 
 * Builds the Session Closing block.
 * Connects session learnings to real-world application, delivers a warm human farewell,
 * and maintains continuous engagement.
 */

import { BaseBlockBuilder } from './block-builder';
import { LessonBlock, BlockBuilderContext, BlockType } from './types';

export class ClosingBuilder extends BaseBlockBuilder {
  readonly blockType: BlockType = 'closing';

  public buildBlock(context: BlockBuilderContext): LessonBlock {
    const { blueprint, allocatedMinutes } = context;

    const title = 'Ponte para o Mundo Real & Despedida';
    const objective = 'Transferir as aprendizagens da aula para o quotidiano real e encerrar a sessão com serenidade.';

    const activities = [
      this.createActivity(
        'close_real_world_bridge',
        'closing_summary',
        'Ponte de Aplicação Prática',
        allocatedMinutes,
        'Sugerir uma pequena micro-ação para aplicar no dia-a-dia.',
        'Transferência para o Mundo Real',
        'Perguntar ao aluno onde prevê utilizar o que praticou hoje no seu dia-a-dia.'
      )
    ];

    const guidelines = [
      'Encerrar com um tom caloroso e de apoio humano.',
      'Reforçar que o progresso acontece com consistência tranquila, sem pressa.'
    ];

    return this.createBlock(
      'block_closing',
      title,
      allocatedMinutes,
      objective,
      'closing_bridge',
      activities,
      guidelines
    );
  }
}

export const closingBuilder = new ClosingBuilder();
