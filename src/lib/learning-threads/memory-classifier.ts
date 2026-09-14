/**
 * FLUENTO LEARNING THREADS - MEMORY CLASSIFIER
 * 
 * Classifies raw pedagogical observations into memory categories and determines
 * initial importance scores and retention levels.
 */

import { MemoryClassificationResult, MemoryCategory, MemoryRetentionLevel } from './types';

export class MemoryClassifier {
  /**
   * Classifies a pedagogical observation string or note.
   */
  public classifyNote(
    rawText: string,
    context?: { studentErrorCount?: number; studentSuccessCount?: number }
  ): MemoryClassificationResult {
    const textLower = rawText.toLowerCase();

    let classifiedCategory: MemoryCategory = 'ephemeral_session_note';
    let importanceScore = 30;
    let retentionLevel: MemoryRetentionLevel = 'ephemeral';
    let suggestedTitle = rawText.substring(0, 40);
    let suggestedDescription = rawText;

    // 1. Success Breakthrough triggers
    if (
      textLower.includes('sucesso') ||
      textLower.includes('conseguiu') ||
      textLower.includes('fluidez') ||
      textLower.includes('mastered') ||
      textLower.includes('breakthrough') ||
      textLower.includes('excelente') ||
      (context?.studentSuccessCount && context.studentSuccessCount >= 3)
    ) {
      classifiedCategory = 'success_breakthrough';
      importanceScore = 85;
      retentionLevel = 'long_term';
      suggestedTitle = `Vitória de Fluência: ${this.extractKeywords(rawText)}`;
    }
    // 2. Persistent Difficulty triggers
    else if (
      textLower.includes('dificuldade') ||
      textLower.includes('erro recorrente') ||
      textLower.includes('hesitação') ||
      textLower.includes('confusão') ||
      textLower.includes('bloqueio') ||
      textLower.includes('trauma') ||
      (context?.studentErrorCount && context.studentErrorCount >= 2)
    ) {
      classifiedCategory = 'persistent_difficulty';
      importanceScore = 75;
      retentionLevel = 'working';
      suggestedTitle = `Ponto de Fricção: ${this.extractKeywords(rawText)}`;
    }
    // 3. SRS Review Item triggers
    else if (
      textLower.includes('vocabulário') ||
      textLower.includes('revisar') ||
      textLower.includes('review') ||
      textLower.includes('termo') ||
      textLower.includes('expressão') ||
      textLower.includes('phrasal verb')
    ) {
      classifiedCategory = 'srs_review_item';
      importanceScore = 60;
      retentionLevel = 'working';
      suggestedTitle = `Item para Revisão: ${this.extractKeywords(rawText)}`;
    }

    return {
      classifiedCategory,
      importanceScore,
      retentionLevel,
      suggestedTitle,
      suggestedDescription
    };
  }

  private extractKeywords(text: string): string {
    const words = text.split(/\s+/).filter(w => w.length > 3);
    return words.slice(0, 4).join(' ') || text.substring(0, 30);
  }
}

export const memoryClassifier = new MemoryClassifier();
