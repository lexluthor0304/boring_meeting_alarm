import { locales, strings, type Locale } from './strings';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function normalizeLocale(value: string | undefined | null): Locale {
  if (isLocale(value)) return value;
  return 'en';
}

export function getStrings(locale: Locale) {
  return strings[locale];
}

export function pathForLocale(locale: Locale): string {
  return locale === 'en' ? '/' : `/${locale}/`;
}
