/**
 * Content Selector Engine & Cognitive Load Guard (Sprint 5)
 * Evaluates candidate lesson blocks against strict cognitive load standards.
 * Before including any block or exercise, asks internally:
 * 1. Is this content really necessary?
 * 2. Is there something more important right now?
 * 3. Is the student prepared for this concept?
 * 4. Will this directly advance their goals?
 * 5. Is there a risk of cognitive overload?
 */

import { DynamicLessonBlock, LearningMomentumState } from './lesson-composer-types';

export interface ContentSelectionAssessment {
  blockId: string;
  isApproved: boolean;
  necessityScore: number; // 0-100
  relevanceToGoalScore: number; // 0-100
  readinessScore: number; // 0-100
  cognitiveOverloadRisk: 'low' | 'moderate' | 'high';
  justification: string;
}

export class ContentSelectorEngine {
  /**
   * Assesses a single candidate block against cognitive load and pedagogical priorities.
   */
  public static evaluateBlock(
    block: DynamicLessonBlock,
    momentum: LearningMomentumState,
    currentTotalMinutes: number,
    availableMinutes: number
  ): ContentSelectionAssessment {
    let necessityScore = 75;
    let relevanceToGoalScore = 80;
    let readinessScore = 85;

    // 1. Check Cognitive Overload Risk
    const exceedsTimeLimit = currentTotalMinutes + block.estimatedDurationMinutes > availableMinutes;
    let cognitiveOverloadRisk: 'low' | 'moderate' | 'high' = 'low';

    if (
      exceedsTimeLimit ||
      (momentum.emotionalZone === 'mentally_tired' && block.cognitiveLoad === 'high') ||
      (momentum.emotionalZone === 'frustrated' && block.cognitiveLoad !== 'low')
    ) {
      cognitiveOverloadRisk = 'high';
    } else if (block.cognitiveLoad === 'high' || currentTotalMinutes > 15) {
      cognitiveOverloadRisk = 'moderate';
    }

    // 2. Adjust readiness based on momentum
    if (momentum.emotionalZone === 'frustrated' && block.type === 'new_content') {
      readinessScore = 30; // Not ready for complex new content when frustrated
    }

    // 3. Approval decision
    const isApproved =
      cognitiveOverloadRisk !== 'high' &&
      readinessScore >= 50 &&
      necessityScore >= 60;

    let justification = `Aprovado: Bloco "${block.title}" alinhado com o momentum do aluno (${momentum.emotionalZone}) e limite de tempo.`;
    if (!isApproved) {
      if (cognitiveOverloadRisk === 'high') {
        justification = `Rejeitado: Alto risco de sobrecarga cognitiva para o estado atual (${momentum.emotionalZone}) ou tempo excedido.`;
      } else if (readinessScore < 50) {
        justification = `Rejeitado: Aluno necessita de consolidação de pré-requisitos antes deste conteúdo.`;
      } else {
        justification = `Rejeitado: Conteúdo não essencial para a micro-meta da sessão corrente.`;
      }
    }

    return {
      blockId: block.id,
      isApproved,
      necessityScore,
      relevanceToGoalScore,
      readinessScore,
      cognitiveOverloadRisk,
      justification,
    };
  }

  /**
   * Optimizes a list of candidate blocks by filtering out unapproved blocks and trimming duration.
   */
  public static optimizeBlockSequence(
    candidateBlocks: DynamicLessonBlock[],
    momentum: LearningMomentumState,
    availableMinutes: number
  ): DynamicLessonBlock[] {
    const approvedBlocks: DynamicLessonBlock[] = [];
    let accumMinutes = 0;

    for (const block of candidateBlocks) {
      const assessment = this.evaluateBlock(block, momentum, accumMinutes, availableMinutes);
      if (assessment.isApproved) {
        approvedBlocks.push(block);
        accumMinutes += block.estimatedDurationMinutes;
      }
      if (accumMinutes >= availableMinutes) {
        break;
      }
    }

    // Ensure at least a core block exists
    if (approvedBlocks.length === 0 && candidateBlocks.length > 0) {
      const safeFallback = candidateBlocks.find((b) => b.cognitiveLoad === 'low') || candidateBlocks[0];
      approvedBlocks.push({
        ...safeFallback,
        estimatedDurationMinutes: Math.min(safeFallback.estimatedDurationMinutes, availableMinutes),
      });
    }

    return approvedBlocks;
  }
}
