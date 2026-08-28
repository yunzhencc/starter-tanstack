import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { localeStorageKey } from './index';
import { AppI18nProvider, i18n } from './provider';

beforeEach(async () => {
  window.localStorage.clear();
  await i18n.changeLanguage('zh-CN');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('app i18n provider', () => {
  it('uses a later supported navigator language', async () => {
    vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(['fr-FR', 'en-GB']);

    render(<AppI18nProvider><span /></AppI18nProvider>);

    await waitFor(() => expect(i18n.resolvedLanguage).toBe('en'));
  });

  it('ignores an invalid saved locale and uses a supported navigator language', async () => {
    window.localStorage.setItem(localeStorageKey, 'fr-FR');
    vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(['fr-FR', 'en-GB']);

    render(<AppI18nProvider><span /></AppI18nProvider>);

    await waitFor(() => expect(i18n.resolvedLanguage).toBe('en'));
  });
});
