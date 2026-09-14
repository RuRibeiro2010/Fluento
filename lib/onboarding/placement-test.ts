import { PlacementTestQuestion, PlacementTestResult } from '@/types/onboarding';

export const PLACEMENT_TEST_QUESTIONS: Record<string, PlacementTestQuestion[]> = {
  es: [
    {
      id: 1,
      levelTarget: 'A1',
      questionText: 'Completa la frase con la opción correcta:',
      context: 'Hola, yo ___ estudiante de español y me gusta aprender cada día.',
      options: [
        { id: 'a', text: 'soy', isCorrect: true },
        { id: 'b', text: 'estoy', isCorrect: false },
        { id: 'c', text: 'tengo', isCorrect: false },
        { id: 'd', text: 'fui', isCorrect: false },
      ],
      explanation: 'Uso correcto del verbo "ser" para identidad u profesión (yo soy estudiante).',
    },
    {
      id: 2,
      levelTarget: 'A2',
      questionText: 'Elige la forma verbal adecuada para el pasado:',
      context: 'Ayer Juan y María ___ al supermercado a comprar fruta fresca.',
      options: [
        { id: 'a', text: 'fueron', isCorrect: true },
        { id: 'b', text: 'van', isCorrect: false },
        { id: 'c', text: 'irían', isCorrect: false },
        { id: 'd', text: 'iban', isCorrect: false },
      ],
      explanation: 'Pretérito perfecto simple de "ir" para una acción completada en el pasado específico ("Ayer").',
    },
    {
      id: 3,
      levelTarget: 'B1',
      questionText: 'Selecciona la opción con la estructura de subjuntivo correcta:',
      context: 'Es muy importante que tú ___ todos los días para hablar con fluidez.',
      options: [
        { id: 'a', text: 'practiques', isCorrect: true },
        { id: 'b', text: 'practicas', isCorrect: false },
        { id: 'c', text: 'practicar', isCorrect: false },
        { id: 'd', text: 'practicaste', isCorrect: false },
      ],
      explanation: 'Expresiones impersonales de importancia ("Es importante que...") requieren subjuntivo presente.',
    },
  ],
  fr: [
    {
      id: 1,
      levelTarget: 'A1',
      questionText: 'Choisissez le mot correct pour compléter la phrase :',
      context: 'Bonjour ! Je ___ un nouvel élève et je parle un peu français.',
      options: [
        { id: 'a', text: 'suis', isCorrect: true },
        { id: 'b', text: 'es', isCorrect: false },
        { id: 'c', text: 'ai', isCorrect: false },
        { id: 'd', text: 'fait', isCorrect: false },
      ],
      explanation: 'Conjugaison du verbe être à la première personne du singulier (Je suis).',
    },
    {
      id: 2,
      levelTarget: 'A2',
      questionText: 'Choisissez le bon temps du passé :',
      context: 'Hier soir, nous ___ un délicieux dîner au restaurant.',
      options: [
        { id: 'a', text: 'avons mangé', isCorrect: true },
        { id: 'b', text: 'mangeons', isCorrect: false },
        { id: 'c', text: 'mangerons', isCorrect: false },
        { id: 'd', text: 'mangions', isCorrect: false },
      ],
      explanation: 'Utilisation du passé composé pour une action ponctuelle et terminée dans le passé.',
    },
    {
      id: 3,
      levelTarget: 'B1',
      questionText: 'Sélectionnez la forme correcte du subjonctif :',
      context: 'Il faut que tu ___ ce livre avant la prochaine leçon.',
      options: [
        { id: 'a', text: 'lises', isCorrect: true },
        { id: 'b', text: 'lis', isCorrect: false },
        { id: 'c', text: 'liras', isCorrect: false },
        { id: 'd', text: 'lu', isCorrect: false },
      ],
      explanation: 'Après la locution "il faut que", on utilise obligatoirement le subjonctif.',
    },
  ],
  de: [
    {
      id: 1,
      levelTarget: 'A1',
      questionText: 'Wählen Sie das passende Verb aus:',
      context: 'Hallo! Ich ___ Deutsch und möchte fließend sprechen.',
      options: [
        { id: 'a', text: 'lerne', isCorrect: true },
        { id: 'b', text: 'lernt', isCorrect: false },
        { id: 'c', text: 'lernen', isCorrect: false },
        { id: 'd', text: 'gelernt', isCorrect: false },
      ],
      explanation: 'Subjekt-Verb-Kongruenz für "Ich" im Präsens (Ich lerne).',
    },
    {
      id: 2,
      levelTarget: 'A2',
      questionText: 'Wählen Sie die richtige Präposition mit Dativ:',
      context: 'Wir fahren morgen mit ___ Zug nach Berlin.',
      options: [
        { id: 'a', text: 'dem', isCorrect: true },
        { id: 'b', text: 'den', isCorrect: false },
        { id: 'c', text: 'der', isCorrect: false },
        { id: 'd', text: 'das', isCorrect: false },
      ],
      explanation: 'Die Präposition "mit" verlangt immer den Dativ (mit dem Zug).',
    },
    {
      id: 3,
      levelTarget: 'B1',
      questionText: 'Wählen Sie die korrekte Nebensatz-Wortstellung:',
      context: 'Ich lerne jeden Tag Deutsch, weil ich in Deutschland ___ .',
      options: [
        { id: 'a', text: 'arbeiten möchte', isCorrect: true },
        { id: 'b', text: 'möchte arbeiten', isCorrect: false },
        { id: 'c', text: 'arbeiten arbeiten', isCorrect: false },
        { id: 'd', text: 'möchte arbeiten zu', isCorrect: false },
      ],
      explanation: 'In Nebensätzen mit "weil" steht das konjugierte Modalverb ganz am Ende.',
    },
  ],
  en: [
    {
      id: 1,
      levelTarget: 'A1',
      questionText: 'Choose the correct form of the verb "to be":',
      context: 'Hello, I ___ excited to learn new vocabulary today!',
      options: [
        { id: 'a', text: 'am', isCorrect: true },
        { id: 'b', text: 'is', isCorrect: false },
        { id: 'c', text: 'are', isCorrect: false },
        { id: 'd', text: 'be', isCorrect: false },
      ],
      explanation: 'The first person singular form of "to be" is "am".',
    },
    {
      id: 2,
      levelTarget: 'A2',
      questionText: 'Choose the correct past simple tense:',
      context: 'Last weekend, we ___ a great film at the cinema.',
      options: [
        { id: 'a', text: 'watched', isCorrect: true },
        { id: 'b', text: 'watch', isCorrect: false },
        { id: 'c', text: 'watching', isCorrect: false },
        { id: 'd', text: 'watches', isCorrect: false },
      ],
      explanation: 'Regular past simple verbs end in "-ed" for completed time periods like "Last weekend".',
    },
    {
      id: 3,
      levelTarget: 'B1',
      questionText: 'Select the correct conditional sentence structure:',
      context: 'If I had more free time, I ___ another foreign language.',
      options: [
        { id: 'a', text: 'would learn', isCorrect: true },
        { id: 'b', text: 'will learn', isCorrect: false },
        { id: 'c', text: 'learned', isCorrect: false },
        { id: 'd', text: 'have learned', isCorrect: false },
      ],
      explanation: 'Second conditional (unreal present condition): "If + past simple, would + base verb".',
    },
  ],
};

// Fallback questions for any other language (e.g. Portuguese, Italian, Japanese)
const DEFAULT_QUESTIONS: PlacementTestQuestion[] = [
  {
    id: 1,
    levelTarget: 'A1',
    questionText: 'Basic Greetings & Everyday Vocabulary:',
    context: 'Select the most natural greeting when meeting someone for the first time:',
    options: [
      { id: 'a', text: 'Hello! Nice to meet you.', isCorrect: true },
      { id: 'b', text: 'Goodbye yesterday.', isCorrect: false },
      { id: 'c', text: 'Please table chair.', isCorrect: false },
      { id: 'd', text: 'Tomorrow thanks.', isCorrect: false },
    ],
    explanation: 'Standard polite greeting when introduced to someone.',
  },
  {
    id: 2,
    levelTarget: 'A2',
    questionText: 'Past Experience & Time Expressions:',
    context: 'Which sentence correctly describes an event that happened yesterday?',
    options: [
      { id: 'a', text: 'I completed my practice lesson yesterday.', isCorrect: true },
      { id: 'b', text: 'I complete my practice lesson yesterday.', isCorrect: false },
      { id: 'c', text: 'I will complete my lesson yesterday.', isCorrect: false },
      { id: 'd', text: 'I completing my lesson yesterday.', isCorrect: false },
    ],
    explanation: 'Past tense is required when referencing "yesterday".',
  },
  {
    id: 3,
    levelTarget: 'B1',
    questionText: 'Expressing Opinions & Future Hypotheses:',
    context: 'Complete the sentence with the appropriate connector:',
    options: [
      { id: 'a', text: 'Although it was raining, we enjoyed our city tour.', isCorrect: true },
      { id: 'b', text: 'Because it was raining, we enjoyed our city tour without umbrellas.', isCorrect: false },
      { id: 'c', text: 'So it was raining, we enjoyed.', isCorrect: false },
      { id: 'd', text: 'Unless it was raining, we enjoyed.', isCorrect: false },
    ],
    explanation: '"Although" expresses contrast between raining and enjoying the outdoor tour.',
  },
];

export function getPlacementQuestions(langCode: string): PlacementTestQuestion[] {
  return PLACEMENT_TEST_QUESTIONS[langCode] || DEFAULT_QUESTIONS;
}

export function evaluatePlacementTest(
  answers: Record<number, string>,
  questions: PlacementTestQuestion[]
): PlacementTestResult {
  let correctCount = 0;
  const strengths: string[] = [];

  questions.forEach((q) => {
    const selectedOptionId = answers[q.id];
    const correctOption = q.options.find((o) => o.isCorrect);
    if (selectedOptionId === correctOption?.id) {
      correctCount++;
      if (q.levelTarget === 'A1') strengths.push('Basic Vocabulary & Greetings');
      if (q.levelTarget === 'A2') strengths.push('Past Tense & Time Markers');
      if (q.levelTarget === 'B1') strengths.push('Complex Clauses & Mood Control');
    }
  });

  let assignedLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' = 'A1';
  let recommendedFocus = 'Building fundamental vocabulary, daily greetings & pronunciation.';

  if (correctCount === 1) {
    assignedLevel = 'A2';
    recommendedFocus = 'Sentence formation, present & past simple tenses, and travel dialogues.';
  } else if (correctCount === 2) {
    assignedLevel = 'B1';
    recommendedFocus = 'Conversational spontaneity, expanding topic vocabulary & listening mastery.';
  } else if (correctCount === 3) {
    assignedLevel = 'B2';
    recommendedFocus = 'Nuanced grammar, idiomatic expressions, business & abstract discussions.';
  }

  return {
    assignedLevel,
    score: Math.round((correctCount / questions.length) * 100),
    totalQuestions: questions.length,
    strengths: strengths.length > 0 ? strengths : ['Motivation to Start Learning'],
    recommendedFocus,
  };
}
