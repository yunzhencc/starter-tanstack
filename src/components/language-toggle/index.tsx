import { useTranslation } from 'react-i18next';
import { localeCookieName, resolveLocale } from '#/lib/i18n';

export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  return (
    <select
      aria-label={t('language.label')}
      className="rounded-md border border-input bg-background px-3 py-2 text-sm"
      value={resolveLocale(i18n.resolvedLanguage)}
      onChange={(event) => {
        const locale = resolveLocale(event.target.value);
        document.cookie = `${localeCookieName}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
        void i18n.changeLanguage(locale);
      }}
    >
      <option value="zh-CN">简体中文</option>
      <option value="en">English</option>
    </select>
  );
}
