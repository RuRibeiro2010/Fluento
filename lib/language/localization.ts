import { UserLanguages } from '@/types/language';
import { getLanguageByCode } from './languages';

export function formatLanguagePair(languages: UserLanguages): string {
  const native = getLanguageByCode(languages.nativeLanguage);
  const targets = languages.targetLanguages.map((code) => getLanguageByCode(code).name).join(', ');
  return `${native.name} ➔ ${targets || 'Target Language'}`;
}

export function getLanguageDirection(languageCode: string): 'ltr' | 'rtl' {
  const info = getLanguageByCode(languageCode);
  return info.direction || 'ltr';
}
