import { cleanup, render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { afterEach, describe, expect, it } from 'vitest';
import { AppI18nProvider } from './provider';

function LanguageLabel() {
  const { t } = useTranslation();
  return <span>{t('language.label')}</span>;
}

afterEach(cleanup);

describe('app i18n provider', () => {
  it('renders the server-provided locale without client detection', () => {
    render(<AppI18nProvider locale="en"><LanguageLabel /></AppI18nProvider>);

    expect(screen.getByText('Language')).not.toBeNull();
  });
});
