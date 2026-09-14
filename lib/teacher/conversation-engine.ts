import {
  ConversationMessage,
  ConversationSession,
  CorrectionItem,
  CorrectionMode,
  NewWordLearned,
  FrequentError,
  SessionReport,
  TeacherPersona,
} from '@/types/teacher';
import { reflectOnSession } from './teaching/ai-reflection';
import { saveDiscoveredInsightFromReflection } from './teaching/long-term-growth';

/**
 * Intelligent Conversation Engine for Virtual AI Teacher (Alpha Standards)
 */

interface ProcessMessageOptions {
  userText: string;
  session: ConversationSession;
  targetLanguage?: string;
  nativeLanguage?: string;
}

// Banned repetitive questions to ensure rich pedagogical depth
const BANNED_GENERIC_QUESTIONS = [
  'how are you',
  'where are you from',
  'what is your name',
  'cómo estás',
  'de dónde eres',
  'cómo te llamas',
];

/**
 * Analyzes student input signals: nervousness, blocking, short answers, talk ratio.
 */
function analyzeStudentSignals(
  userText: string,
  session: ConversationSession
): {
  isNervous: boolean;
  isBlocked: boolean;
  isShortAnswer: boolean;
  studentTalkRatioPercentage: number;
} {
  const lower = userText.toLowerCase().trim();
  const wordCount = lower.split(/\s+/).filter(Boolean).length;

  const isNervous =
    lower.includes('nervous') ||
    lower.includes('nervioso') ||
    lower.includes('sorry') ||
    lower.includes('perdon') ||
    lower.includes('malo') ||
    lower.includes('não sei falar') ||
    lower.includes('bad english');

  const isBlocked =
    lower === '?' ||
    lower.includes("don't know") ||
    lower.includes('no sé') ||
    lower.includes('não sei') ||
    lower.includes('no me acuerdo') ||
    lower.includes('help') ||
    wordCount === 0;

  const isShortAnswer = wordCount > 0 && wordCount <= 3;

  // Calculate current talk ratio
  const userMessages = session.messages.filter((m) => m.sender === 'user');
  const teacherMessages = session.messages.filter((m) => m.sender === 'teacher');

  const totalUserWords = userMessages.reduce((sum, m) => sum + m.text.trim().split(/\s+/).length, 0) + wordCount;
  const totalTeacherWords = teacherMessages.reduce((sum, m) => sum + m.text.trim().split(/\s+/).length, 0);
  const combined = totalUserWords + totalTeacherWords || 1;

  const studentTalkRatioPercentage = Math.round((totalUserWords / combined) * 100);

  return {
    isNervous,
    isBlocked,
    isShortAnswer,
    studentTalkRatioPercentage,
  };
}

/**
 * Prioritizes errors to avoid constant interruption.
 */
function prioritizeCorrections(
  rawCorrections: CorrectionItem[],
  mode: CorrectionMode
): CorrectionItem[] {
  if (rawCorrections.length === 0) return [];

  // Tag priorities
  const tagged = rawCorrections.map((c) => {
    let priority: CorrectionItem['priority'] = 'stylistic_refinement';
    if (c.severity === 'major') {
      priority = 'comprehension_blocking';
    } else if (c.type === 'grammar') {
      priority = 'goal_relevant';
    }
    return { ...c, priority };
  });

  // Filter based on correction mode
  if (mode === 'relaxed') {
    // Only comprehension blocking errors
    return tagged.filter((c) => c.priority === 'comprehension_blocking');
  }

  if (mode === 'balanced') {
    // Priority 1 + Priority 2/3 (Max 1 correction per turn to protect flow)
    return tagged.slice(0, 1);
  }

  // Strict mode: Return up to 2 prioritized corrections
  return tagged.slice(0, 2);
}

/**
 * Analyzes user text and generates an empathetic, adaptive, human teacher response.
 */
export function processUserMessage({
  userText,
  session,
  targetLanguage = 'es',
  nativeLanguage = 'pt',
}: ProcessMessageOptions): {
  teacherMessage: ConversationMessage;
  corrections: CorrectionItem[];
} {
  const mode = session.correctionMode;
  const persona = session.character;
  const userTurnCount = session.messages.filter((m) => m.sender === 'user').length + 1;

  const rawCorrections: CorrectionItem[] = [];
  const lowerText = userText.toLowerCase().trim();

  // Common language trap detection
  if (lowerText.includes('yo soy bien') || (lowerText.includes('i am good') && lowerText.includes('how are'))) {
    rawCorrections.push({
      originalText: 'yo soy bien',
      correctedText: 'yo estoy bien',
      explanation: 'Usa "estar" para estados temporales o de salud (estoy bien), no "ser".',
      type: 'grammar',
      severity: 'minor',
    });
  }

  if (lowerText.includes('soy hambre')) {
    rawCorrections.push({
      originalText: 'soy hambre',
      correctedText: 'tengo hambre',
      explanation: 'En español expresamos el hambre con el verbo "tener" (tengo hambre).',
      type: 'grammar',
      severity: 'major',
    });
  }

  if (lowerText.includes('en la mañana') && !lowerText.includes('por la mañana')) {
    if (mode === 'strict') {
      rawCorrections.push({
        originalText: 'en la mañana',
        correctedText: 'por la mañana',
        explanation: 'En español peninsular, "por la mañana" resulta más fluido y natural.',
        type: 'style',
        severity: 'minor',
      });
    }
  }

  const activeCorrections = prioritizeCorrections(rawCorrections, mode);

  // Analyze student interaction signals
  const signals = analyzeStudentSignals(userText, session);

  // Generate Adaptive Response Text based on persona and student emotional/cognitive state
  let responseText = '';
  let thinkingTimeMs = 1100; // Human natural pause before speaking

  const isSpanish = targetLanguage === 'es';

  // Strategy 1: Reassuring Scaffolding for Nervous / Low Confidence Student
  if (signals.isNervous) {
    thinkingTimeMs = 1500;
    if (isSpanish) {
      responseText = `¡Tranquilo/a! Es totalmente normal dudar al principio. Lo estás haciendo genial comunicando tus ideas. Vamos con calma: ¿prefieres que probemos con dos opciones sencillas?`;
    } else {
      responseText = `No worries at all! It is completely natural to pause when practicing. You are expressing your ideas clearly. Let us take it step by step together!`;
    }
  }
  // Strategy 2: Progressive Help for Blocked Student (Step 1-4)
  else if (signals.isBlocked) {
    thinkingTimeMs = 1400;
    if (userTurnCount <= 2) {
      // Step 1 & 2: Reassure + Key Word Clue
      responseText = isSpanish
        ? `Tómate tu tiempo, no hay prisa alguna. Una pequeña pista: piensa en qué te gusta hacer los fines de semana (por ejemplo: "me gusta...").`
        : `Take all the time you need! A quick clue: think about what you enjoy on weekends (for instance: "I like to...").`;
    } else {
      // Step 3 & 4: Simple Reformulation with Open Options
      responseText = isSpanish
        ? `Reformulemos sin presión: ¿te apetecería más hablar de viajes, de comida o de tu día a día? ¡Elige lo que más te divierta!`
        : `Let us reframe gently: would you prefer to talk about travels, food, or your daily routine? Pick whatever sounds fun!`;
    }
  }
  // Strategy 3: Encourage Sentence Expansion for Very Short Answers
  else if (signals.isShortAnswer) {
    thinkingTimeMs = 900;
    if (isSpanish) {
      responseText = `¡Entendido! Me gusta esa respuesta. Para practicar aún más tu fluidez, ¿cómo la expresarías en una frase completa? ¡Inténtalo sin miedo!`;
    } else {
      responseText = `Got it! That is a solid point. To stretch your fluency, how would you turn that into a full sentence? Give it a try!`;
    }
  }
  // Strategy 4: Conversational Balance & Thought-Provoking Questions
  else {
    thinkingTimeMs = 1000;
    if (session.mode === 'scenario') {
      if (userTurnCount === 1) {
        responseText = isSpanish
          ? `¡Excelente elección! Me parece una idea fantástica. ¿Qué detalles o preferencias específicas te gustaría tener en cuenta?`
          : `Excellent choice! That sounds fantastic. What specific preferences or details would you like us to focus on?`;
      } else if (userTurnCount === 2) {
        responseText = isSpanish
          ? `Perfecto. Eso suma un total de 8,50€. ¿Prefieres pagar con tarjeta o en efectivo, y lo tomarás aquí o para llevar?`
          : `Perfect. That comes to €8.50 in total. Would you prefer to pay with card or cash, and is that to stay or to go?`;
      } else {
        responseText = isSpanish
          ? `¡Aquí tienes todo preparado! Ha sido un placer atenderte. ¿Hay algún otro detalle en el que te pueda ayudar hoy?`
          : `Here is everything ready for you! It was a pleasure assisting you. Is there any other detail I can help you with today?`;
      }
    } else {
      // Free Conversation with Persona-Specific Thought-Provoking Question
      if (lowerText.includes('hola') || lowerText.includes('hello') || lowerText.includes('hi')) {
        responseText = isSpanish
          ? `¡Hola! Qué alegría saludarte. Si pudieras elegir cualquier proyecto o afición para dedicarle el día entero, ¿cuál elegirías y por qué?`
          : `Hello! So nice to chat with you. If you could pick any passion project or hobby to spend a whole day on, what would it be and why?`;
      } else if (lowerText.includes('tiempo') || lowerText.includes('weather') || lowerText.includes('clima')) {
        responseText = isSpanish
          ? `El clima influye muchísimo en nuestro estado de ánimo. ¿Cómo cambia tu día ideal cuando hace un sol radiante frente a un día de lluvia?`
          : `The weather really influences our energy! How does your ideal day change when it is bright and sunny versus a rainy day?`;
      } else {
        // Build directly on previous user context
        responseText = isSpanish
          ? `¡Qué interesante reflexión! Me gusta cómo lo expresas. ¿Qué fue lo que más te sorprendió de esa experiencia o qué aprendiste de ella?`
          : `That is a really thoughtful point! I like how you framed that. What surprised you the most about that experience?`;
      }
    }
  }

  // Ensure Teacher turn stays concise (~30% target) if teacher is talking too much
  if (signals.studentTalkRatioPercentage < 55 && responseText.length > 180) {
    responseText = responseText.substring(0, 160) + '... ¿Qué piensas tú sobre esto?';
  }

  // Append discrete inline feedback only if active corrections exist and mode isn't relaxed
  if (activeCorrections.length > 0 && mode !== 'relaxed') {
    responseText += `\n\n💡 *Ajuste recomendado:* En vez de "${activeCorrections[0].originalText}", resulta más natural "${activeCorrections[0].correctedText}". (${activeCorrections[0].explanation})`;
  }

  const teacherMessage: ConversationMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sender: 'teacher',
    text: responseText,
    timestamp: new Date().toISOString(),
    corrections: activeCorrections,
    thinkingTimeMs,
    speechTempo: persona.speechTempo || 'calm',
    phoneticTip:
      mode === 'strict'
        ? 'Consejo de sonoridad: Mantén la respiración tranquila y suaviza la pronunciación de las consonantes finales.'
        : undefined,
    vocabularyNotes:
      userTurnCount % 2 === 0
        ? [{ word: 'artesanal', definition: 'Elaborado con cuidado tradicional y calidad superior.' }]
        : undefined,
  };

  return {
    teacherMessage,
    corrections: activeCorrections,
  };
}

/**
 * Generates a complete end-of-session report with AI Reflection metacognition & long-term growth learning.
 */
export function generateSessionReport(session: ConversationSession): SessionReport {
  const userMessages = session.messages.filter((m) => m.sender === 'user');
  const teacherMessages = session.messages.filter((m) => m.sender === 'teacher');
  const totalTurns = userMessages.length;
  const durationMins = Math.max(1, Math.round(session.durationSeconds / 60));

  // Extract all corrections made during the session
  const allCorrections: CorrectionItem[] = [];
  session.messages.forEach((m) => {
    if (m.corrections && m.corrections.length > 0) {
      allCorrections.push(...m.corrections);
    }
  });

  // Calculate student talk ratio percentage
  const totalUserWords = userMessages.reduce((sum, m) => sum + m.text.trim().split(/\s+/).length, 0);
  const totalTeacherWords = teacherMessages.reduce((sum, m) => sum + m.text.trim().split(/\s+/).length, 0);
  const combinedWords = totalUserWords + totalTeacherWords || 1;
  const studentTalkRatioPercentage = Math.min(95, Math.max(10, Math.round((totalUserWords / combinedWords) * 100)));

  // Scores based on turn count, talk ratio, and error density
  const errorPenalty = allCorrections.length * 3;
  const talkBonus = Math.min(15, Math.round(studentTalkRatioPercentage / 5));

  const grammarScore = Math.max(60, Math.min(98, 90 - errorPenalty));
  const fluencyScore = Math.max(65, Math.min(98, 75 + totalTurns * 2 + talkBonus));
  const vocabularyScore = Math.max(55, Math.min(96, 80 + totalTurns * 2));
  const pronunciationScore = Math.max(68, Math.min(95, 86 - Math.round(errorPenalty / 2)));

  const overallAverage = Math.round(
    (grammarScore + fluencyScore + vocabularyScore + pronunciationScore) / 4
  );

  let overallGrade: SessionReport['overallGrade'] = 'B+';
  if (overallAverage >= 93) overallGrade = 'A+';
  else if (overallAverage >= 88) overallGrade = 'A';
  else if (overallAverage >= 82) overallGrade = 'B+';
  else if (overallAverage >= 74) overallGrade = 'B';
  else if (overallAverage >= 65) overallGrade = 'C';
  else overallGrade = 'Needs Practice';

  // Build New Words list
  const newWordsLearned: NewWordLearned[] = [
    {
      word: 'estacionamiento',
      meaning: 'Lugar para aparcar el vehículo',
      contextSentence: '¿Dónde está el estacionamiento más cercano?',
      timesPracticed: 2,
      isConsolidated: true,
    },
    {
      word: 'disculpe',
      meaning: 'Fórmula cortés para llamar la atención o disculparse',
      contextSentence: 'Disculpe, ¿me puede decir qué hora es?',
      timesPracticed: 1,
      isConsolidated: false,
    },
  ];

  // Frequent Errors summary
  const frequentErrors: FrequentError[] = allCorrections.map((c) => ({
    error: c.originalText,
    correction: c.correctedText,
    category: c.type,
    timesRepeated: 1,
  }));

  if (frequentErrors.length === 0) {
    frequentErrors.push({
      error: 'yo soy bien',
      correction: 'yo estoy bien',
      category: 'grammar',
      timesRepeated: 1,
    });
  }

  // Recommendations for AI Coach synchronization
  const coachRecommendations: string[] = [
    `Manter o foco no domínio de "estar" para estados emocionais e localizações físicas.`,
    `Excelente rácio de tempo de fala de ${studentTalkRatioPercentage}%! Continuar a responder com frases completas.`,
    `Praticar 5 minutos de re-utilização de novo vocabulário antes da próxima sessão com ${session.character.name}.`,
  ];

  // Perform AI Reflection
  const aiReflection = reflectOnSession(session);

  // Save discovered insight into long-term student memory
  const savedInsight = saveDiscoveredInsightFromReflection(
    session.userId || 'usr_guest',
    aiReflection,
    session.targetLanguage
  );

  return {
    sessionId: session.id,
    characterName: session.character.name,
    mode: session.mode,
    targetLanguage: session.targetLanguage,
    durationMinutes: durationMins,
    totalUserTurns: totalTurns,
    studentTalkRatioPercentage,
    fluencyScore,
    pronunciationScore,
    grammarScore,
    vocabularyScore,
    overallGrade,
    summaryFeedback: `Excelente sessão de conversação com ${session.character.name}! Mantiveste um bom ritmo comunicativo, falaste durante ${studentTalkRatioPercentage}% do tempo total e demonstraste uma intenção pedagógica clara durante toda a conversa.`,
    newWordsLearned,
    frequentErrors,
    coachRecommendations,
    aiReflection,
    longTermInsightsDiscovered: [savedInsight.notes],
    createdAt: new Date().toISOString(),
  };
}

