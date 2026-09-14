import { RoadmapNode, NodeStatus } from '@/types/journey';
import { StudentModel } from '@/types/brain';
import { LEARNING_GRAPH_NODES } from './learning-graph';

/**
 * Roadmap Engine
 * Generates a UI-ready structured roadmap of competence nodes.
 * Automatically handles status transitions (locked -> available -> current -> completed -> mastered)
 * and AUTOMATIC RE-ENTRY: If a topic's mastery drops below 70%, it automatically re-flags as `needsReview = true`
 * and prioritizes it in the active plan without requiring manual user intervention.
 */
export class RoadmapEngine {
  public static readonly MASTERY_THRESHOLD_PERCENT = 85;
  public static readonly DECAY_REVIEW_THRESHOLD_PERCENT = 70;

  /**
   * Constructs the active visual roadmap for a student
   */
  public buildRoadmap(
    studentModel: StudentModel,
    topicMasteries: Record<string, number> = {}
  ): RoadmapNode[] {
    const nodes = LEARNING_GRAPH_NODES;

    // Track completed topic IDs
    const masteredIds = Object.keys(topicMasteries).filter(
      (id) => (topicMasteries[id] || 0) >= RoadmapEngine.MASTERY_THRESHOLD_PERCENT
    );
    const masteredSet = new Set(masteredIds.map((i) => i.toLowerCase()));

    let foundCurrent = false;

    return nodes.map((graphNode, index) => {
      const topicId = graphNode.id;
      const mastery = topicMasteries[topicId] ?? (masteredSet.has(topicId.toLowerCase()) ? 90 : 0);

      // Intelligent Review Trigger: Drop below 70% mastery
      const needsReview = mastery > 0 && mastery < RoadmapEngine.DECAY_REVIEW_THRESHOLD_PERCENT;

      let status: NodeStatus = 'locked';

      if (mastery >= RoadmapEngine.MASTERY_THRESHOLD_PERCENT) {
        status = 'mastered';
      } else if (mastery >= 50) {
        status = 'completed';
      } else {
        // Check prerequisites
        const prereqsMet = graphNode.prerequisites.every((prereqId) =>
          masteredSet.has(prereqId.toLowerCase())
        );

        if (prereqsMet) {
          if (!foundCurrent || needsReview) {
            status = 'current';
            foundCurrent = true;
          } else {
            status = 'available';
          }
        } else {
          status = 'locked';
        }
      }

      return {
        id: `rm-${topicId}`,
        topicId,
        title: graphNode.title,
        description: graphNode.description,
        cefrLevel: graphNode.cefrLevel,
        status,
        masteryPercent: mastery,
        needsReview,
        orderIndex: index + 1,
        estimatedMinutes: Math.round(graphNode.baseDifficulty * 2.5),
      };
    });
  }
}

export const defaultRoadmapEngine = new RoadmapEngine();
