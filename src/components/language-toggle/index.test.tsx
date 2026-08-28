import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LanguageToggle } from './index';

afterEach(() => {
  cleanup();
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
});
