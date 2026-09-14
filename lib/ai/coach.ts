import { UserProfile } from '@/types/profile';
import { StudyPlan } from '@/types/study-plan';
import {
  WeeklyStudyPlan,
  DaySchedule,
  DailyCoachMessage,
  LongitudinalMemory,
  WeakWordItem,
  WeakGrammarItem,
  EmotionalState,
  SundayWeeklyReview,
  MonthlyEvolutionData,
} from '@/types/coach';

/**
 * Creates an initial longitudinal memory state for a user.
 */
export function createInitialLongitudinalMemory(
  userId: string,
  targetLanguage: string,
  profile?: Partial<UserProfile>
): LongitudinalMemory {
  const level = profile?.last_assessment?.level || 'A1';

  return {
    userId: userId || 'guest-user',
    targetLanguage: targetLanguage || 'es',
    weakWords: [
      { word: 'por vs para', translation: 'for/by', errorCount: 2, lastPracticed: new Date().toISOString() },
      { word: 'estacionamiento', translation: 'parking lot', errorCount: 1, lastPracticed: new Date().toISOString() },
    ],
    weakGrammar: [
      { concept: 'Past Subjunctive Conjugations', errorRate: 0.35, lastReviewed: new Date().toISOString() },
      { concept: 'Indirect Object Pronouns', errorRate: 0.25, lastReviewed: new Date().toISOString() },
    ],
    confidenceTrend: [
      { date: 'Mon', score: profile?.confidence_score || 45 },
      { date: 'Tue', score: (profile?.confidence_score || 45) + 3 },
      { date: 'Wed', score: (profile?.confidence_score || 45) + 5 },
    ],
    learningVelocity: 'steady',
    masteredTopics: profile?.preferred_topics || ['Travel Basics', 'Ordering Food'],
    totalPracticeMinutes: (profile?.minutes_per_day || 15) * 4,
    streakDays: 5,
    lastSessionDate: new Date().toISOString(),
    pastErrorsMemory: ['Subjuntivo no passado', 'Concordância de género em reuniões'],
    userContextDetails: {
      profession: profile?.profession || 'Profissional Executivo',
      hobbies: profile?.hobbies || ['Tecnologia', 'Viagens', 'Café'],
      favoriteTopics: profile?.preferred_topics || ['Negócios', 'Cultura Internacional'],
      ageGroup: profile?.age ? `${profile.age} anos` : 'Adulto',
      motivationReason: profile?.motivation || 'Liderar apresentações e negociações com total fluência',
    },
    emotionalState: {
      responseTimeMs: 2400,
      recentErrorCount: 1,
      hesitationScore: 18,
      inactivityDays: 0,
      motivationScore: 88,
      consistencyScore: 92,
      detectedMood: 'confident',
      coachAdaptation: 'Acelerar o ritmo com vocabulário mais rico e desafios práticos.',
    },
  };
}

/**
 * Emotional Detection Engine
 * Analyzes response time, error frequency, hesitations, inactivity, and consistency
 * to adjust difficulty, encouragement, and teaching strategy.
 */
export function analyzeEmotionalState(metrics: {
  responseTimeMs?: number;
  recentErrorCount?: number;
  hesitationScore?: number;
  inactivityDays?: number;
  consistencyScore?: number;
}): EmotionalState {
  const {
    responseTimeMs = 2500,
    recentErrorCount = 0,
    hesitationScore = 20,
    inactivityDays = 0,
    consistencyScore = 85,
  } = metrics;

  let detectedMood: EmotionalState['detectedMood'] = 'confident';
  let coachAdaptation = 'Manter ritmo e aprofundar expressão verbal.';

  if (inactivityDays > 3 || recentErrorCount >= 4 || hesitationScore > 65) {
    detectedMood = 'demotivated';
    coachAdaptation = 'Reduzir a dificuldade da gramática, oferecer incentivo extra e focar em conversação leve sobre temas favoritos.';
  } else if (responseTimeMs > 5000 || hesitationScore > 45) {
    detectedMood = 'hesitant';
    coachAdaptation = 'Dar mais tempo de pausa, fornecer exemplos visuais e reforçar com explicações claras.';
  } else if (recentErrorCount === 0 && hesitationScore < 20) {
    detectedMood = 'highly_motivated';
    coachAdaptation = 'Aumentar a complexidade do vocabulário e desafiar para respostas mais espontâneas.';
  }

  return {
    responseTimeMs,
    recentErrorCount,
    hesitationScore,
    inactivityDays,
    motivationScore: detectedMood === 'demotivated' ? 45 : detectedMood === 'hesitant' ? 65 : 90,
    consistencyScore,
    detectedMood,
    coachAdaptation,
  };
}

/**
 * Updates longitudinal memory based on user practice session results.
 */
export function updateLongitudinalMemory(
  existingMemory: LongitudinalMemory,
  sessionData: {
    durationMinutes: number;
    newErrors?: string[];
    correctedWords?: string[];
    confidenceDelta?: number;
  }
): LongitudinalMemory {
  const updatedMinutes = existingMemory.totalPracticeMinutes + (sessionData.durationMinutes || 10);
  const updatedConfidence = Math.min(
    100,
    Math.max(10, (existingMemory.confidenceTrend.slice(-1)[0]?.score || 50) + (sessionData.confidenceDelta || 2))
  );

  const updatedTrend = [
    ...existingMemory.confidenceTrend.slice(-6),
    { date: 'Today', score: updatedConfidence },
  ];

  return {
    ...existingMemory,
    totalPracticeMinutes: updatedMinutes,
    confidenceTrend: updatedTrend,
    streakDays: existingMemory.streakDays + 1,
    lastSessionDate: new Date().toISOString(),
    learningVelocity: sessionData.confidenceDelta && sessionData.confidenceDelta > 5 ? 'accelerating' : 'steady',
  };
}

/**
 * Generates human teacher personalized greetings leveraging long-term memory.
 */
export function generateHumanTeacherMemoryGreeting(
  profile: Partial<UserProfile>,
  memory?: LongitudinalMemory
): string {
  const name = profile.email?.split('@')[0] || 'aluno';
  const weakConcept = memory?.weakGrammar?.[0]?.concept || memory?.pastErrorsMemory?.[0] || 'Past Subjunctive';
  const goal = profile.motivation || profile.current_focus || 'reuniões e viagens';

  const options = [
    `Olá! Na semana passada notámos alguma hesitação em ${weakConcept}. Hoje estás claramente mais confiante e vamos rever isso em 3 minutos no contexto de ${goal}.`,
    `Excelente evolução nos últimos dias! Lembras-te de quando tínhamos dificuldades em ${weakConcept}? Hoje já dominas isso naturalmente. Vamos avançar!`,
    `Olá! Como o teu objetivo principal envolve ${goal}, preparei a sessão de hoje para ser prática e direta ao assunto, respeitando o teu ritmo de aprendizagem.`,
  ];

  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Generates Sunday Weekly Review summary
 */
export function generateSundayWeeklyReview(
  profile: Partial<UserProfile>,
  memory?: LongitudinalMemory
): SundayWeeklyReview {
  const lang = profile.target_languages?.[0]?.toUpperCase() || 'ES';

  return {
    id: `weekly-review-${Date.now()}`,
    weekNumber: 4,
    dateRange: '17 a 23 de Julho',
    achievements: [
      `Concluíste 5 sessões diárias de ${lang} sem falhar o teu streak`,
      'Aumentaste a pontuação de precisão na pronúncia para 88%',
      'Dominaste 24 novas palavras técnicas de negócios',
    ],
    weaknessesIdentified: [
      'Hesitação ocasional nos conectores do passado',
      'Velocidade de resposta sob pressão em simulações',
    ],
    completedGoals: [
      'Missão do Aeroporto e Imigração concluída com grau A',
      'Treino de escuta nativa a velocidade 1.0x',
    ],
    nextWeekPlan: [
      'Aprofundar a negociação diplomática em reuniões',
      'Reforçar o uso intuitivo de ser vs estar sem pausas',
      'Praticar uma chamada de 10 minutos com o Professor Virtual',
    ],
    coachPersonalNote:
      'Parabéns pela excelente consistência! Estás visivelmente mais solto a articular ideias complexas. Na próxima semana vamos focar em refinamento estilístico.',
    isViewed: false,
  };
}

/**
 * Generates Monthly Evolution Timeline Data
 */
export function generateMonthlyEvolutionData(
  profile: Partial<UserProfile>,
  memory?: LongitudinalMemory
): MonthlyEvolutionData {
  return {
    userId: profile.id || 'usr_guest',
    firstLessonDate: '15 de Maio de 2026',
    initialLevel: 'A1 Iniciante',
    currentLevel: profile.last_assessment?.level || 'B1 Intermédio',
    wordsLearnedCount: 340,
    grammarRulesMastered: 18,
    pronunciationScore: 88,
    fluencyScore: 76,
    totalTimeStudiedMinutes: memory?.totalPracticeMinutes || 420,
    consecutiveStreakDays: memory?.streakDays || 5,
    biggestAchievements: [
      'Primeira conversa de 10 minutos 100% no idioma alvo',
      'Superou o bloqueio na pronúncia de sons sibilantes',
      'Conclusão da Missão Executiva de Negociação de Oferta de Emprego',
    ],
    milestonesTimeline: [
      {
        id: 'm-1',
        date: '15 Mai 2026',
        title: 'Primeira Aula e Teste de Diagnóstico',
        category: 'first_lesson',
        description: 'Início da jornada no nível A1 com foco em apresentações básicas e vocabulário inicial.',
        badgeIcon: 'Flag',
      },
      {
        id: 'm-2',
        date: '02 Jun 2026',
        title: 'Avanço para Nível A2',
        category: 'level_up',
        description: 'Domínio do tempo presente e interações quotidianas em cafés e viagens.',
        badgeIcon: 'Award',
      },
      {
        id: 'm-3',
        date: '28 Jun 2026',
        title: 'Atinjimento do Nível B1 Intermédio',
        category: 'level_up',
        description: 'Capacidade de expressar opiniões, negociar propostas e sustentar conversas de 15 minutos.',
        badgeIcon: 'Sparkles',
      },
      {
        id: 'm-4',
        date: '20 Jul 2026',
        title: 'Primeira Missão do Mundo Real Concluída com Grau A',
        category: 'mission_completed',
        description: 'Simulação bem sucedida de entrevista de emprego em espanhol corporativo com o Professor Virtual.',
        badgeIcon: 'Briefcase',
      },
    ],
  };
}

/**
 * Generates an adaptive 7-day weekly study plan taking into account user profile,
 * lowest skill scores in skill matrix, daily time budget, motivation, and longitudinal memory.
 */
export async function generateWeeklyStudyPlan(
  profile: Partial<UserProfile>,
  memory?: LongitudinalMemory
): Promise<WeeklyStudyPlan> {
  const targetLanguage = profile.target_languages?.[0] || profile.last_assessment?.summary || 'Spanish';
  const targetUpper = targetLanguage.toUpperCase();
  const minutes = profile.minutes_per_day || 15;
  const level = (profile.last_assessment?.level as any) || 'A1';
  const topics = profile.preferred_topics && profile.preferred_topics.length > 0
    ? profile.preferred_topics
    : ['travel', 'daily_life', 'culture'];

  // Identify lowest skill from matrix to adapt focus
  const skills = profile.skill_matrix || {
    grammar: 50,
    vocabulary: 50,
    listening: 50,
    speaking: 40,
    reading: 60,
    writing: 45,
    pronunciation: 50,
  };

  const lowestSkill = Object.entries(skills).reduce(
    (min, curr) => (curr[1] < min[1] ? curr : min),
    ['speaking', 100] as [string, number]
  )[0];

  const adaptedTriggers: string[] = [
    `Target Language: ${targetUpper}`,
    `Level: ${level}`,
    `Daily Time Budget: ${minutes} Mins`,
    `Lowest Skill Focus: ${lowestSkill.toUpperCase()} (${skills[lowestSkill as keyof typeof skills]}%)`,
  ];

  if (memory?.weakWords && memory.weakWords.length > 0) {
    adaptedTriggers.push(`Reviewing ${memory.weakWords.length} persistent vocabulary weak spots`);
  }

  const days: DaySchedule[] = [
    {
      dayNumber: 1,
      dayName: 'Monday',
      focusArea: 'vocabulary',
      title: `Essential ${topics[0] || 'Travel'} Vocabulary`,
      description: `Build 15 high-frequency terms for ${topics[0] || 'daily conversation'}.`,
      estimatedMinutes: minutes,
      lessonType: 'Interactive Flashcards & Context',
      difficultyLevel: level,
      isCompleted: true,
      topicTag: topics[0] || 'travel',
    },
    {
      dayNumber: 2,
      dayName: 'Tuesday',
      focusArea: 'grammar',
      title: `Grammar Patterns & Present Tense Rules`,
      description: `Master natural verb conjugations and avoid common syntax traps.`,
      estimatedMinutes: minutes,
      lessonType: 'Guided Syntax Builder',
      difficultyLevel: level,
      isCompleted: false,
      topicTag: 'grammar',
    },
    {
      dayNumber: 3,
      dayName: 'Wednesday',
      focusArea: 'listening',
      title: `Native Accent & Speed Audio Comprehension`,
      description: `Listen to short authentic dialogues at 1.0x native speaking pace.`,
      estimatedMinutes: minutes,
      lessonType: 'Audio Immersion',
      difficultyLevel: level,
      isCompleted: false,
      topicTag: 'listening',
    },
    {
      dayNumber: 4,
      dayName: 'Thursday',
      focusArea: 'mission',
      title: `Real-World Mission: ${profile.motivation || 'Ordering Food'}`,
      description: `Put your skills to the test in a real-world dialogue challenge.`,
      estimatedMinutes: minutes,
      lessonType: 'Scenario Simulation',
      difficultyLevel: level,
      isCompleted: false,
      missionTask: `Complete a 3-turn interactive conversation in ${targetLanguage}.`,
      topicTag: 'mission',
    },
    {
      dayNumber: 5,
      dayName: 'Friday',
      focusArea: 'speaking',
      title: `Pronunciation & Speech Confidence (${lowestSkill.toUpperCase()} Boost)`,
      description: `Practice oral articulation with real-time AI phoneme feedback.`,
      estimatedMinutes: minutes,
      lessonType: 'Voice Practice',
      difficultyLevel: level,
      isCompleted: false,
      topicTag: 'speaking',
    },
    {
      dayNumber: 6,
      dayName: 'Saturday',
      focusArea: 'reading',
      title: `Contextual Short Story & Expressions`,
      description: `Read a short story set in a local culture with click-to-translate vocabulary.`,
      estimatedMinutes: minutes,
      lessonType: 'Cultural Reading',
      difficultyLevel: level,
      isCompleted: false,
      topicTag: topics[1] || 'culture',
    },
    {
      dayNumber: 7,
      dayName: 'Sunday',
      focusArea: 'review',
      title: `Weekly Spaced Repetition & Progress Reflection`,
      description: `Review weak words, resolve mistakes, and update your weekly fluency score.`,
      estimatedMinutes: minutes,
      lessonType: 'Adaptive Error Review',
      difficultyLevel: level,
      isCompleted: false,
      topicTag: 'review',
    },
  ];

  return {
    id: `plan-week-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: profile.id || 'guest-user',
    targetLanguage,
    nativeLanguage: profile.native_language || 'en',
    weekNumber: 1,
    title: `Weekly ${targetUpper} Immersion & Skill Mastery`,
    overallGoal: profile.motivation || `Reach confident ${level} conversational fluency`,
    dailySchedules: days,
    adaptedBasedOn: adaptedTriggers,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Generates daily coach advice message personalized according to coach personality and progress.
 */
export async function generateDailyCoachMessage(
  profile: Partial<UserProfile>,
  daySchedule?: DaySchedule,
  memory?: LongitudinalMemory
): Promise<DailyCoachMessage> {
  const personality = (profile.coach_personality as any) || 'encouraging';
  const focus = daySchedule?.focusArea || 'vocabulary';
  const targetLang = profile.target_languages?.[0] || 'Spanish';

  let greeting = 'Hello learner!';
  let advice = `Today is a great day to dedicate ${profile.minutes_per_day || 15} minutes to ${focus}.`;
  let quote = 'Consistency beats intensity every single time.';

  if (personality === 'encouraging') {
    greeting = 'Hola! You are making remarkable daily progress! 🌟';
    advice = `Today we are focusing on ${daySchedule?.title || focus}. Take your time and celebrate every small win!`;
    quote = 'Every phrase you speak brings you closer to native fluency.';
  } else if (personality === 'academic' || personality === 'strict') {
    greeting = 'Focus Check: Daily Precision Practice 🎯';
    advice = `Your current weak area is ${focus}. Pay close attention to grammar rules and sentence endings today.`;
    quote = 'Precision in structure creates confidence in speech.';
  } else if (personality === 'casual') {
    greeting = 'Hey there! Ready for a quick practice session? ☕';
    advice = `Let's tackle ${daySchedule?.title || 'some quick dialogues'}. 15 minutes and you're done for the day!`;
    quote = 'Language learning is just chatting with new friends.';
  } else if (personality === 'socratic') {
    greeting = 'Reflective Question for Today 🧠';
    advice = `Before starting ${daySchedule?.title || 'the lesson'}, ask yourself: how would you express your main goal in ${targetLang}?`;
    quote = 'True understanding comes from active curiosity.';
  }

  return {
    greeting,
    advice,
    focusSkill: focus,
    recommendedAction: `Start Today's Lesson: ${daySchedule?.title || 'Daily Session'}`,
    motivationQuote: quote,
    tone: personality,
  };
}

// ==========================================
// Backwards Compatibility Functions
// ==========================================

export async function generateStudyPlan(
  profile: Partial<UserProfile>,
  targetLanguage: string,
  nativeLanguage: string
): Promise<StudyPlan> {
  const targetName = targetLanguage || profile.target_languages?.[0] || 'Spanish';
  const nativeName = nativeLanguage || profile.native_language || 'English';

  return {
    id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    userId: profile.id || 'guest-user',
    targetLanguage: targetName,
    nativeLanguage: nativeName,
    title: `Personalized ${targetName} Mastery Plan`,
    goal: profile.motivation || 'Fluency & Conversational Confidence',
    currentLevel: profile.last_assessment?.level || 'A1',
    modules: [
      {
        id: 'mod-1',
        title: 'Foundations & Essential Vocabulary',
        description: 'Master core greetings, essential verbs, and everyday expressions.',
        focus: 'Vocabulary & Pronunciation',
        lessonIds: ['lesson-1', 'lesson-2', 'lesson-3'],
        completedCount: 1,
        totalLessons: 3,
      },
      {
        id: 'mod-2',
        title: 'Conversational Grammar & Sentence Building',
        description: 'Construct complete sentences with present tense and common prepositions.',
        focus: 'Grammar & Dialogue',
        lessonIds: ['lesson-4', 'lesson-5'],
        completedCount: 0,
        totalLessons: 2,
      },
    ],
    estimatedWeeks: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function getCoachAdvice(
  profile: Partial<UserProfile>,
  topic?: string
): Promise<string> {
  const personality = profile.coach_personality || 'encouraging';
  return `As your ${personality} AI Coach, I recommend focusing 15 minutes today on conversational phrases. You are making steady progress!`;
}
