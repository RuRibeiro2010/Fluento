/**
 * FLUENTO LEARNING ANALYTICS - TRANSFER ANALYZER
 * 
 * Measures spontaneous usage of learned vocabulary and grammar in free-flow contexts,
 * reduction of L1 interference patterns, and cross-context adaptability.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { ThreadSnapshot } from '@/src/lib/learning-threads';
import { TransferMetric } from './types';

export class TransferAnalyzer {
  public analyzeTransfer(
    twin: StudentDigitalTwinState,
    threads: ThreadSnapshot
  ): TransferMetric {
    const knownL1Patterns = twin.language.knownL1InterferencePatterns || [];
    const initialL1Count = Math.max(1, knownL1Patterns.length + 2);

    // Resolved L1 interference difficulties
    const resolvedL1Difficulties = threads.difficulties.filter(
      d => d.isResolved && d.l1InterferenceTag
    ).length;

    const l1ReductionRate = Math.min(1.0, resolvedL1Difficulties / initialL1Count);

    // Spontaneous usage count based on success memories with vocabulary/grammar tags
    const spontaneousUsageCount = threads.successes.filter(
      s => s.skillCategory === 'vocabulary' || s.skillCategory === 'speaking'
    ).length;

    // Context adaptability score (0 - 100)
    const contextAdaptabilityScore = Math.min(
      100,
      Math.round(twin.language.fluencyScore * 0.6 + spontaneousUsageCount * 10)
    );

    const overallTransferScore = Math.min(
      100,
      Math.round(contextAdaptabilityScore * 0.6 + l1ReductionRate * 40)
    );

    return {
      score: overallTransferScore,
      spontaneousUsageCount,
      l1InterferenceReductionRate: Math.round(l1ReductionRate * 100) / 100,
      contextAdaptabilityScore,
      evaluationNote: `Score de transferência pragmática de ${overallTransferScore}/100 com ${spontaneousUsageCount} utilizações espontâneas registadas.`
    };
  }
}

export const transferAnalyzer = new TransferAnalyzer();
