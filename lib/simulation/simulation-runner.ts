/**
 * Simulation Runner (Sprint 1)
 * Executes end-to-end pedagogical simulations for synthetic student profiles
 * across multi-session trajectories and scenarios without touching live user data.
 */

import {
  SyntheticStudentProfile,
  SimulationScenarioType,
  SimulatedSessionResult,
} from './simulation-types';
import { StudentBehaviorSimulator } from './student-behavior-simulator';
import { TeacherComplianceAuditor, InteractionTranscriptTurn } from './teacher-compliance-auditor';
import { LearningJourneyOrchestrator } from '../journey/learning-journey-orchestrator';
import { StudentDigitalTwinEngine } from '../twin/student-digital-twin';

export interface RunSimulationOptions {
  profile: SyntheticStudentProfile;
  scenarioType: SimulationScenarioType;
  sessionsCount?: number;
}

export class SimulationRunner {
  private journeyOrchestrator: LearningJourneyOrchestrator;

  constructor() {
    this.journeyOrchestrator = new LearningJourneyOrchestrator();
  }

  /**
   * Executes a multi-session simulation run for a synthetic student.
   */
  public runSimulation(options: RunSimulationOptions): SimulatedSessionResult[] {
    const { profile, scenarioType, sessionsCount = 5 } = options;
    const results: SimulatedSessionResult[] = [];

    for (let i = 1; i <= sessionsCount; i++) {
      // 1. Run Journey & Lesson Orchestration for the synthetic student
      const orchestrated = this.journeyOrchestrator.executeOrchestratedSession({
        userId: profile.id,
        profession: profile.traits.preferredContext,
        userInterest: profile.primaryGoal,
        targetCEFR: profile.targetCEFR,
        currentCEFR: profile.currentCEFR,
        availableMinutes: profile.traits.dailyAvailableMinutes,
        fatigueScore: profile.traits.speakingAnxietyLevel > 70 ? 7 : 3,
        confidenceRating: profile.traits.shynessLevel > 60 ? 4 : 8,
        recentAccuracyPercentage: profile.traits.learningSpeed,
        streakDays: i,
        unreviewedItemsCount: Math.round(profile.traits.retentionDecayRate / 10),
        completedLessonIds: [],
      });

      // 2. Simulate Student Behavior & Telemetry
      const studentTelemetry = StudentBehaviorSimulator.simulateSessionTelemetry(
        profile,
        i,
        orchestrated.composedLesson.momentum.score
      );

      // 3. Generate Simulated Interaction Turns to Audit TEACHER_GUIDELINES compliance
      const sampleTurns: InteractionTranscriptTurn[] = [
        {
          speaker: 'teacher',
          text: `Olá, ${profile.name.split(' ')[0]}! Hoje vamos praticar ${orchestrated.composedLesson.microGoal.primaryObjective}. Como correu o teu dia?`,
          durationSeconds: 8,
          isOpenQuestion: true,
        },
        {
          speaker: 'student',
          text: 'Olá! O meu dia foi bom, trabalhei muito mas estou pronto para falar.',
          durationSeconds: 15,
        },
        {
          speaker: 'teacher',
          text: 'Excelente. O que gostarias de destacar do teu trabalho de hoje?',
          durationSeconds: 6,
          isOpenQuestion: true,
          wasRecastingUsed: true,
        },
        {
          speaker: 'student',
          text: 'Hoje tive uma reunião com a equipa sobre o novo projeto.',
          durationSeconds: 18,
        },
      ];

      // 4. Audit Teacher Guidelines Compliance
      const teacherEvaluation = TeacherComplianceAuditor.auditSession(
        sampleTurns,
        studentTelemetry,
        i >= 2 // Memory of Success used from session 2 onwards
      );

      results.push({
        sessionId: `sim_sess_${profile.id}_${i}_${Date.now()}`,
        sessionNumber: i,
        scenarioType,
        studentTelemetry,
        teacherEvaluation,
        timestampIso: new Date(Date.now() - (sessionsCount - i) * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return results;
  }
}
