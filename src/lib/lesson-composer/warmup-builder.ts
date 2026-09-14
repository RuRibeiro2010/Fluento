/**
 * FLUENTO LESSON COMPOSER - WARMUP BUILDER
 * 
 * Builds the Warmup / Connection block of a session.
 * Focuses on desensitizing speaking anxiety, greeting the student with warmth,
 * and establishing affective safety before any learning challenges.
 */

import { BaseBlockBuilder } from './block-builder';
import { LessonBlock, BlockBuilderContext, BlockType } from './types';

export class WarmupBuilder extends BaseBlockBuilder {
  readonly blockType: BlockType = 'warmup';

  public buildBlock(context: BlockBuilderContext): LessonBlock {
    const { blueprint, allocatedMinutes } = context;
    const { decision } = blueprint;

    const title = 'Acolhimento Humano & Conexão Afetiva';
    const objective = 'Desativar o filtro afetivo, reduzir a ansiedade de fala e estabelecer conexão interpessoal sem pressão de teste.';
    
    const activityDuration = Math.max(1, Math.floor(allocatedMinutes / 2));

    const activities = [
      this.createActivity(
        'warmup_icebreaker',
        'icebreaker',
        'Saudação Empática & Mood Check',
        activityDuration,
        'Usar tom acolhedor e calmo. Fazer perguntas sobre o bem-estar geral.',
        'Redução da Ansiedade Oral',
        'Saudar o aluno pelo nome. Perguntar como se sente hoje de forma descontraída, sem avaliar a forma gramatical.'
      ),
      this.createActivity(
        'warmup_context',
        'guided_question',
        'Introdução Suave ao Tópico',
        allocatedMinutes - activityDuration,
        'Vincular o estado atual do aluno ao objetivo da sessão de forma natural.',
        'Ativação de Conhecimento Prévio',
        `Apresentar o tema '${decision.whatToTeach}' através de uma pergunta aberta e acessível.`
      )
    ];

    const guidelines = [
      'NUNCA corrigir erros gramaticais ou de pronúncia durante esta fase inicial.',
      'Respeitar pelo menos 4 a 5 segundos de silêncio para dar tempo de raciocínio.',
      'Manter escuta ativa genuína e validação emocional.'
    ];

    return this.createBlock(
      'block_warmup',
      title,
      allocatedMinutes,
      objective,
      'guided_q_and_a',
      activities,
      guidelines
    );
  }
}

export const warmupBuilder = new WarmupBuilder();
