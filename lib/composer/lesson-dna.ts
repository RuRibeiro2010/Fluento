/**
 * Lesson DNA Engine (Sprint 5)
 * Over time, discovers what types of lessons produce the best learning outcomes
 * and Flow State for a specific student.
 * Tracks structural weights and preferences:
 * - speakingDensityWeight
 * - listeningDensityWeight
 * - roleplayAffinityWeight
 * - realExamplesAffinityWeight
 * - challengeLevelPreference
 * - humorLightnessWeight
 * - pausePacingPreference
 * Automatically reuses this knowledge to optimize subsequent session compositions.
 */

import { LessonDNA, LessonQualityScore } from './lesson-composer-types';

export class LessonDnaEngine {
  private dna: LessonDNA;

  constructor(initialDna?: Partial<LessonDNA>) {
    this.dna = {
      studentId: initialDna?.studentId || 'usr_guest',
      speakingDensityWeight: initialDna?.speakingDensityWeight ?? 0.8,
      listeningDensityWeight: initialDna?.listeningDensityWeight ?? 0.6,
      roleplayAffinityWeight: initialDna?.roleplayAffinityWeight ?? 0.75,
      realExamplesAffinityWeight: initialDna?.realExamplesAffinityWeight ?? 0.85,
      challengeLevelPreference: initialDna?.challengeLevelPreference ?? 0.65,
      humorLightnessWeight: initialDna?.humorLightnessWeight ?? 0.7,
      pausePacingPreference: initialDna?.pausePacingPreference ?? 0.5,
      discoveredInsights: initialDna?.discoveredInsights || [
        'Produção oral elevada (>60% talk time) correlaciona-se com +25% de retenção',
        'Cenários de roleplay situacional profissional aumentam envolvimento',
      ],
      lastUpdatedIso: new Date().toISOString(),
    };
  }

  /**
   * Retrieves current Lesson DNA.
   */
  public getDNA(): LessonDNA {
    return { ...this.dna };
  }

  /**
   * Evolves Lesson DNA based on post-lesson quality scores and structural telemetry.
   */
  public evolveDna(
    quality: LessonQualityScore,
    sessionStructure: {
      hadRoleplay: boolean;
      hadSpeakingFocus: boolean;
      hadRealExamples: boolean;
      challengeScale: number;
    }
  ): LessonDNA {
    const isHighQualitySession = quality.overallQualityScore >= 75;
    const insights: string[] = [...this.dna.discoveredInsights];

    if (isHighQualitySession) {
      if (sessionStructure.hadRoleplay) {
        this.dna.roleplayAffinityWeight = Math.min(1.0, this.dna.roleplayAffinityWeight + 0.05);
        if (!insights.some((i) => i.includes('roleplay'))) {
          insights.push('Sessões com simulações de roleplay geram elevada satisfação e Flow State');
        }
      }
      if (sessionStructure.hadSpeakingFocus) {
        this.dna.speakingDensityWeight = Math.min(1.0, this.dna.speakingDensityWeight + 0.05);
      }
      if (sessionStructure.hadRealExamples) {
        this.dna.realExamplesAffinityWeight = Math.min(1.0, this.dna.realExamplesAffinityWeight + 0.04);
      }
      this.dna.challengeLevelPreference = Math.min(
        1.0,
        this.dna.challengeLevelPreference * 0.9 + sessionStructure.challengeScale * 0.1
      );
    } else {
      // If quality was lower, adjust weights slightly towards balanced defaults
      this.dna.pausePacingPreference = Math.min(1.0, this.dna.pausePacingPreference + 0.05);
    }

    this.dna.discoveredInsights = insights.slice(-6); // Keep last 6 crisp insights
    this.dna.lastUpdatedIso = new Date().toISOString();

    return this.getDNA();
  }
}
