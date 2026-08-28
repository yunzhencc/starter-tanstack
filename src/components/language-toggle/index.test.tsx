import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AppI18nProvider } from '#/lib/i18n/provider';
import { LanguageToggle } from './index';

function renderLanguageToggle() {
  return render(<AppI18nProvider locale="zh-CN"><LanguageToggle /></AppI18nProvider>);
}

afterEach(() => {
  cleanup();
  document.cookie = 'locale=; Max-Age=0';
});

describe('language toggle', () => {
  it('persists an explicit English choice in a cookie', () => {
    renderLanguageToggle();

    fireEvent.change(screen.getByLabelText('语言'), { target: { value: 'en' } });

    expect(document.cookie).toContain('locale=en');
  });

  it('uses self-identifying language option labels', () => {
    renderLanguageToggle();

    expect(screen.getByRole('option', { name: '简体中文' })).not.toBeNull();
    expect(screen.getByRole('option', { name: 'English' })).not.toBeNull();
  });

  it('switches the current session immediately', async () => {
    renderLanguageToggle();

    fireEvent.change(screen.getByLabelText('语言'), { target: { value: 'en' } });

    await waitFor(() => expect(screen.getByLabelText('Language')).not.toBeNull());
  });
});
