/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - PLANNER VALIDATOR
 * 
 * Validates the structural and logical integrity of an AdaptiveLearningPlan.
 */

import { AdaptiveLearningPlan, PlanValidationResult } from './types';

export class PlannerValidator {
  public validatePlan(plan: AdaptiveLearningPlan): PlanValidationResult {
    const issues: string[] = [];

    if (!plan.studentId || plan.studentId.trim() === '') {
      issues.push('Student ID é obrigatório no plano adaptativo.');
    }

    if (!plan.planId || plan.planId.trim() === '') {
      issues.push('Plan ID é obrigatório no plano adaptativo.');
    }

    if (plan.recommendedDurationMinutes < 5 || plan.recommendedDurationMinutes > 60) {
      issues.push(`Duração recomendada inválida (${plan.recommendedDurationMinutes} min). Deve ser entre 5 e 60 minutos.`);
    }

    if (!plan.primaryObjective || plan.primaryObjective.trim() === '') {
      issues.push('Objetivo primário não pode estar vazio.');
    }

    if (!plan.conversationScenario || !plan.conversationScenario.scenarioId) {
      issues.push('Cenário de conversação inválido ou ausente.');
    }

    if (!plan.tutorStyle || !plan.tutorStyle.tone) {
      issues.push('Estilo de tutor não configurado corretamente.');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

export const plannerValidator = new PlannerValidator();
