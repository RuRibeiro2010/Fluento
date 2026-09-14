import {
  ConversationSession,
  TeacherInternalReflection,
} from '@/types/teacher';

/**
 * AI Reflection Module (Virtual Teacher Metacognition)
 *
 * After each lesson/session, the Virtual Teacher evaluates their own performance
 * and the student's engagement across key pedagogical metrics:
 * 1. Did the student speak sufficiently (~70% target talk time)?
 * 2. Was the lesson objective met?
 * 3. Did the teacher over-explain or monologue (>30-35% talk time)?
 * 4. Did the teacher over-correct and disrupt flow?
 * 5. How should the next session be adapted for this student profile?
 */

export function reflectOnSession(session: ConversationSession): TeacherInternalReflection {
  const userMessages = session.messages.filter((m) => m.sender === 'user');
  const teacherMessages = session.messages.filter((m) => m.sender === 'teacher');

  // Word count calculations
  const totalUserWords = userMessages.reduce((sum, m) => sum + m.text.trim().split(/\s+/).length, 0);
  const totalTeacherWords = teacherMessages.reduce((sum, m) => sum + m.text.trim().split(/\s+/).length, 0);
  const combinedWords = totalUserWords + totalTeacherWords || 1;

  const studentTalkRatioPercentage = Math.round((totalUserWords / combinedWords) * 100);
  const targetRatioAchieved = studentTalkRatioPercentage >= 60; // 60-70%+ is healthy student talk ratio

  // Over-explanation detection: Teacher average turn length > 35 words or teacher talk ratio > 40%
  const avgTeacherTurnLength = teacherMessages.length > 0 ? totalTeacherWords / teacherMessages.length : 0;
  const overExplanationDetected = avgTeacherTurnLength > 35 || studentTalkRatioPercentage < 55;

  // Over-correction detection: More than 1 correction per 2 user turns
  let totalCorrections = 0;
  session.messages.forEach((m) => {
    if (m.corrections) totalCorrections += m.corrections.length;
  });
  const overCorrectionDetected = userMessages.length > 0 && totalCorrections / userMessages.length > 0.6;

  // Emotional trajectory observation based on session signals
  let observedEmotionalTrajectory = 'O aluno manteve um ritmo constante e confiante.';
  if (session.emotionalStateHistory && session.emotionalStateHistory.length > 0) {
    const history = session.emotionalStateHistory;
    const initial = history[0];
    const final = history[history.length - 1];

    if (initial === 'nervous' && (final === 'confident' || final === 'relaxed')) {
      observedEmotionalTrajectory = 'Iniciou com ansiedade, mas ganhou confiança com o apoio gradual do professor.';
    } else if (history.includes('short_answers')) {
      observedEmotionalTrajectory = 'Mostrou tendência para respostas curtas. Beneficiou de perguntas abertas inspiradoras.';
    } else if (history.includes('blocked')) {
      observedEmotionalTrajectory = 'Bloqueou pontualmente, tendo sido desbloqueado com pistas progressivas sem pressão.';
    }
  }

  // Key pedagogical takeaway
  let keyPedagogicalTakeaway = '';
  if (studentTalkRatioPercentage >= 70) {
    keyPedagogicalTakeaway = 'Excelente rácio de conversação. O aluno dominou o tempo de fala e expressou-se ativamente.';
  } else if (overExplanationDetected) {
    keyPedagogicalTakeaway = 'O professor estendeu-se em explicações. Nas próximas sessões, encurtar intervenções para dar mais espaço ao aluno.';
  } else {
    keyPedagogicalTakeaway = 'Sessão equilibrada com bom envolvimento e fluxo comunicativo.';
  }

  // Adaptation strategy for next session
  let adaptationStrategyForNextSession = '';
  if (overCorrectionDetected) {
    adaptationStrategyForNextSession = 'Adotar modo de correção diferida (buffered corrections) para proteger o estado de fluxo do aluno.';
  } else if (studentTalkRatioPercentage < 65) {
    adaptationStrategyForNextSession = 'Utilizar perguntas abertas de opinião ("O que achas de...", "Por que razão...") que convidem a respostas mais longas.';
  } else {
    adaptationStrategyForNextSession = 'Manter o ritmo atual e introduzir gradualmente vocabulário de nível ligeiramente superior.';
  }

  return {
    studentTalkRatioPercentage,
    targetRatioAchieved,
    objectiveAchieved: userMessages.length >= 3,
    overExplanationDetected,
    overCorrectionDetected,
    observedEmotionalTrajectory,
    keyPedagogicalTakeaway,
    adaptationStrategyForNextSession,
  };
}
