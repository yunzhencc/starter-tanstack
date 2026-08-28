import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { i18n } from '#/lib/i18n/provider';
import { LanguageToggle } from './index';

beforeEach(async () => {
  await i18n.changeLanguage('zh-CN');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('language toggle', () => {
  it('persists an explicit English choice', () => {
    render(<LanguageToggle />);

    fireEvent.change(screen.getByLabelText('语言'), { target: { value: 'en' } });

    expect(window.localStorage.getItem('starter-tanstack:locale')).toBe('en');
  });

  it('uses self-identifying language option labels', () => {
    render(<LanguageToggle />);

    expect(screen.getByRole('option', { name: '简体中文' })).not.toBeNull();
    expect(screen.getByRole('option', { name: 'English' })).not.toBeNull();
  });

  it('switches language when local storage rejects persistence', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage unavailable');
    });
    render(<LanguageToggle />);

    fireEvent.change(screen.getByLabelText('语言'), { target: { value: 'en' } });

    await waitFor(() => expect(screen.getByLabelText('Language')).not.toBeNull());
  });
});
