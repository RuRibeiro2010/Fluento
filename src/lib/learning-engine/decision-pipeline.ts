/**
 * FLUENTO LEARNING ENGINE - DECISION PIPELINE
 * 
 * Orchestrates pedagogical decision-making by applying the official Decision Pyramid
 * from FLUENTO_INTELLIGENCE_ARCHITECTURE.md:
 * 
 * 1. Psychological Safety (High Anxiety Overrides Everything)
 * 2. Real Communication (Meaning before Form)
 * 3. Confidence (Autonomy and Self-Efficacy)
 * 4. Learning & Acquisition (Consolidation & SRS)
 * 5. Motivation & Engagement (Intrinsic drive)
 * 6. Efficiency & Pace (Time awareness)
 * 7. Grammar Accuracy (Secondary recasting)
 * 8. Operational Metrics (Subordinated)
 */

import { DecisionContext, PedagogicalDecision } from './types';
import { strategySelector } from './strategy-selector';
import { difficultyEngine } from './difficulty-engine';
import { reviewEngine } from './review-engine';

export class DecisionPipeline {
  /**
   * Processes the DecisionContext through the Decision Pyramid and returns
   * a unified PedagogicalDecision.
   */
  public evaluate(context: DecisionContext): PedagogicalDecision {
    const { studentState, memoryThreads, userRequestedMode } = context;
    const timestampIso = new Date().toISOString();
    const decisionId = `dec_${studentState.studentId}_${Date.now()}`;

    // Step 1: Strategy Selection (Applies Psychological Safety & Behavioral Rules)
    const strategy = strategySelector.selectStrategy(context);

    // Step 2: Difficulty Calculation (Applies Krashen i+1 & Cognitive Load)
    const difficulty = difficultyEngine.calculateDifficulty(studentState);

    // Step 3: Select Review Items from Spaced Repetition Engine
    const scheduledReviewItems = reviewEngine.selectReviewItems(
      memoryThreads.intermediateReviewItems || [],
      studentState
    );

    // Step 4: Determine Primary Focus & Topic according to Decision Pyramid
    let primaryFocus: 'conversation' | 'grammar' | 'vocabulary' | 'pronunciation' | 'review' | 'recovery' = 'conversation';
    let whatToTeach = `Comunicação Prática para ${studentState.primaryGoal}`;
    let pedagogicalRationale = 'Desenvolvimento de fluência e autonomia comunicativa em contexto real.';
    let priorityApplied = '2. Real Communication (Meaning-First Dialogue)';

    // Override 1: Psychological Safety / High Anxiety
    if (studentState.speakingAnxietyLevel >= 65) {
      primaryFocus = 'recovery';
      whatToTeach = 'Desbloqueio Oral & Expressão de Baixa Pressão';
      pedagogicalRationale = 'Prioridade máxima à segurança psicológica e desativação do filtro afetivo.';
      priorityApplied = '1. Psychological Safety (High Anxiety Override)';
    }
    // Override 2: Long Absence Recovery
    else if (studentState.daysSinceLastSession >= 14) {
      primaryFocus = 'recovery';
      whatToTeach = 'Acolhimento de Regresso & Reativação de Fluência';
      pedagogicalRationale = 'Acolhimento empático sem culpa para reativar o contacto com o idioma.';
      priorityApplied = '1. Psychological Safety (Absence Recovery Override)';
    }
    // Override 3: Low Energy
    else if (studentState.energyLevel <= 3) {
      primaryFocus = 'conversation';
      whatToTeach = 'Conversa Leve de Acolhimento';
      pedagogicalRationale = 'Ajuste da carga cognitiva ao estado de fadiga do aluno.';
      priorityApplied = '5. Motivation & Energy Preservation';
    }
    // Override 4: User requested specific mode or due reviews
    else if (userRequestedMode && userRequestedMode !== 'auto') {
      primaryFocus = userRequestedMode === 'grammar' ? 'grammar' : userRequestedMode === 'vocabulary' ? 'vocabulary' : 'conversation';
      whatToTeach = `Sessão Focada em ${userRequestedMode.toUpperCase()}`;
      pedagogicalRationale = `Atendimento à preferência explícita do aluno por ${userRequestedMode}.`;
      priorityApplied = '3. Confidence & Autonomy (User Goal Alignment)';
    } else if (scheduledReviewItems.length >= 3) {
      primaryFocus = 'review';
      whatToTeach = `Revisão Adaptativa: ${scheduledReviewItems.map(i => i.conceptOrWord).join(', ')}`;
      pedagogicalRationale = 'Consolidação de estruturas com curva de esquecimento elevada.';
      priorityApplied = '4. Learning & Acquisition (Spaced Repetition SRS)';
    }

    // Target skills identification
    const targetSkills: string[] = ['Speaking Autonomy', 'Active Listening'];
    if (primaryFocus === 'vocabulary') targetSkills.push('Lexical Expansion');
    if (primaryFocus === 'grammar') targetSkills.push('Structural Accuracy');
    if (primaryFocus === 'recovery') targetSkills.push('Anxiety Reduction');

    return {
      decisionId,
      timestampIso,
      primaryFocus,
      whatToTeach,
      pedagogicalRationale,
      decisionPyramidPriorityApplied: priorityApplied,
      strategy,
      difficulty,
      scheduledReviewItems,
      recommendedDurationMinutes: studentState.availableMinutes || 10,
      targetSkills
    };
  }
}

export const decisionPipeline = new DecisionPipeline();
