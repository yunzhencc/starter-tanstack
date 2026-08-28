import type { DetectorOptions } from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import zhCN from './locales/zh-CN.json';

export type AppLocale = 'zh-CN' | 'en';

export const fallbackLocale: AppLocale = 'zh-CN';
export const localeStorageKey = 'starter-tanstack:locale';

export const languageDetectionOptions: DetectorOptions = {
  order: ['localStorage', 'navigator'],
  caches: [],
  lookupLocalStorage: localeStorageKey,
};

export function resolveLocale(input: string | readonly string[] | undefined): AppLocale {
  const languages = typeof input === 'string' ? [input] : input ?? [];
  const language = languages.find(item => item.toLowerCase().startsWith('zh') || item.toLowerCase().startsWith('en'))?.toLowerCase();
  if (language?.startsWith('en'))
    return 'en';
  if (language?.startsWith('zh'))
    return 'zh-CN';
  return fallbackLocale;
}

export const resources = { 'zh-CN': zhCN, en } as const;
