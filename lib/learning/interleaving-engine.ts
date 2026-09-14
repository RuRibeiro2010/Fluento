/**
 * Módulo 4: Interleaving Engine
 * Mixes distinct skill modalities (grammar, vocabulary, speaking, listening, reading, writing)
 * in scientifically alternating sequences to prevent cognitive saturation and build cognitive agility.
 */

export type SkillModality = 'speaking' | 'listening' | 'grammar' | 'vocabulary' | 'reading' | 'writing';

export interface InterleavedActivity {
  id: string;
  modality: SkillModality;
  title: string;
  estimatedMinutes: number;
  prompt: string;
}

export function interleaveLessonActivities(activities: InterleavedActivity[]): InterleavedActivity[] {
  if (activities.length <= 1) return activities;

  const result: InterleavedActivity[] = [];
  const pool = [...activities];

  while (pool.length > 0) {
    const lastModality = result.length > 0 ? result[result.length - 1].modality : null;

    // Find first activity whose modality is different from the last added activity
    const candidateIndex = pool.findIndex((a) => a.modality !== lastModality);

    if (candidateIndex !== -1) {
      result.push(pool.splice(candidateIndex, 1)[0]);
    } else {
      // If no different modality left, pop from remaining pool
      result.push(pool.shift()!);
    }
  }

  return result;
}
