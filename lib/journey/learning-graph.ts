import { GraphTopicNode, UserGoalType } from '@/types/journey';
import { CEFRLevel } from '@/types/brain';

/**
 * Universal Pedagogical Learning Graph
 * Directed Acyclic Graph (DAG) enforcing prerequisite dependencies before unlocking higher concepts.
 * E.g.: Present Simple -> Present Continuous -> Past Simple -> Past Continuous -> Present Perfect -> Past Perfect -> Subjunctive.
 */
export const LEARNING_GRAPH_NODES: GraphTopicNode[] = [
  // A1 LEVEL NODES
  {
    id: 'g-a1-pres-simple',
    title: 'Present Simple & Essential Verbs',
    description: 'Foundational present tense, routines, and basic verb conjugations.',
    cefrLevel: 'A1',
    prerequisites: [],
    nextTopics: ['g-a1-pres-cont', 'g-a1-food-dining'],
    relatedSkills: ['grammar', 'speaking'],
    baseDifficulty: 2,
    importanceWeight: 10,
    applicableGoals: ['conversation', 'travel', 'work', 'tourism', 'business'],
  },
  {
    id: 'g-a1-pres-cont',
    title: 'Present Continuous & Actions in Progress',
    description: 'Describing actions happening right now and temporary states.',
    cefrLevel: 'A1',
    prerequisites: ['g-a1-pres-simple'],
    nextTopics: ['g-a2-past-simple'],
    relatedSkills: ['grammar', 'listening'],
    baseDifficulty: 3,
    importanceWeight: 9,
    applicableGoals: ['conversation', 'travel', 'work', 'tourism'],
  },
  {
    id: 'g-a1-food-dining',
    title: 'Cafe, Food & Ordering Meals',
    description: 'Polite requests, ordering drinks, asking for prices and check.',
    cefrLevel: 'A1',
    prerequisites: ['g-a1-pres-simple'],
    nextTopics: ['g-a2-travel-airport'],
    relatedSkills: ['vocabulary', 'speaking'],
    baseDifficulty: 2,
    importanceWeight: 8,
    applicableGoals: ['travel', 'tourism', 'conversation'],
  },

  // A2 LEVEL NODES
  {
    id: 'g-a2-past-simple',
    title: 'Past Simple / Completed Events',
    description: 'Talking about completed events, past dates, and finished trips.',
    cefrLevel: 'A2',
    prerequisites: ['g-a1-pres-cont'],
    nextTopics: ['g-a2-past-cont'],
    relatedSkills: ['grammar', 'speaking'],
    baseDifficulty: 4,
    importanceWeight: 10,
    applicableGoals: ['conversation', 'work', 'travel', 'university', 'ielts'],
  },
  {
    id: 'g-a2-past-cont',
    title: 'Past Continuous & Background Stories',
    description: 'Describing ongoing past activities and narrative backgrounds.',
    cefrLevel: 'A2',
    prerequisites: ['g-a2-past-simple'],
    nextTopics: ['g-b1-pres-perfect'],
    relatedSkills: ['grammar', 'listening'],
    baseDifficulty: 5,
    importanceWeight: 8,
    applicableGoals: ['conversation', 'university', 'ielts', 'toefl'],
  },
  {
    id: 'g-a2-travel-airport',
    title: 'Airport Customs & Hotel Check-in',
    description: 'Navigating transport, asking directions, hotel reservations.',
    cefrLevel: 'A2',
    prerequisites: ['g-a1-food-dining'],
    nextTopics: ['g-b1-business-email'],
    relatedSkills: ['vocabulary', 'speaking', 'listening'],
    baseDifficulty: 4,
    importanceWeight: 8,
    applicableGoals: ['travel', 'tourism', 'conversation'],
  },

  // B1 LEVEL NODES
  {
    id: 'g-b1-pres-perfect',
    title: 'Present Perfect & Life Experiences',
    description: 'Connecting past actions to present consequences and life history.',
    cefrLevel: 'B1',
    prerequisites: ['g-a2-past-cont'],
    nextTopics: ['g-b1-past-perfect'],
    relatedSkills: ['grammar', 'writing'],
    baseDifficulty: 6,
    importanceWeight: 9,
    applicableGoals: ['work', 'business', 'university', 'ielts', 'toefl', 'conversation'],
  },
  {
    id: 'g-b1-past-perfect',
    title: 'Past Perfect & Complex Sequences',
    description: 'Expressing events that occurred before another point in the past.',
    cefrLevel: 'B1',
    prerequisites: ['g-b1-pres-perfect'],
    nextTopics: ['g-b2-subjunctive'],
    relatedSkills: ['grammar', 'writing', 'reading'],
    baseDifficulty: 7,
    importanceWeight: 8,
    applicableGoals: ['university', 'ielts', 'toefl', 'work', 'business'],
  },
  {
    id: 'g-b1-business-email',
    title: 'Workplace Email & Formal Expressions',
    description: 'Polite business requests, scheduling meetings, professional clarity.',
    cefrLevel: 'B1',
    prerequisites: ['g-a2-travel-airport'],
    nextTopics: ['g-b2-negotiations'],
    relatedSkills: ['writing', 'vocabulary'],
    baseDifficulty: 6,
    importanceWeight: 9,
    applicableGoals: ['work', 'business', 'medical'],
  },

  // B2 LEVEL NODES
  {
    id: 'g-b2-subjunctive',
    title: 'Subjunctive Mood & Hypotheticals',
    description: 'Expressing wishes, doubts, emotions, and conditional scenarios.',
    cefrLevel: 'B2',
    prerequisites: ['g-b1-past-perfect'],
    nextTopics: ['g-c1-nuance'],
    relatedSkills: ['grammar', 'speaking'],
    baseDifficulty: 8,
    importanceWeight: 9,
    applicableGoals: ['conversation', 'university', 'ielts', 'toefl', 'work'],
  },
  {
    id: 'g-b2-negotiations',
    title: 'Business Negotiations & Persuasion',
    description: 'Handling client objections, formal agreements, persuasive pitch.',
    cefrLevel: 'B2',
    prerequisites: ['g-b1-business-email'],
    nextTopics: ['g-c1-specialized'],
    relatedSkills: ['speaking', 'listening', 'vocabulary'],
    baseDifficulty: 8,
    importanceWeight: 8,
    applicableGoals: ['business', 'work', 'medical'],
  },

  // C1/C2 LEVEL NODES
  {
    id: 'g-c1-nuance',
    title: 'Cultural Idioms, Tone & Subtle Nuance',
    description: 'Mastering native humor, double meanings, and high-level rhetoric.',
    cefrLevel: 'C1',
    prerequisites: ['g-b2-subjunctive'],
    nextTopics: [],
    relatedSkills: ['speaking', 'listening', 'reading'],
    baseDifficulty: 9,
    importanceWeight: 9,
    applicableGoals: ['conversation', 'university', 'ielts', 'toefl'],
  },
  {
    id: 'g-c1-specialized',
    title: 'Specialized Professional Terminology',
    description: 'Domain-specific jargon for medicine, tech, law, and academics.',
    cefrLevel: 'C1',
    prerequisites: ['g-b2-negotiations'],
    nextTopics: [],
    relatedSkills: ['vocabulary', 'writing'],
    baseDifficulty: 9,
    importanceWeight: 9,
    applicableGoals: ['medical', 'business', 'work', 'university'],
  },
];

export class LearningGraphEngine {
  private nodesMap: Map<string, GraphTopicNode>;

  constructor(customNodes: GraphTopicNode[] = LEARNING_GRAPH_NODES) {
    this.nodesMap = new Map();
    customNodes.forEach((node) => this.nodesMap.set(node.id, node));
  }

  public getNode(id: string): GraphTopicNode | undefined {
    return this.nodesMap.get(id);
  }

  public getAllNodes(): GraphTopicNode[] {
    return Array.from(this.nodesMap.values());
  }

  /**
   * Verifies if all prerequisites for a node are satisfied by the student's mastered topics.
   */
  public arePrerequisitesMet(nodeId: string, masteredTopicIds: string[]): boolean {
    const node = this.nodesMap.get(nodeId);
    if (!node) return false;
    if (!node.prerequisites || node.prerequisites.length === 0) return true;

    const masteredSet = new Set(masteredTopicIds.map((id) => id.toLowerCase()));
    return node.prerequisites.every((prereqId) => masteredSet.has(prereqId.toLowerCase()));
  }

  /**
   * Retrieves nodes that are unlocked and ready for the student to learn next.
   */
  public getAvailableNextNodes(masteredTopicIds: string[], cefrFilter?: CEFRLevel): GraphTopicNode[] {
    const masteredSet = new Set(masteredTopicIds.map((id) => id.toLowerCase()));

    return this.getAllNodes().filter((node) => {
      // Must not already be mastered
      if (masteredSet.has(node.id.toLowerCase())) return false;

      // Check prerequisites
      const prereqsOk = this.arePrerequisitesMet(node.id, masteredTopicIds);
      if (!prereqsOk) return false;

      // Optional CEFR level match
      if (cefrFilter && node.cefrLevel !== cefrFilter) return false;

      return true;
    });
  }

  /**
   * Filters topic nodes matching a student's specific goal (e.g. 'travel' or 'medical').
   */
  public filterNodesByGoal(goalType: UserGoalType): GraphTopicNode[] {
    return this.getAllNodes().filter(
      (node) => !node.applicableGoals || node.applicableGoals.includes(goalType)
    );
  }
}

export const defaultLearningGraph = new LearningGraphEngine();
