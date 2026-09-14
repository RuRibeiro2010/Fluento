/**
 * Twin Prediction Engine (Student Digital Twin - Sprint 4)
 * Forecasts forgetting risks, readiness for challenge advancement,
 * urgent review requirements, and cognitive blockers using the Memory Graph.
 */

import { TwinPredictionResult } from './digital-twin-types';
import { MemoryGraphEngine } from './memory-graph';

export interface TwinPredictionInput {
  userId: string;
  daysSinceLastSession: number;
  averageAccuracyRate: number; // 0-100
  recentStreakDays: number;
  confidenceScore: number; // 0-100
  memoryGraphEngine: MemoryGraphEngine;
}

export class TwinPredictionEngine {
  /**
   * Generates predictive forecasts for the Student Digital Twin.
   */
  public static predict(input: TwinPredictionInput): TwinPredictionResult {
    const graph = input.memoryGraphEngine.getGraph();

    // 1. Calculate Forgetting Risks
    const highRiskNodes = input.memoryGraphEngine.getHighRiskNodes();
    const predictedForgettingItems = highRiskNodes.map((node) => ({
      nodeId: node.id,
      label: node.label,
      daysRemaining: Math.max(1, Math.round(7 - (node.forgettingRiskPercent / 100) * 5)),
    }));

    // 2. Urgent Review Items
    const urgentReviewItems = highRiskNodes
      .filter((node) => node.forgettingRiskPercent >= 60 || node.masteryScore < 50)
      .map((node) => node.label);

    // 3. Ready for Advancement Items
    const readyForAdvancementItems = graph.nodes
      .filter((node) => node.masteryScore >= 80 && node.forgettingRiskPercent < 30)
      .map((node) => node.label);

    // 4. Potential Cognitive Blockers (nodes with low mastery blocking higher nodes)
    const potentialBlockers: string[] = [];
    graph.nodes.forEach((node) => {
      const blockers = input.memoryGraphEngine.getPrerequisiteBlockers(node.id);
      blockers.forEach((b) => {
        if (!potentialBlockers.includes(b.label)) {
          potentialBlockers.push(b.label);
        }
      });
    });

    // 5. Recommended Challenge Time
    let recommendedNextChallengeTimeMinutes = 15;
    if (input.confidenceScore < 50 || input.daysSinceLastSession >= 5) {
      recommendedNextChallengeTimeMinutes = 5;
    } else if (input.averageAccuracyRate >= 82 && input.confidenceScore >= 75) {
      recommendedNextChallengeTimeMinutes = 20;
    }

    return {
      predictedForgettingItems,
      readyForAdvancementItems,
      urgentReviewItems,
      potentialBlockers,
      recommendedNextChallengeTimeMinutes,
    };
  }
}
