/**
 * Monthly Roadmap Module (Human Learning Experience - HLX)
 * Dynamically plans upcoming weekly and monthly skill milestones,
 * ensuring every lesson prepares necessary competencies for future real-world fluency.
 */

export interface WeeklyMilestonePlan {
  weekNumber: number; // 1 to 4
  themeTitle: string;
  focusCompetency: string;
  targetMissions: string[];
  expectedCEFRIncrement: string;
  isCurrentWeek: boolean;
  isCompleted: boolean;
}

export interface MonthlyRoadmapPlan {
  userId: string;
  targetLanguage: string;
  currentCEFRLevel: string;
  targetCEFRGoal: string;
  generatedDate: string;
  weeklyPlan: WeeklyMilestonePlan[];
}

export function generateMonthlyRoadmap(
  userId: string,
  targetLanguage: string,
  currentCEFR: string = 'B1'
): MonthlyRoadmapPlan {
  const weeklyPlan: WeeklyMilestonePlan[] = [
    {
      weekNumber: 1,
      themeTitle: 'Fundação da Fluência Spontânea',
      focusCompetency: 'Conexão de frases complexas e conectores do discurso',
      targetMissions: ['hotel_checkin', 'restaurant_order'],
      expectedCEFRIncrement: `${currentCEFR} (Consolidação)`,
      isCurrentWeek: true,
      isCompleted: false,
    },
    {
      weekNumber: 2,
      themeTitle: 'Interação Social e Cultura do Dia a Dia',
      focusCompetency: 'Expressão de opiniões, dúvidas e preferências com diplomacia',
      targetMissions: ['daily_chat', 'shopping_negotiation'],
      expectedCEFRIncrement: `${currentCEFR}+`,
      isCurrentWeek: false,
      isCompleted: false,
    },
    {
      weekNumber: 3,
      themeTitle: 'Comunicação Profissional e Académica',
      focusCompetency: 'Apresentação de ideias, argumentação e vocabulário corporativo',
      targetMissions: ['business_meeting', 'presentation_qa'],
      expectedCEFRIncrement: 'Consolidação de B2',
      isCurrentWeek: false,
      isCompleted: false,
    },
    {
      weekNumber: 4,
      themeTitle: 'Imersão Total e Resolução de Desafios Reais',
      focusCompetency: 'Improviso em situações imprevistas e emergências de viagem',
      targetMissions: ['airport_navigation', 'medical_emergency'],
      expectedCEFRIncrement: 'Domínio do nível B2.1',
      isCurrentWeek: false,
      isCompleted: false,
    },
  ];

  return {
    userId,
    targetLanguage,
    currentCEFRLevel: currentCEFR,
    targetCEFRGoal: 'B2',
    generatedDate: new Date().toISOString().split('T')[0],
    weeklyPlan,
  };
}
