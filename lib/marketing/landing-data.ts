export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  language: string;
  flag: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: 'Sparkles' | 'Globe' | 'Brain' | 'MessageSquare' | 'TrendingUp' | 'Shield';
  badge?: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export interface ComparisonRow {
  feature: string;
  fluento: string | boolean;
  traditionalApps: string | boolean;
  privateTutors: string | boolean;
}

export const LANDING_HERO_CONTENT = {
  badge: 'AI-POWERED LANGUAGE COACH 2.0',
  titlePrefix: 'Fluency in any language with your personal',
  titleHighlight: 'AI Coach',
  description:
    'Experience longitudinal AI coaching tailored to your native tongue, learning style, and goals. Dynamic study plans that adapt every single day.',
  primaryCta: 'Start Free',
  secondaryCta: 'Download App',
  socialProofText: 'Joined by 12,000+ active polyglots worldwide',
};

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: '01',
    title: '5-Minute Smart Onboarding',
    description:
      'Identify your native language, target language, goals, and ideal coach personality (Encouraging, Socratic, Academic, or Casual).',
  },
  {
    step: '02',
    title: 'Adaptive Study Plan Generation',
    description:
      'Fluento generates a customized curriculum matching your CEFR level (A1 to C2) and weekly time commitment.',
  },
  {
    step: '03',
    title: 'Longitudinal AI Memory & Coaching',
    description:
      'Your AI coach tracks weak grammar patterns, speech speed, and vocabulary retention across all past sessions to target your gaps.',
  },
];

export const LANDING_FEATURES: Feature[] = [
  {
    id: 'feat-1',
    title: 'Multi-Language Native Pairings',
    description:
      'Learn Spanish, English, French, German, Japanese, and 6+ other languages with explanations strictly localized to your native tongue.',
    iconName: 'Globe',
    badge: '11+ Languages',
  },
  {
    id: 'feat-2',
    title: 'Adaptive Coach Personalities',
    description:
      'Switch between warm encouraging support, direct academic focus, or witty conversational banters whenever you need a change of pace.',
    iconName: 'Brain',
    badge: '4 Coach Styles',
  },
  {
    id: 'feat-3',
    title: 'Longitudinal Memory Matrix',
    description:
      'The AI remembers past errors, hesitation points, and mastered vocabulary so you never repeat lessons you have already nailed.',
    iconName: 'Sparkles',
    badge: 'Smart Memory',
  },
  {
    id: 'feat-4',
    title: 'Real-Time Conversational Dialogue',
    description:
      'Practice simulated scenarios—like ordering at a Paris café or giving a presentation in Berlin—with instant grammar feedback.',
    iconName: 'MessageSquare',
  },
  {
    id: 'feat-5',
    title: 'Fluency Confidence Analytics',
    description:
      'Track real progress with an automated Confidence Score based on grammar, listening, pronunciation, and speaking metrics.',
    iconName: 'TrendingUp',
  },
  {
    id: 'feat-6',
    title: 'Enterprise-Grade Privacy & Security',
    description:
      'Your learning transcripts and voice interactions are encrypted and never used for public model training without consent.',
    iconName: 'Shield',
  },
];

export const COMPARISON_TABLE: ComparisonRow[] = [
  {
    feature: 'Longitudinal AI Memory & Adaptability',
    fluento: 'Yes (Tracks past mistakes)',
    traditionalApps: 'No (Linear fixed path)',
    privateTutors: 'Varies by tutor',
  },
  {
    feature: 'Native Language Explanations',
    fluento: '100% Customized',
    traditionalApps: 'Target language only',
    privateTutors: 'Depends on tutor',
  },
  {
    feature: 'Custom Coach Personality & Tone',
    fluento: '4 Interchangeable Styles',
    traditionalApps: 'None',
    privateTutors: 'Fixed personality',
  },
  {
    feature: 'Instant Real-time Grammar Feedback',
    fluento: 'Immediate',
    traditionalApps: 'Basic right/wrong check',
    privateTutors: 'After turn ends',
  },
  {
    feature: '24/7 Unlimited Practice',
    fluento: 'Unlimited',
    traditionalApps: 'Limited hearts / energy',
    privateTutors: '$30 - $80 / hour',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Sofia Moderno',
    role: 'Product Designer in Lisbon',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content:
      'Fluento is the first language app that actually adapts to my Portuguese background while teaching me German. The Socratic coach personality keeps me on my toes!',
    rating: 5,
    language: 'German (A2 ➔ B1)',
    flag: '🇩🇪',
  },
  {
    id: 't-2',
    name: 'Marc Laurent',
    role: 'Software Engineer in Lyon',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content:
      'I was tired of repetitive flashcard apps. Fluento feels like having a private English coach available 24/7 who remembers what I struggled with last week.',
    rating: 5,
    language: 'English (B2 ➔ C1)',
    flag: '🇬🇧',
  },
  {
    id: 't-3',
    name: 'Elena Rostova',
    role: 'Entrepreneur in Milan',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    content:
      'Learning Japanese was intimidating until Fluento broke down grammar structures in Italian. The confidence index score gave me real visibility into my growth.',
    rating: 5,
    language: 'Japanese (A1 ➔ A2)',
    flag: '🇯🇵',
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever free',
    description: 'Perfect for trying out your first AI Coach lessons and daily practice.',
    features: [
      'Access to 1 Target Language',
      'Daily 15-minute AI practice sessions',
      'Encouraging Coach Style',
      'Basic Fluency Score updates',
      'Web & Mobile App access',
    ],
    ctaText: 'Start Free',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$14',
    period: 'per month',
    popular: true,
    description: 'Full power of longitudinal AI memory, multiple coach personalities, and unlimited practice.',
    features: [
      'Unlimited Target Languages',
      'Unlimited daily AI coaching',
      'All 4 Coach Personalities (Encouraging, Socratic, Casual, Academic)',
      'Longitudinal Memory & mistake tracker',
      'Advanced Skill Matrix analytics',
      'Exportable lesson summaries',
    ],
    ctaText: 'Start Free Trial',
  },
  {
    id: 'family',
    name: 'Family',
    price: '$29',
    period: 'per month',
    description: 'Designed for families or households learning foreign languages together.',
    features: [
      'Up to 6 Individual User Profiles',
      'Everything in Pro Coach for all members',
      'Shared household leaderboard & challenges',
      'Parental control & goal settings',
      'Priority AI model processing',
    ],
    ctaText: 'Get Family Plan',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How is Fluento different from Duolingo or traditional language apps?',
    answer:
      'Unlike traditional apps with fixed linear paths and repetitive matching games, Fluento acts as an intelligent AI Coach. It remembers your past conversation errors, generates dynamic study plans, and explains complex grammar concepts using your native language.',
  },
  {
    question: 'Which languages are supported?',
    answer:
      'Fluento supports 11+ major languages including English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese, Russian, and Arabic. Any native-to-target language combination is supported.',
  },
  {
    question: 'Can I change my AI Coach style whenever I want?',
    answer:
      'Yes! You can toggle between 4 distinct personalities: Encouraging & Warm, Direct & Structured, Casual & Conversational, or Socratic & Probing depending on your mood and goals.',
  },
  {
    question: 'How does the free plan work?',
    answer:
      'Our Starter plan is 100% free forever with no credit card required. It gives you daily practice time and full access to your personalized AI coach assessment.',
  },
  {
    question: 'Is my data and learning history saved securely?',
    answer:
      'Yes, all student profiles, lesson history, and performance matrices are stored securely with enterprise encryption.',
  },
];
