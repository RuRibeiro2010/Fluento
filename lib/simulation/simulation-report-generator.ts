/**
 * Simulation Report Generator (Sprint 1)
 * Aggregates multi-session simulation data and generates automated, actionable quality reports
 * detailing pedagogical strengths, discovered issues, regressions, and improvement opportunities.
 */

import {
  SyntheticStudentProfile,
  SimulatedSessionResult,
  TeacherSimulationLabReport,
} from './simulation-types';

export class SimulationReportGenerator {
  /**
   * Generates a comprehensive quality report for a simulated cohort run.
   */
  public static generateReport(
    profile: SyntheticStudentProfile,
    results: SimulatedSessionResult[]
  ): TeacherSimulationLabReport {
    if (results.length === 0) {
      throw new Error('Impossível gerar relatório de simulação sem resultados de sessões.');
    }

    const total = results.length;
    const avgTalkTime = Math.round(
      results.reduce((acc, r) => acc + r.studentTelemetry.studentTalkTimeRatio, 0) / total
    );
    const avgFlowState = Math.round(
      results.reduce((acc, r) => acc + r.studentTelemetry.flowStateIndex, 0) / total
    );
    const avgLearningRoi = Math.round(
      results.reduce((acc, r) => acc + r.studentTelemetry.learningRoiScore, 0) / total
    );
    const avgTeacherScore = Math.round(
      results.reduce((acc, r) => acc + r.teacherEvaluation.overallTeacherGuidelineScore, 0) / total
    );

    const strengths: string[] = [];
    const discoveredIssues: string[] = [];
    const detectedRegressions: string[] = [];
    const improvementOpportunities: string[] = [];

    // Analyze Strengths
    if (avgTalkTime >= 60) {
      strengths.push(
        `Excelente taxa de fala do aluno (${avgTalkTime}% Student Talk Time), cumprindo o manifesto pedagógico de autonomia oral.`
      );
    }
    if (avgFlowState >= 70) {
      strengths.push(
        `Frequência elevada de Flow State (${avgFlowState}/100) mantendo alto engajamento sem atrito cognitivo.`
      );
    }
    if (avgTeacherScore >= 85) {
      strengths.push(
        `Alta adesão às Diretrizes do Professor Humano (${avgTeacherScore}/100) com escuta ativa e recasting natural.`
      );
    }

    // Analyze Issues & Regressions
    results.forEach((r) => {
      r.teacherEvaluation.violatedGuidelines.forEach((v) => {
        if (!discoveredIssues.includes(v)) {
          discoveredIssues.push(v);
        }
      });
      if (r.studentTelemetry.cognitiveLoadScore > 80) {
        const issue = `Sessão #${r.sessionNumber}: Carga cognitiva elevada (${r.studentTelemetry.cognitiveLoadScore}/100) para o perfil ${profile.archetype}.`;
        if (!discoveredIssues.includes(issue)) {
          discoveredIssues.push(issue);
        }
      }
    });

    if (profile.traits.speakingAnxietyLevel > 70 && avgTalkTime < 50) {
      detectedRegressions.push(
        `Perfil com ansiedade oral elevada (${profile.traits.speakingAnxietyLevel}%) produziu tempo de fala insuficiente (<50%). Requer desaceleração no início da sessão.`
      );
    }

    // Opportunities
    if (profile.traits.hasDyslexia) {
      improvementOpportunities.push(
        'Injetar suporte multimodal e espaçamento fonético expandido para alunos com dislexia.'
      );
    }
    if (profile.traits.dailyAvailableMinutes <= 10) {
      improvementOpportunities.push(
        'Ajustar micro-sessões de 10 min para focar exclusivamente num único micro-conceito com vitória rápida.'
      );
    }

    return {
      reportId: `lab_rep_${profile.id}_${Date.now()}`,
      timestampIso: new Date().toISOString(),
      evaluatedStudentProfile: profile,
      totalSessionsSimulated: total,
      averageStudentTalkTime: avgTalkTime,
      averageFlowStateIndex: avgFlowState,
      averageLearningRoi: avgLearningRoi,
      averageTeacherComplianceScore: avgTeacherScore,
      strengths: strengths.length > 0 ? strengths : ['Sessão concluída com parâmetros de estabilidade básica.'],
      discoveredIssues,
      detectedRegressions,
      improvementOpportunities: improvementOpportunities.length > 0 ? improvementOpportunities : ['Manter monitoramento contínuo em novos perfis.'],
      summaryConclusion: `A simulação para o perfil "${profile.name}" (${profile.archetype}) registou um Teacher Compliance Score de ${avgTeacherScore}/100 e Flow State médio de ${avgFlowState}/100.`,
    };
  }
}
