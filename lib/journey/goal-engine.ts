import { UserGoalType, GoalConfig, GraphTopicNode } from '@/types/journey';

export const GOAL_CONFIGS: Record<UserGoalType, GoalConfig> = {
  conversation: {
    goalType: 'conversation',
    title: 'Daily Conversational Fluency',
    description: 'Master unscripted everyday dialogues, social chats, expressing feelings, and making local friends.',
    primarySkills: ['speaking', 'listening', 'vocabulary'],
    keyTopicFocuses: ['Present Tenses', 'Past Simple Stories', 'Idioms & Informal Chit-Chat'],
    suggestedScenarios: ['Coffee Shop Meeting', 'Dinner Party Dialogue', 'Park Walk Small Talk'],
  },
  work: {
    goalType: 'work',
    title: 'Professional Workplace Success',
    description: 'Excel in remote work, emails, team standups, project updates, and formal requests.',
    primarySkills: ['writing', 'speaking', 'grammar'],
    keyTopicFocuses: ['Workplace Email Formality', 'Presenting Updates', 'Indirect Questions'],
    suggestedScenarios: ['Sprint Planning Meeting', 'Client Email Response', 'Performance Review Sync'],
  },
  university: {
    goalType: 'university',
    title: 'Academic & University Studies',
    description: 'Succeed in lectures, essay writing, academic debates, and campus interactions.',
    primarySkills: ['reading', 'writing', 'listening'],
    keyTopicFocuses: ['Academic Essay Structure', 'Subjunctive Arguments', 'Lecture Note-Taking'],
    suggestedScenarios: ['Professor Office Hours', 'Study Group Debate', 'Library Research Guidance'],
  },
  travel: {
    goalType: 'travel',
    title: 'International Travel & Exploration',
    description: 'Navigate airports, hotels, restaurants, taxis, directions, and emergencies with ease.',
    primarySkills: ['speaking', 'listening', 'vocabulary'],
    keyTopicFocuses: ['Airport Customs', 'Hotel Check-in', 'Directions & Taxis', 'Ordering Meals'],
    suggestedScenarios: ['London Airport Customs', 'Barcelona Hotel Concierge', 'Parisian Bistro Ordering'],
  },
  ielts: {
    goalType: 'ielts',
    title: 'IELTS Academic & General Prep',
    description: 'Target Band 7.5+ in Speaking Part 2/3, Essay Task 2, and Complex Listening.',
    primarySkills: ['speaking', 'writing', 'listening', 'reading'],
    keyTopicFocuses: ['Cohesion & Coherence', 'Advanced Modal Verbs', 'Data Graph Description'],
    suggestedScenarios: ['IELTS Speaking Examiner Interview', 'Task 2 Argument Essay Polish'],
  },
  toefl: {
    goalType: 'toefl',
    title: 'TOEFL iBT High Score Track',
    description: 'Master integrated speaking/writing tasks, academic listening speed, and note taking.',
    primarySkills: ['listening', 'speaking', 'reading', 'writing'],
    keyTopicFocuses: ['Academic Synthesis', 'Connector Transitions', 'Rapid Note Discrimination'],
    suggestedScenarios: ['Campus Announcement Synthesis', 'Integrated Speaking Challenge'],
  },
  business: {
    goalType: 'business',
    title: 'Executive Business & Negotiations',
    description: 'Lead international deal negotiations, investor pitches, and executive leadership syncs.',
    primarySkills: ['speaking', 'writing', 'vocabulary'],
    keyTopicFocuses: ['Persuasive Pitching', 'Handling Objections', 'Corporate Terminology'],
    suggestedScenarios: ['Investor Board Meeting', 'Contract Negotiation Session'],
  },
  medical: {
    goalType: 'medical',
    title: 'Medical & Healthcare Practice',
    description: 'Clinical consultations, patient history taking, medical jargon, and polite empathy.',
    primarySkills: ['listening', 'speaking', 'vocabulary'],
    keyTopicFocuses: ['Patient Symptom Intake', 'Medical Terminology', 'Empathetic Explanations'],
    suggestedScenarios: ['Emergency Room Triage', 'Patient Diagnosis Consultation'],
  },
  tourism: {
    goalType: 'tourism',
    title: 'Hospitality & Tourism Industry',
    description: 'Welcoming guests, guiding tours, explaining cultural landmarks, and customer service.',
    primarySkills: ['speaking', 'listening', 'vocabulary'],
    keyTopicFocuses: ['Customer Service Courtesy', 'Cultural Explanations', 'Handling Complaints'],
    suggestedScenarios: ['Hotel Front Desk Service', 'City Guided Tour Storytelling'],
  },
};

export class GoalEngine {
  public getGoalConfig(goalType: UserGoalType): GoalConfig {
    return GOAL_CONFIGS[goalType] || GOAL_CONFIGS['conversation'];
  }

  /**
   * Prioritizes topic nodes based on the user's explicit goal.
   * Nodes that list the target goal are boosted to the top.
   */
  public prioritizeTopicsForGoal(
    topics: GraphTopicNode[],
    goalType: UserGoalType
  ): GraphTopicNode[] {
    return [...topics].sort((a, b) => {
      const aMatches = a.applicableGoals?.includes(goalType) ? 1 : 0;
      const bMatches = b.applicableGoals?.includes(goalType) ? 1 : 0;

      if (aMatches !== bMatches) return bMatches - aMatches;
      return b.importanceWeight - a.importanceWeight;
    });
  }
}

export const defaultGoalEngine = new GoalEngine();
