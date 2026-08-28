import { useTranslation } from 'react-i18next';
import { localeStorageKey, resolveLocale } from '#/lib/i18n';
import { i18n } from '#/lib/i18n/provider';

export function LanguageToggle() {
  const { t } = useTranslation(undefined, { i18n });

  return (
    <select
      aria-label={t('language.label')}
      className="rounded-md border border-input bg-background px-3 py-2 text-sm"
      value={resolveLocale(i18n.resolvedLanguage)}
      onChange={(event) => {
        const locale = resolveLocale(event.target.value);
        window.localStorage.setItem(localeStorageKey, locale);
        void i18n.changeLanguage(locale);
      }}
    >
      <option value="zh-CN">简体中文</option>
      <option value="en">English</option>
    </select>
  );
}
