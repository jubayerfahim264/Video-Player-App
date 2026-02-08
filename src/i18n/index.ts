/**
 * i18n: auto-detect device language and provide translations.
 * Supported: English (en, default), Bengali (bn).
 */
import { I18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import bn from './locales/bn.json';

const translations = { en, bn } as const;
export type LocaleKey = keyof typeof translations;

const i18n = new I18n(translations);

/** Supported locale tags; first is default */
const SUPPORTED_LOCALES: LocaleKey[] = ['en', 'bn'];

/**
 * Get best matching locale from device settings.
 * Uses react-native-localize to get preferred language tags and picks first match.
 */
function getDeviceLocale(): LocaleKey {
  const locales = RNLocalize.getLocales();
  for (const { languageTag, languageCode } of locales) {
    // Match exact tag (e.g. en-US) or language code (e.g. en)
    const code = languageCode?.toLowerCase() ?? languageTag.split('-')[0]?.toLowerCase();
    if (SUPPORTED_LOCALES.includes(code as LocaleKey)) {
      return code as LocaleKey;
    }
    if (SUPPORTED_LOCALES.includes(languageTag.split('-')[0]?.toLowerCase() as LocaleKey)) {
      return languageTag.split('-')[0].toLowerCase() as LocaleKey;
    }
  }
  return 'en';
}

/** Set locale from device (call once at app start or when language changes) */
export function setI18nLocaleFromDevice(): LocaleKey {
  const locale = getDeviceLocale();
  i18n.locale = locale;
  return locale;
}

/** Get current locale */
export function getCurrentLocale(): string {
  return i18n.locale;
}

/** Translate key (e.g. 'privacy.title') */
export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}

export { i18n };
export default i18n;
