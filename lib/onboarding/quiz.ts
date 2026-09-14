import { QuizQuestion, CategoryType } from '@/types/onboarding';

export const UI_LANGUAGES = [
  { label: 'English', value: 'en', flag: '🇬🇧' },
  { label: 'Português', value: 'pt', flag: '🇵🇹' },
  { label: 'Español', value: 'es', flag: '🇪🇸' },
  { label: 'Français', value: 'fr', flag: '🇫🇷' },
  { label: 'Deutsch', value: 'de', flag: '🇩🇪' },
];

export const ONBOARDING_QUESTIONS: QuizQuestion[] = [
  // 1. UI Language Choice
  {
    id: 'ui_language',
    category: 'ui_language',
    question: {
      en: 'Choose your preferred app language',
      pt: 'Escolha a língua da interface',
      es: 'Elige el idioma de la aplicación',
      fr: "Choisissez la langue de l'application",
      de: 'Wählen Sie Ihre App-Sprache',
    },
    subtitle: {
      en: 'All menus, buttons, and instructions will be shown in this language.',
      pt: 'Todos os menus, botões e instruções serão exibidos nesta língua.',
      es: 'Todos los menús y botones se mostrarán en este idioma.',
      fr: 'Tous les menus et instructions seront affichés dans cette langue.',
      de: 'Alle Menüs und Anweisungen werden in dieser Sprache angezeigt.',
    },
    options: [
      { label: 'English 🇬🇧', value: 'en', description: 'Interface in English' },
      { label: 'Português 🇵🇹 / 🇧🇷', value: 'pt', description: 'Interface em Português' },
      { label: 'Español 🇪🇸', value: 'es', description: 'Interfaz en Español' },
      { label: 'Français 🇫🇷', value: 'fr', description: 'Interface en Français' },
      { label: 'Deutsch 🇩🇪', value: 'de', description: 'Benutzeroberfläche auf Deutsch' },
    ],
  },

  // 2. Native Language
  {
    id: 'native_language',
    category: 'native_language',
    question: {
      en: 'What is your native language?',
      pt: 'Qual é a sua língua materna?',
      es: '¿Cuál es tu idioma materno?',
      fr: 'Quelle est votre langue maternelle ?',
      de: 'Was ist Ihre Muttersprache?',
    },
    subtitle: {
      en: 'Explanations and grammar comparisons will align with your native tongue.',
      pt: 'Explicações e comparações gramaticais serão ajustadas à sua língua materna.',
      es: 'Las explicaciones y gramática se adaptarán a tu idioma materno.',
      fr: 'Les explications et la grammaire seront adaptées à votre langue.',
      de: 'Erklärungen werden auf Ihre Muttersprache abgestimmt.',
    },
    options: [
      { label: 'English', value: 'en', icon: '🇬🇧' },
      { label: 'Português', value: 'pt', icon: '🇵🇹' },
      { label: 'Español', value: 'es', icon: '🇪🇸' },
      { label: 'Français', value: 'fr', icon: '🇫🇷' },
      { label: 'Deutsch', value: 'de', icon: '🇩🇪' },
      { label: 'Italiano', value: 'it', icon: '🇮🇹' },
      { label: 'Русский', value: 'ru', icon: '🇷🇺' },
      { label: '中文', value: 'zh', icon: '🇨🇳' },
      { label: '日本語', value: 'ja', icon: '🇯🇵' },
    ],
  },

  // 3. Target Languages (Multi-select)
  {
    id: 'target_languages',
    category: 'target_language',
    allowMultiple: true,
    question: {
      en: 'Which language(s) do you want to learn?',
      pt: 'Que língua(s) deseja aprender?',
      es: '¿Qué idioma(s) quieres aprender?',
      fr: 'Quelle(s) langue(s) souhaitez-vous apprendre ?',
      de: 'Welche Sprache(n) möchten Sie lernen?',
    },
    subtitle: {
      en: 'Select one or multiple languages. You can switch anytime.',
      pt: 'Selecione uma ou mais línguas. Pode alterar quando quiser.',
      es: 'Selecciona uno o varios idiomas. Puedes cambiar en cualquier momento.',
      fr: 'Sélectionnez une ou plusieurs langues. Modifiable à tout moment.',
      de: 'Wählen Sie eine oder mehrere Sprachen aus.',
    },
    options: [
      { label: 'English', value: 'en', icon: '🇬🇧', description: 'Global business & casual fluency' },
      { label: 'Spanish', value: 'es', icon: '🇪🇸', description: 'Spanish for travel & conversation' },
      { label: 'French', value: 'fr', icon: '🇫🇷', description: 'French for culture, art & career' },
      { label: 'German', value: 'de', icon: '🇩🇪', description: 'German for work & living in Europe' },
      { label: 'Italian', value: 'it', icon: '🇮🇹', description: 'Italian for passion, food & travel' },
      { label: 'Portuguese', value: 'pt', icon: '🇵🇹', description: 'European & Brazilian Portuguese' },
      { label: 'Japanese', value: 'ja', icon: '🇯🇵', description: 'Conversational Japanese & kanji' },
      { label: 'Korean', value: 'ko', icon: '🇰🇷', description: 'Korean culture & modern dialogues' },
      { label: 'Mandarin Chinese', value: 'zh', icon: '🇨🇳', description: 'Mandarin business & everyday speech' },
    ],
  },

  // 4. Primary Goal
  {
    id: 'primary_goal',
    category: 'goal',
    question: {
      en: 'What is your primary motivation?',
      pt: 'Qual é o seu objetivo principal?',
      es: '¿Cuál es tu motivación principal?',
      fr: 'Quelle est votre motivation principale ?',
      de: 'Was ist Ihre Hauptmotivation?',
    },
    subtitle: {
      en: 'We will curate daily scenarios aligned with your specific goal.',
      pt: 'Criaremos cenários diários focados no seu objetivo.',
      es: 'Personalizaremos lecciones según tu meta.',
      fr: 'Nous adapterons les leçons à vos objectifs.',
      de: 'Wir passen die Lektionen an Ihre Ziele an.',
    },
    options: [
      {
        label: 'Travel & Vacations',
        value: 'travel',
        badge: 'Popular',
        description: 'Airport, hotels, ordering food, asking directions & local socializing.',
      },
      {
        label: 'Career & Business Growth',
        value: 'career',
        description: 'Work meetings, professional emails, interviews & networking.',
      },
      {
        label: 'Relocation & Moving Abroad',
        value: 'relocation',
        description: 'Living in a new country, official forms, renting & daily integration.',
      },
      {
        label: 'Brain Exercise & Memory',
        value: 'brain',
        description: 'Sharpen cognitive focus, memory retention & linguistic agility.',
      },
      {
        label: 'Culture, Movies & Books',
        value: 'culture',
        description: 'Enjoying original audio, cinema, literature & un-dubbed media.',
      },
      {
        label: 'General Conversational Fluency',
        value: 'fluency',
        description: 'Overcoming speaking hesitation and sounding natural in any context.',
      },
    ],
  },

  // 5. Daily Commitment
  {
    id: 'daily_commitment',
    category: 'time',
    question: {
      en: 'How much time can you spend daily?',
      pt: 'Quanto tempo tem disponível por dia?',
      es: '¿Cuánto tiempo tienes al día?',
      fr: 'Combien de temps avez-vous par jour ?',
      de: 'Wie viel Zeit haben Sie täglich?',
    },
    subtitle: {
      en: 'Consistent daily micro-habits yield faster fluency than long weekend sessions.',
      pt: 'Pequenos hábitos diários garantem melhor progresso do que sessões longas.',
      es: 'Los microhábitos diarios funcionan mejor que sesiones largas un día.',
      fr: 'La régularité quotidienne est la clé du succès.',
      de: 'Tägliche kurze Übungen führen am schnellsten zum Ziel.',
    },
    options: [
      {
        label: '5 minutes / day',
        value: '5',
        badge: 'Casual',
        description: 'Quick bite-sized micro-lessons while waiting in line.',
      },
      {
        label: '15 minutes / day',
        value: '15',
        badge: 'Recommended',
        description: 'Optimal balance of vocabulary, grammar & audio practice.',
      },
      {
        label: '30 minutes / day',
        value: '30',
        badge: 'Fast-Track',
        description: 'Accelerated learning with full conversational simulations.',
      },
      {
        label: '45 minutes / day',
        value: '45',
        badge: 'Intensive',
        description: 'Deep immersion, active audio coaching & error mastery.',
      },
    ],
  },

  // 6. Fluency Level
  {
    id: 'current_level',
    category: 'level',
    question: {
      en: 'What is your estimated proficiency level?',
      pt: 'Qual é o seu nível de conhecimento?',
      es: '¿Cuál es tu nivel de conocimiento?',
      fr: 'Quel est votre niveau actuel ?',
      de: 'Wie schätzen Sie Ihr Sprachniveau ein?',
    },
    subtitle: {
      en: 'Select your level or let our AI perform a 2-minute adaptive test.',
      pt: 'Escolha o seu nível ou faça um teste adaptativo de 2 minutos com a IA.',
      es: 'Selecciona tu nivel o haz un test adaptativo de 2 minutos con IA.',
      fr: 'Choisissez votre niveau ou passez un test adaptatif de 2 min avec IA.',
      de: 'Wählen Sie Ihr Niveau oder machen Sie einen 2-Minuten-AI-Test.',
    },
    options: [
      {
        label: 'Complete Beginner (A1)',
        value: 'A1',
        description: 'I know basic greetings or starting from scratch.',
      },
      {
        label: 'Elementary (A2)',
        value: 'A2',
        description: 'I understand simple phrases and basic present/past sentences.',
      },
      {
        label: 'Intermediate (B1)',
        value: 'B1',
        description: 'I can express opinions and handle common travel situations.',
      },
      {
        label: 'Upper Intermediate (B2)',
        value: 'B2',
        description: 'I converse smoothly on complex topics with minor grammar errors.',
      },
      {
        label: 'Advanced (C1-C2)',
        value: 'C1',
        description: 'I want to master idioms, nuance, and native-level speed.',
      },
      {
        label: 'Not sure? Take AI Placement Test 🪄',
        value: 'placement_test',
        badge: 'AI Smart Test',
        description: '3 quick adaptive questions to discover your exact CEFR level.',
      },
    ],
  },

  // 7. Learning Style
  {
    id: 'learning_style',
    category: 'learning_style',
    question: {
      en: 'How do you learn best?',
      pt: 'Qual é o seu estilo de aprendizagem?',
      es: '¿Cómo aprendes mejor?',
      fr: 'Comment apprenez-vous le mieux ?',
      de: 'Wie lernen Sie am besten?',
    },
    subtitle: {
      en: 'We will tune visual cards, audio dialogues, or grammar drills accordingly.',
      pt: 'Ajustaremos cartões visuais, áudios ou exercícios gramaticais ao seu estilo.',
      es: 'Adaptaremos las tarjetas visuales, audios y gramática a tu estilo.',
      fr: 'Nous adapterons les visuels, les audios et les exercices à votre style.',
      de: 'Wir passen visuelle Karten, Audios und Übungen an Ihren Stil an.',
    },
    options: [
      {
        label: 'Visual & Contextual',
        value: 'visual',
        description: 'Image cards, color-coded sentence structures & reading.',
      },
      {
        label: 'Auditory & Conversational',
        value: 'auditory',
        description: 'Speech recognition, dialogue listening & pronunciation focus.',
      },
      {
        label: 'Interactive & Scenario-Based',
        value: 'kinesthetic',
        description: 'Real-world roleplay simulations, choices & active solving.',
      },
      {
        label: 'Structured & Grammatical',
        value: 'reading_writing',
        description: 'Clear rules, pattern tables, precise feedback & writing.',
      },
    ],
  },

  // 8. Coach Personality
  {
    id: 'coach_personality',
    category: 'coach_personality',
    question: {
      en: 'Choose your AI Coach personality',
      pt: 'Escolha a personalidade do seu AI Coach',
      es: 'Elige la personalidad de tu profesor IA',
      fr: 'Choisissez la personnalité de votre coach IA',
      de: 'Wählen Sie die Persönlichkeit Ihres AI-Coaches',
    },
    subtitle: {
      en: 'Your coach will adapt tone, feedback intensity, and encouragement style.',
      pt: 'O seu treinador adaptará o tom, intensidade de feedback e incentivos.',
      es: 'Tu profesor adaptará el tono, correcciones y dinamismo.',
      fr: 'Votre coach adaptera son ton et ses encouragements.',
      de: 'Ihr Coach passt Ton und Korrekturstil an Sie an.',
    },
    options: [
      {
        label: 'Encouraging & Warm 🌟',
        value: 'encouraging',
        badge: 'Most Popular',
        description: 'Patient, highly motivating, celebrates every milestone.',
      },
      {
        label: 'Direct & Structured 🎯',
        value: 'academic',
        description: 'Clear rules, immediate correction, methodical grammar mastery.',
      },
      {
        label: 'Casual & Friendly ☕',
        value: 'casual',
        description: 'Relaxed tone, like practicing over coffee with a local friend.',
      },
      {
        label: 'Socratic & Challenging 🧠',
        value: 'socratic',
        description: 'Asks guiding questions to boost deep retention and problem-solving.',
      },
    ],
  },

  // 9. Topics of Interest (Multi-select)
  {
    id: 'topics',
    category: 'interests',
    allowMultiple: true,
    question: {
      en: 'Select your topics of interest',
      pt: 'Selecione os seus temas de interesse',
      es: 'Selecciona tus temas de interés',
      fr: 'Sélectionnez vos centres d’intérêt',
      de: 'Wählen Sie Ihre Interessengebiete',
    },
    subtitle: {
      en: 'Vocabulary and AI scenarios will focus on subjects you care about.',
      pt: 'Vocabulário e conversas com a IA focarão nos assuntos que mais gosta.',
      es: 'El vocabulario y diálogos se centrarán en lo que más te apasiona.',
      fr: 'Le vocabulaire sera basé sur les sujets que vous aimez.',
      de: 'Der Wortschatz basiert auf den Themen, die Sie interessieren.',
    },
    options: [
      { label: 'Technology & AI', value: 'technology', icon: '💻' },
      { label: 'Travel & World Cultures', value: 'travel', icon: '✈️' },
      { label: 'Gastronomy & Wine', value: 'culinary', icon: '🍷' },
      { label: 'Business & Finance', value: 'business', icon: '📈' },
      { label: 'Cinema, Music & Arts', value: 'arts', icon: '🎬' },
      { label: 'History & Literature', value: 'history', icon: '📚' },
      { label: 'Daily Life & Socializing', value: 'daily_life', icon: '💬' },
      { label: 'Sports & Fitness', value: 'sports', icon: '⚽' },
    ],
  },
];
