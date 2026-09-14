export type SupportedLanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'it'
  | 'de'
  | 'pt'
  | 'ja'
  | 'ko'
  | 'zh'
  | 'ru'
  | 'ar'
  | string;

export type TargetLanguage = SupportedLanguageCode;

export interface LanguageInfo {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  flag?: string;
  direction?: 'ltr' | 'rtl';
}

export interface UserLanguages {
  nativeLanguage: SupportedLanguageCode;
  targetLanguages: SupportedLanguageCode[];
}
