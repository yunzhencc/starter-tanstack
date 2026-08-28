import type { AppLocale } from './index';
import { createInstance } from 'i18next';
import { useEffect, useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { fallbackLocale, resolveLocale, resources } from './index';

// eslint-disable-next-line react-refresh/only-export-components
export function createI18n(locale: AppLocale) {
  const i18n = createInstance();
  void i18n.use(initReactI18next).init({
    fallbackLng: fallbackLocale,
    initAsync: false,
    interpolation: { escapeValue: false },
    lng: locale,
    resources,
  });
  return i18n;
}

export function AppI18nProvider({ children, locale }: { children: React.ReactNode; locale: AppLocale }) {
  const i18n = useMemo(() => createI18n(locale), [locale]);

  useEffect(() => {
    const updateDocument = (language: string) => {
      document.documentElement.lang = resolveLocale(language);
      document.title = i18n.t('app.title');
    };

    updateDocument(i18n.resolvedLanguage ?? locale);
    i18n.on('languageChanged', updateDocument);
    return () => i18n.off('languageChanged', updateDocument);
  }, [i18n, locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
