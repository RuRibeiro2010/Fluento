import { Mission, MissionStep, UserGoalType } from '@/types/journey';
import { StudentModel, WeaknessAnalysis, CEFRLevel } from '@/types/brain';

/**
 * Path Generator Engine
 * Generates adaptive multi-step missions and dynamically adjusts learning trajectories.
 * Fast learners: Shortened, accelerated path focusing on open roleplay.
 * Struggling learners: Expanded scaffolding with targeted review steps.
 */
export class PathGeneratorEngine {
  /**
   * Constructs a structured multi-lesson Mission ending with a comprehensive unscripted simulation.
   */
  public generateMission(
    missionId: string,
    title: string,
    locationContext: string,
    cefrLevel: CEFRLevel,
    goalTag: UserGoalType
  ): Mission {
    const steps: MissionStep[] = [
      {
        stepId: `${missionId}-step-1`,
        title: 'Arrival & Initial Contact',
        scenarioTitle: `${locationContext}: Customs & Greeting`,
        targetSkills: ['speaking', 'listening'],
        estimatedMinutes: 8,
        isCompleted: false,
      },
      {
        stepId: `${missionId}-step-2`,
        title: 'Transit & Directions',
        scenarioTitle: `${locationContext}: Taxi & Navigation`,
        targetSkills: ['vocabulary', 'speaking'],
        estimatedMinutes: 10,
        isCompleted: false,
      },
      {
        stepId: `${missionId}-step-3`,
        title: 'Check-in & Formal Requests',
        scenarioTitle: `${locationContext}: Hotel Concierge`,
        targetSkills: ['grammar', 'writing'],
        estimatedMinutes: 10,
        isCompleted: false,
      },
      {
        stepId: `${missionId}-step-4`,
        title: 'Dining & Food Orders',
        scenarioTitle: `${locationContext}: Restaurant Menu Inquiry`,
        targetSkills: ['speaking', 'vocabulary'],
        estimatedMinutes: 12,
        isCompleted: false,
      },
      {
        stepId: `${missionId}-step-5`,
        title: 'Commerce & Problem Solving',
        scenarioTitle: `${locationContext}: Shopping & Inquiries`,
        targetSkills: ['listening', 'speaking'],
        estimatedMinutes: 10,
        isCompleted: false,
      },
    ];

    return {
      id: missionId,
      title,
      locationContext,
      cefrLevel,
      goalTag,
      steps,
      isCompleted: false,
      finalSimulationTitle: `Final Simulation: Full Unscripted ${locationContext} Challenge`,
    };
  }

  /**
   * Generates a collection of tailored active missions for the student.
   * Dynamically adapts step lengths according to student learning speed and confidence.
   */
  public generateAdaptiveSequence(
    studentModel: StudentModel,
    weakness: WeaknessAnalysis
  ): Mission[] {
    const goalTag = (studentModel.objectives[0]?.toLowerCase() as UserGoalType) || 'travel';

    const missionLondon = this.generateMission(
      'miss-london-01',
      'Mission London: Airport to Hotel Journey',
      'London',
      studentModel.currentCefr,
      goalTag
    );

    const missionBarcelona = this.generateMission(
      'miss-bcn-02',
      'Mission Barcelona: Culinary & Cultural Immersion',
      'Barcelona',
      studentModel.currentCefr,
      goalTag
    );

    // If student is accelerated (high confidence & low weaknesses), trim preliminary steps
    if (studentModel.learningSpeed === 'accelerated' || studentModel.confidenceScore >= 85) {
      missionLondon.steps = missionLondon.steps.filter((_, idx) => idx % 2 === 0);
      missionBarcelona.steps = missionBarcelona.steps.filter((_, idx) => idx % 2 === 0);
    }

    // If student is struggling (high weakness score), insert extra grammar focus step
    if (weakness.overallWeaknessScore > 60) {
      missionLondon.steps.unshift({
        stepId: 'miss-london-step-0-review',
        title: 'Targeted Review: Essential Tenses Before Departure',
        scenarioTitle: 'Pre-flight Grammar Prep',
        targetSkills: ['grammar'],
        estimatedMinutes: 5,
        isCompleted: false,
      });
    }

    return [missionLondon, missionBarcelona];
  }
}

export const defaultPathGeneratorEngine = new PathGeneratorEngine();
