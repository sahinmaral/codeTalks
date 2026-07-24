import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import tr from './locales/tr.json';

export const SUPPORTED_LANGUAGES = ['en', 'tr'] as const;
export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

/** Persisted user preference. 'system' follows the device locale. */
export type LanguageMode = LanguageCode | 'system';

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export const resources = {
  en: { translation: en },
  tr: { translation: tr },
} as const;

const isSupported = (code?: string | null): code is LanguageCode =>
  SUPPORTED_LANGUAGES.includes(code as LanguageCode);

/** Best-supported language for the current device, falling back to English. */
export const getDeviceLanguage = (): LanguageCode => {
  const code = getLocales()[0]?.languageCode;
  return isSupported(code) ? code : DEFAULT_LANGUAGE;
};

/** Resolve a stored preference to an actual language code. */
export const resolveLanguage = (mode: LanguageMode): LanguageCode =>
  mode === 'system' ? getDeviceLanguage() : mode;

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
