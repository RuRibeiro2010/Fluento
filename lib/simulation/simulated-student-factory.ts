/**
 * Synthetic Student Factory (Sprint 1)
 * Generates 100% fictional, anonymized student profiles across 12 core personas.
 * Ensures zero usage of real user data while enabling stress testing of pedagogical systems.
 */

import { SyntheticStudentProfile, StudentArchetype, StudentPersonalityTraits } from './simulation-types';

export class SimulatedStudentFactory {
  /**
   * Generates a synthetic student profile by archetype.
   */
  public static createProfile(
    archetype: StudentArchetype,
    overrides?: Partial<StudentPersonalityTraits>
  ): SyntheticStudentProfile {
    const baseTraits = this.getArchetypeTraits(archetype);
    const mergedTraits: StudentPersonalityTraits = {
      ...baseTraits,
      ...overrides,
    };

    const name = this.getFictionalName(archetype);
    const { currentCEFR, targetCEFR, primaryGoal } = this.getArchetypeGoal(archetype);

    return {
      id: `synth_std_${archetype}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      archetype,
      traits: mergedTraits,
      currentCEFR,
      targetCEFR,
      primaryGoal,
      isFictional: true,
    };
  }

  /**
   * Provides baseline traits for each of the 12 core student archetypes.
   */
  private static getArchetypeTraits(archetype: StudentArchetype): StudentPersonalityTraits {
    switch (archetype) {
      case 'exam_prep_teen':
        return { shynessLevel: 35, speakingAnxietyLevel: 50, learningSpeed: 75, retentionDecayRate: 40, dailyAvailableMinutes: 20, hasDyslexia: false, preferredContext: 'academic' };
      case 'erasmus_student':
        return { shynessLevel: 20, speakingAnxietyLevel: 30, learningSpeed: 85, retentionDecayRate: 25, dailyAvailableMinutes: 30, hasDyslexia: false, preferredContext: 'casual' };
      case 'emigrating_pro':
        return { shynessLevel: 40, speakingAnxietyLevel: 60, learningSpeed: 70, retentionDecayRate: 35, dailyAvailableMinutes: 25, hasDyslexia: false, preferredContext: 'corporate' };
      case 'doctor':
        return { shynessLevel: 30, speakingAnxietyLevel: 40, learningSpeed: 90, retentionDecayRate: 20, dailyAvailableMinutes: 15, hasDyslexia: false, preferredContext: 'medical' };
      case 'engineer':
        return { shynessLevel: 45, speakingAnxietyLevel: 45, learningSpeed: 88, retentionDecayRate: 25, dailyAvailableMinutes: 20, hasDyslexia: false, preferredContext: 'engineering' };
      case 'very_shy':
        return { shynessLevel: 90, speakingAnxietyLevel: 85, learningSpeed: 60, retentionDecayRate: 50, dailyAvailableMinutes: 15, hasDyslexia: false, preferredContext: 'casual' };
      case 'highly_confident':
        return { shynessLevel: 10, speakingAnxietyLevel: 15, learningSpeed: 80, retentionDecayRate: 30, dailyAvailableMinutes: 25, hasDyslexia: false, preferredContext: 'corporate' };
      case 'speaking_anxiety':
        return { shynessLevel: 75, speakingAnxietyLevel: 95, learningSpeed: 65, retentionDecayRate: 45, dailyAvailableMinutes: 15, hasDyslexia: false, preferredContext: 'casual' };
      case 'dyslexia_learner':
        return { shynessLevel: 50, speakingAnxietyLevel: 65, learningSpeed: 55, retentionDecayRate: 50, dailyAvailableMinutes: 20, hasDyslexia: true, preferredContext: 'casual' };
      case 'fast_learner':
        return { shynessLevel: 15, speakingAnxietyLevel: 20, learningSpeed: 98, retentionDecayRate: 15, dailyAvailableMinutes: 30, hasDyslexia: false, preferredContext: 'corporate' };
      case 'high_revision_needed':
        return { shynessLevel: 50, speakingAnxietyLevel: 55, learningSpeed: 45, retentionDecayRate: 80, dailyAvailableMinutes: 20, hasDyslexia: false, preferredContext: 'academic' };
      case 'time_constrained_10min':
        return { shynessLevel: 30, speakingAnxietyLevel: 35, learningSpeed: 75, retentionDecayRate: 40, dailyAvailableMinutes: 10, hasDyslexia: false, preferredContext: 'corporate' };
    }
  }

  private static getFictionalName(archetype: StudentArchetype): string {
    const names: Record<StudentArchetype, string> = {
      exam_prep_teen: 'Lucas Silva (Sintético)',
      erasmus_student: 'Sofia Santos (Sintética)',
      emigrating_pro: 'Carlos Oliveira (Sintético)',
      doctor: 'Dra. Beatriz Costa (Sintética)',
      engineer: 'Eng. Rodrigo Pereira (Sintético)',
      very_shy: 'Mariana Lima (Sintética)',
      highly_confident: 'André Martins (Sintético)',
      speaking_anxiety: 'Inês Ferreira (Sintética)',
      dyslexia_learner: 'Diogo Ribeiro (Sintético)',
      fast_learner: 'Tiago Almeida (Sintético)',
      high_revision_needed: 'Clara Rodrigues (Sintética)',
      time_constrained_10min: 'Bernardo Sousa (Sintético)',
    };
    return names[archetype];
  }

  private static getArchetypeGoal(archetype: StudentArchetype) {
    switch (archetype) {
      case 'exam_prep_teen': return { currentCEFR: 'A2', targetCEFR: 'B2', primaryGoal: 'Aprovação no Exame de Certificação' };
      case 'erasmus_student': return { currentCEFR: 'A2', targetCEFR: 'B2', primaryGoal: 'Vida Universitária e Social em Erasmus' };
      case 'emigrating_pro': return { currentCEFR: 'A2', targetCEFR: 'B2', primaryGoal: 'Entrevista de Emprego & Integração Profissional' };
      case 'doctor': return { currentCEFR: 'B1', targetCEFR: 'C1', primaryGoal: 'Atendimento Médico em Contexto Internacional' };
      case 'engineer': return { currentCEFR: 'A2', targetCEFR: 'B2', primaryGoal: 'Apresentação de Projetos & Reuniões Técnicas' };
      case 'very_shy': return { currentCEFR: 'A1', targetCEFR: 'B1', primaryGoal: 'Superação de Bloqueio Oral em Diálogos Simples' };
      case 'highly_confident': return { currentCEFR: 'B1', targetCEFR: 'C1', primaryGoal: 'Negociação Comercial & Debates de Alto Nível' };
      case 'speaking_anxiety': return { currentCEFR: 'A2', targetCEFR: 'B1', primaryGoal: 'Falar sem Ansiedade nem Trava Afetiva' };
      case 'dyslexia_learner': return { currentCEFR: 'A1', targetCEFR: 'A2', primaryGoal: 'Aprendizagem Fonética & Leitura Apoiada' };
      case 'fast_learner': return { currentCEFR: 'B1', targetCEFR: 'C1', primaryGoal: 'Aceleração de Fluência para Liderança' };
      case 'high_revision_needed': return { currentCEFR: 'A2', targetCEFR: 'B1', primaryGoal: 'Consolidação de Memória de Longo Prazo' };
      case 'time_constrained_10min': return { currentCEFR: 'A2', targetCEFR: 'B1', primaryGoal: 'Progresso Consistente com Micro-Sessões Diárias' };
    }
  }

  /**
   * Generates a suite containing all 12 synthetic student profiles.
   */
  public static createAllArchetypesSuite(): SyntheticStudentProfile[] {
    const archetypes: StudentArchetype[] = [
      'exam_prep_teen',
      'erasmus_student',
      'emigrating_pro',
      'doctor',
      'engineer',
      'very_shy',
      'highly_confident',
      'speaking_anxiety',
      'dyslexia_learner',
      'fast_learner',
      'high_revision_needed',
      'time_constrained_10min',
    ];

    return archetypes.map((a) => this.createProfile(a));
  }
}
