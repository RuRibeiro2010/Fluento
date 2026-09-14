/**
 * Goal Engine Module (Human Learning Experience - HLX)
 * Formulates invisible session micro-goals for every conversation
 * and tracks implicit student mastery without adding visual noise or stress.
 */

export interface InvisibleSessionGoal {
  id: string;
  targetSkillOrStructure: string;
  successThresholdCriteria: string;
  targetCount: number;
  currentCount: number;
  isAchieved: boolean;
}

export interface SessionGoalsManifest {
  sessionId: string;
  invisibleGoals: InvisibleSessionGoal[];
  overallProgressPercentage: number;
}

export function createInvisibleGoalsForSession(
  sessionId: string,
  weaknesses: string[] = []
): SessionGoalsManifest {
  const defaultGoals: InvisibleSessionGoal[] = [
    {
      id: 'goal-fluency',
      targetSkillOrStructure: 'Expressão fluida sem pausas superiores a 5 segundos',
      successThresholdCriteria: '3 turnos consecutivos sem travagens prolongadas',
      targetCount: 3,
      currentCount: 0,
      isAchieved: false,
    },
    {
      id: 'goal-vocabulary',
      targetSkillOrStructure: 'Uso ativo de pelo menos 2 vocábulos novos de nível B2',
      successThresholdCriteria: 'Integração contextual espontânea na resposta',
      targetCount: 2,
      currentCount: 0,
      isAchieved: false,
    },
  ];

  if (weaknesses.includes('grammar')) {
    defaultGoals.push({
      id: 'goal-grammar',
      targetSkillOrStructure: 'Aplicação correta de conjugação no passado',
      successThresholdCriteria: '2 frases corretas no pretérito sem hesitação',
      targetCount: 2,
      currentCount: 0,
      isAchieved: false,
    });
  }

  return {
    sessionId,
    invisibleGoals: defaultGoals,
    overallProgressPercentage: 0,
  };
}

export function evaluateInvisibleGoalProgress(
  manifest: SessionGoalsManifest,
  userUtteranceText: string,
  isGrammaticallyCorrect: boolean
): SessionGoalsManifest {
  const wordCount = userUtteranceText.split(' ').length;

  const updatedGoals = manifest.invisibleGoals.map((goal) => {
    if (goal.isAchieved) return goal;

    let newCount = goal.currentCount;

    if (goal.id === 'goal-fluency' && wordCount >= 6) {
      newCount += 1;
    } else if (goal.id === 'goal-grammar' && isGrammaticallyCorrect && wordCount >= 5) {
      newCount += 1;
    } else if (goal.id === 'goal-vocabulary' && wordCount >= 8) {
      newCount += 1;
    }

    const achieved = newCount >= goal.targetCount;
    return {
      ...goal,
      currentCount: newCount,
      isAchieved: achieved,
    };
  });

  const achievedCount = updatedGoals.filter((g) => g.isAchieved).length;
  const overallPercentage = Math.round((achievedCount / updatedGoals.length) * 100);

  return {
    ...manifest,
    invisibleGoals: updatedGoals,
    overallProgressPercentage: overallPercentage,
  };
}
