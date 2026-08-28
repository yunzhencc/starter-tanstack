import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '#/components/theme-toggle';

export function Home() {
  const { t } = useTranslation();

  return (
    <main>
      {t('app.home')}

      <ThemeToggle />
    </main>
  );
}
