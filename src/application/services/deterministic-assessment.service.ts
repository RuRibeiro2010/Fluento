import { AssessmentTurnResponse, AssessmentResult } from '../../domain/assessment/types';
import { assessmentRulesService } from '../../domain/assessment/services/assessment-rules.service';
import { SkillMatrix, LearningProfileDiagnostic, DiagnosticInitialPlan } from '@/types/profile';

/**
 * DETERMINISTIC ASSESSMENT SERVICE
 * 
 * Implements the rule-based pedagogical assessment engine.
 * Used as a fallback when AI is unavailable or for deterministic validation.
 */
export class DeterministicAssessmentService {
  /**
   * Evaluates user level using deterministic pedagogical rules.
   * Extracted from legacy lib/ai/assessment.ts
   */
  public evaluateUserLevelMultimodal(
    turns: AssessmentTurnResponse[],
    targetLanguage: string = 'es'
  ): AssessmentResult {
    const confidenceScore = assessmentRulesService.calculateConfidenceScore(turns);
    const validation = assessmentRulesService.validateAssessmentDataSufficient(turns);

    // Evaluate performance across 9 competencies
    let speakingScore = 75;
    let listeningScore = 80;
    let readingScore = 85;
    let writingScore = 72;
    let grammarScore = 74;
    let vocabularyScore = 78;
    let pronunciationScore = 80;
    let fluencyScore = 76;

    turns.forEach((t) => {
      if (t.turnType === 'speaking' && t.userResponseText) {
        const words = t.userResponseText.split(/\s+/).filter(Boolean).length;
        if (words >= 8) {
          speakingScore += 10;
          fluencyScore += 8;
          vocabularyScore += 6;
        }
      } else if (t.turnType === 'listening' && t.isOptionCorrect) {
        listeningScore += 12;
        pronunciationScore += 5;
      } else if (t.turnType === 'reading' && t.isOptionCorrect) {
        readingScore += 10;
        vocabularyScore += 6;
      } else if (t.turnType === 'writing' && t.isOptionCorrect) {
        writingScore += 12;
        grammarScore += 10;
      }
    });

    const skillMatrix: SkillMatrix = {
      speaking: Math.min(98, Math.max(50, speakingScore)),
      listening: Math.min(98, Math.max(55, listeningScore)),
      reading: Math.min(98, Math.max(60, readingScore)),
      writing: Math.min(98, Math.max(50, writingScore)),
      grammar: Math.min(98, Math.max(50, grammarScore)),
      vocabulary: Math.min(98, Math.max(55, vocabularyScore)),
      pronunciation: Math.min(98, Math.max(60, pronunciationScore)),
      fluency: Math.min(98, Math.max(50, fluencyScore)),
      confidence: confidenceScore,
    };

    const avgScore = Math.round(
      (skillMatrix.speaking +
        skillMatrix.listening +
        skillMatrix.reading +
        skillMatrix.writing +
        skillMatrix.grammar +
        skillMatrix.vocabulary +
        skillMatrix.pronunciation) /
        7
    );

    let assignedLevel: AssessmentResult['assignedLevel'] = 'A1';
    if (avgScore >= 88) assignedLevel = 'B2';
    else if (avgScore >= 78) assignedLevel = 'B1';
    else if (avgScore >= 65) assignedLevel = 'A2';

    const strengths = [
      'Compreensão de conversação quotidiana e contexto geral',
      'Vocabulário ativo de utilidade prática e comunicação clara',
      'Conectividade e intuição para participar em diálogos reais',
    ];

    const focusAreas = [
      'Conjugação precisa do passado e estruturas de hipótese',
      'Expansão de vocabulário para expressões de opinião complexa',
    ];

    const learningProfile: LearningProfileDiagnostic = {
      strengths,
      weaknesses: focusAreas,
      learningStyle: 'auditory_interactive',
      idealPace: 'moderate',
      reviewNeeds: ['Pretérito e Subjuntivo em frases compostas', 'Conectores de discurso'],
      prioritySkills: ['Speaking em situações imprevisíveis', 'Listening a velocidade normal'],
      qualitativeSummary:
        'Comunicas com boa naturalidade em situações quotidianas simples. O teu foco imediato será ganhar segurança ao estruturar opiniões e ideias mais complexas.',
    };

    const initialPlan: DiagnosticInitialPlan = {
      primaryObjective: `Atingir fluência natural no nível ${assignedLevel === 'A1' ? 'A2' : assignedLevel === 'A2' ? 'B1' : 'B2'} com total confiança comunicativa`,
      firstKeyCompetencies: ['Conversação Espontânea', 'Escuta em Velocidade Real', 'Uso Natural de Verbos de Ação'],
      estimatedEvolutionMonths: assignedLevel === 'A1' ? 4 : assignedLevel === 'A2' ? 3 : 2,
      firstMission: {
        id: 'mission_1_checkin',
        title: 'Missão 1: Check-in Aconchegante no Boutique Hotel',
        description: 'Conversa prática e realista com o Prof. Lucas para testar a tua capacidade de pedir preferências de quarto.',
        targetSkill: 'Speaking & Situational Fluency',
      },
    };

    return {
      assignedLevel,
      score: avgScore,
      skillMatrix,
      confidenceScore,
      learningProfile,
      initialPlan,
      aiSelfValidation: validation,
      recommendedLevel: assignedLevel,
      strengths,
      focusAreas,
      summary: learningProfile.qualitativeSummary,
    };
  }

  /**
   * Backward compatibility wrapper for evaluateUserLevel
   */
  public evaluateUserLevel(answers: Record<string, string>): AssessmentResult {
    const sampleTurns: AssessmentTurnResponse[] = Object.entries(answers).map(([key, val]) => ({
      turnId: key,
      turnType: key.includes('read') ? 'reading' : key.includes('listen') ? 'listening' : 'speaking',
      userResponseText: val,
      isOptionCorrect: true,
    }));

    return this.evaluateUserLevelMultimodal(sampleTurns);
  }
}

export const deterministicAssessmentService = new DeterministicAssessmentService();
