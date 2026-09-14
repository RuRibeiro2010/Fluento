import {
  JourneyNextStep,
  RoadmapNode,
  CheckpointStatus,
  MilestoneItem,
  UnlockedFeature,
  Mission,
  UserGoalType,
} from '@/types/journey';
import { StudentModelEngine, defaultStudentModel } from '@/lib/brain/student-model';
import { WeaknessEngine, defaultWeaknessEngine } from '@/lib/brain/weakness-engine';
import { ReviewEngine, defaultReviewEngine } from '@/lib/brain/review-engine';
import { LearningGraphEngine, defaultLearningGraph } from './learning-graph';
import { GoalEngine, defaultGoalEngine } from './goal-engine';
import { CheckpointEngine, defaultCheckpointEngine } from './checkpoint';
import { MilestoneEngine, defaultMilestoneEngine } from './milestones';
import { UnlockEngine, defaultUnlockEngine } from './unlocks';
import { RoadmapEngine, defaultRoadmapEngine } from './roadmap';
import { PathGeneratorEngine, defaultPathGeneratorEngine } from './path-generator';
import { LessonSessionHistoryLog } from '@/types/brain';

export interface FullJourneySnapshot {
  currentCefr: string;
  roadmapNodes: RoadmapNode[];
  nextStep: JourneyNextStep;
  activeMissions: Mission[];
  checkpoints: CheckpointStatus[];
  milestones: MilestoneItem[];
  unlockedFeatures: UnlockedFeature[];
  overallMasteryPercent: number;
}

/**
 * Learning Journey Engine
 * Orchestrates the learner's complete pedagogical progression.
 * Ensures the student never sees a disjointed list of lessons, but a structured, goal-aligned journey.
 * Never generates identical steps for two different moments or users.
 */
export class JourneyEngine {
  public studentModelEngine: StudentModelEngine;
  public graphEngine: LearningGraphEngine;
  public goalEngine: GoalEngine;
  public weaknessEngine: WeaknessEngine;
  public reviewEngine: ReviewEngine;
  public checkpointEngine: CheckpointEngine;
  public milestoneEngine: MilestoneEngine;
  public unlockEngine: UnlockEngine;
  public roadmapEngine: RoadmapEngine;
  public pathGeneratorEngine: PathGeneratorEngine;

  private topicMasteries: Record<string, number> = {};

  constructor(
    studentModelEngine: StudentModelEngine = defaultStudentModel,
    graphEngine: LearningGraphEngine = defaultLearningGraph,
    goalEngine: GoalEngine = defaultGoalEngine
  ) {
    this.studentModelEngine = studentModelEngine;
    this.graphEngine = graphEngine;
    this.goalEngine = goalEngine;

    this.weaknessEngine = defaultWeaknessEngine;
    this.reviewEngine = defaultReviewEngine;
    this.checkpointEngine = defaultCheckpointEngine;
    this.milestoneEngine = defaultMilestoneEngine;
    this.unlockEngine = defaultUnlockEngine;
    this.roadmapEngine = defaultRoadmapEngine;
    this.pathGeneratorEngine = defaultPathGeneratorEngine;

    // Seed default topic masteries for initial experience
    this.topicMasteries = {
      'g-a1-pres-simple': 92,
      'g-a1-pres-cont': 88,
      'g-a1-food-dining': 85,
      'g-a2-past-simple': 65, // Needs review (below 70%)
    };
  }

  /**
   * Generates complete Journey Snapshot for UI visualization
   */
  public generateFullJourneySnapshot(
    sessionLogs: LessonSessionHistoryLog[] = [],
    streakDays: number = 7,
    currentXp: number = 350
  ): FullJourneySnapshot {
    const model = this.studentModelEngine.getModel();
    const weakness = this.weaknessEngine.analyzeWeaknesses(model);

    // 1. Build Roadmap Nodes with Automatic Re-Entry for decay
    const roadmapNodes = this.roadmapEngine.buildRoadmap(model, this.topicMasteries);

    // 2. Evaluate Checkpoints
    const masteredTopicIds = Object.keys(this.topicMasteries).filter(
      (id) => (this.topicMasteries[id] || 0) >= 80
    );
    const checkpoints = this.checkpointEngine.getAllCheckpoints(model, masteredTopicIds);

    // 3. Evaluate Milestones & Unlocks
    const milestones = this.milestoneEngine.evaluateMilestones(
      model,
      sessionLogs,
      streakDays,
      currentXp
    );
    const unlockedMilestoneIds = milestones.filter((m) => m.isUnlocked).map((m) => m.id);
    const unlockedFeatures = this.unlockEngine.evaluateUnlocks(model, unlockedMilestoneIds);

    // 4. Generate Active Adaptive Missions
    const activeMissions = this.pathGeneratorEngine.generateAdaptiveSequence(model, weakness);

    // 5. Calculate Single Optimal Next Step
    const nextStep = this.calculateNextStep(roadmapNodes, activeMissions, model);

    // Overall mastery calculation
    const overallMasteryPercent = Math.round(
      (model.grammarMasteryPercent +
        model.vocabularyMasteryPercent +
        model.speakingMasteryPercent +
        model.listeningMasteryPercent +
        model.readingMasteryPercent +
        model.writingMasteryPercent) /
        6
    );

    return {
      currentCefr: model.currentCefr,
      roadmapNodes,
      nextStep,
      activeMissions,
      checkpoints,
      milestones,
      unlockedFeatures,
      overallMasteryPercent,
    };
  }

  /**
   * Determines the single exact next step in the student's journey.
   * Prioritizes decay reviews (< 70% mastery) before advancing to brand new nodes.
   */
  private calculateNextStep(
    roadmapNodes: RoadmapNode[],
    activeMissions: Mission[],
    model: any
  ): JourneyNextStep {
    // Priority 1: Nodes requiring intelligent review (dropped < 70%)
    const decayNode = roadmapNodes.find((n) => n.needsReview);
    if (decayNode) {
      return {
        roadmapNode: decayNode,
        stepType: 'review_decay',
        rationale: `Intelligent Review Trigger: Mastery in "${decayNode.title}" dropped to ${decayNode.masteryPercent}%. Reinforcing memory before moving forward.`,
        recommendedTeacherId: 'persona-sofia',
        estimatedMinutes: 8,
      };
    }

    // Priority 2: Current Active Roadmap Node
    const currentNode = roadmapNodes.find((n) => n.status === 'current') || roadmapNodes[0];

    // Check if step belongs to an active mission
    const targetMission = activeMissions[0];

    return {
      roadmapNode: currentNode,
      stepType: 'new_topic',
      rationale: `Next Milestone Step: "${currentNode.title}". Perfect match for your CEFR ${currentNode.cefrLevel} target and goal.`,
      targetMission,
      recommendedTeacherId: 'persona-sofia',
      estimatedMinutes: currentNode.estimatedMinutes,
    };
  }

  /**
   * Updates topic mastery score after completing a lesson block or exercise
   */
  public updateTopicMastery(topicId: string, newScorePercent: number): void {
    const current = this.topicMasteries[topicId] || 0;
    // Moving average update
    this.topicMasteries[topicId] = Math.round(current * 0.4 + newScorePercent * 0.6);
  }
}

export const defaultJourneyEngine = new JourneyEngine();
