import en from './locales/en.json';
import zhCN from './locales/zh-CN.json';

export type AppLocale = 'zh-CN' | 'en';

export const fallbackLocale: AppLocale = 'zh-CN';
export const localeCookieName = 'locale';

function findLocale(input: string | readonly string[] | undefined): AppLocale | undefined {
  const languages = typeof input === 'string' ? [input] : input ?? [];
  const language = languages.find(item => item.toLowerCase().startsWith('zh') || item.toLowerCase().startsWith('en'))?.toLowerCase();
  if (language?.startsWith('en'))
    return 'en';
  if (language?.startsWith('zh'))
    return 'zh-CN';
}

export function resolveLocale(input: string | readonly string[] | undefined): AppLocale {
  return findLocale(input) ?? fallbackLocale;
}

export function resolveRequestLocale(cookieLocale: string | undefined, acceptLanguage: string | undefined): AppLocale {
  return findLocale(cookieLocale) ?? resolveLocale(acceptLanguage?.split(',').map(language => language.trim().split(';')[0]));
}

export const resources = { 'zh-CN': zhCN, en } as const;
