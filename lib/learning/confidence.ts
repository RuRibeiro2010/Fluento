import { SkillMatrix } from '@/types/profile';

/**
 * Service: Confidence Score Calculation
 * Calculates weighted language confidence score from user skill matrix.
 */
export function calculateConfidenceScore(skillMatrix?: Partial<SkillMatrix>): number {
  if (!skillMatrix) return 50;

  const weights: Record<keyof SkillMatrix, number> = {
    grammar: 0.12,
    vocabulary: 0.15,
    listening: 0.15,
    speaking: 0.15,
    reading: 0.08,
    writing: 0.08,
    pronunciation: 0.07,
    fluency: 0.1,
    confidence: 0.1,
  };

  let totalScore = 0;
  let totalWeight = 0;

  for (const key of Object.keys(weights) as Array<keyof SkillMatrix>) {
    const score = skillMatrix[key] ?? 50;
    const weight = weights[key];
    totalScore += score * weight;
    totalWeight += weight;
  }

  return Math.round(totalWeight > 0 ? totalScore / totalWeight : 50);
}

export function getConfidenceBadge(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'High Confidence', color: 'green' };
  if (score >= 50) return { label: 'Building Competence', color: 'blue' };
  return { label: 'Emerging Skills', color: 'amber' };
}
