/**
 * Localization Engine Module (Fluento Platform Ecosystem - Phase 17)
 * Internationalization framework that avoids hardcoded UI strings
 * and supports multi-locale translation dictionaries (PT, ES, EN, FR, DE, IT, etc.).
 */

export type PlatformLocale = 'pt' | 'es' | 'en' | 'fr' | 'de' | 'it';

export const PLATFORM_DICTIONARIES: Record<PlatformLocale, Record<string, string>> = {
  pt: {
    app_title: 'Fluento — Ecossistema de Fluência Viva',
    start_session: 'Iniciar Ação de Estudo',
    active_streak: 'Dias Consecutivos',
    cefr_level: 'Nível CEFR',
    burnout_protection: 'Proteção Contradição e Fadiga',
    teacher_persona: 'Professor Virtual',
  },
  es: {
    app_title: 'Fluento — Ecosistema de Fluidez Viva',
    start_session: 'Iniciar Sesión de Estudio',
    active_streak: 'Racha Activa',
    cefr_level: 'Nivel CEFR',
    burnout_protection: 'Protección de Fatiga',
    teacher_persona: 'Profesor Virtual',
  },
  en: {
    app_title: 'Fluento — Living Fluency Ecosystem',
    start_session: 'Start Learning Action',
    active_streak: 'Active Streak',
    cefr_level: 'CEFR Level',
    burnout_protection: 'Burnout Protection',
    teacher_persona: 'Virtual Teacher',
  },
  fr: {
    app_title: 'Fluento — Écosystème de Fluide Vivante',
    start_session: 'Démarrer la Session',
    active_streak: 'Série Active',
    cefr_level: 'Niveau CECRL',
    burnout_protection: 'Protection Anti-Surmenage',
    teacher_persona: 'Professeur Virtuel',
  },
  de: {
    app_title: 'Fluento — Lebendiges Sprach-Ökosystem',
    start_session: 'Lerneinheit Starten',
    active_streak: 'Aktiver Streak',
    cefr_level: 'GER-Stufe',
    burnout_protection: 'Ermüdungsschutz',
    teacher_persona: 'Virtueller Lehrer',
  },
  it: {
    app_title: 'Fluento — Ecosistema di Fluenza Viva',
    start_session: 'Inizia Sessione',
    active_streak: 'Serie Attiva',
    cefr_level: 'Livello QCER',
    burnout_protection: 'Protezione Affaticamento',
    teacher_persona: 'Insegnante Virtuale',
  },
};

export function translateUIKey(
  key: string,
  locale: PlatformLocale = 'pt'
): string {
  const dict = PLATFORM_DICTIONARIES[locale] || PLATFORM_DICTIONARIES.pt;
  return dict[key] || PLATFORM_DICTIONARIES.pt[key] || key;
}
