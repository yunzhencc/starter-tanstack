import { createInstance } from 'i18next';
import { useEffect } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { fallbackLocale, languageDetectionOptions, resolveLocale, resources } from './index';

// eslint-disable-next-line react-refresh/only-export-components
export const i18n = createInstance();

void i18n.use(initReactI18next).init({
  fallbackLng: fallbackLocale,
  interpolation: { escapeValue: false },
  lng: fallbackLocale,
  resources,
});

export function AppI18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const updateDocument = (language: string) => {
      document.documentElement.lang = resolveLocale(language);
      document.title = i18n.t('app.title');
    };

    i18n.on('languageChanged', updateDocument);
    return () => i18n.off('languageChanged', updateDocument);
  }, []);

  useEffect(() => {
    void import('i18next-browser-languagedetector').then(({ default: LanguageDetector }) => {
      const detector = new LanguageDetector(i18n.services, languageDetectionOptions);
      void i18n.changeLanguage(resolveLocale(detector.detect(languageDetectionOptions.order)));
    });
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
