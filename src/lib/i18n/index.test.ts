import { describe, expect, it } from 'vitest';
import { fallbackLocale, languageDetectionOptions, resolveLocale, resources } from './index';

describe('resolveLocale', () => {
  it.each([
    ['zh', 'zh-CN'],
    ['zh-TW', 'zh-CN'],
    ['en-US', 'en'],
    [['fr-FR', 'en-GB'], 'en'],
    [undefined, fallbackLocale],
  ] as const)('normalizes %j', (input, expected) => {
    expect(resolveLocale(input)).toBe(expected);
  });

  it('checks the saved value before browser languages without caching detection', () => {
    expect(languageDetectionOptions).toMatchObject({
      order: ['localStorage', 'navigator'],
      caches: [],
      lookupLocalStorage: 'starter-tanstack:locale',
    });
  });

  it('contains English and Chinese text for every current page area', () => {
    for (const locale of ['zh-CN', 'en'] as const) {
      const translation = resources[locale].translation;
      expect(translation.auth.login.title).toBeTruthy();
      expect(translation.app.welcome).toBeTruthy();
      expect(translation.theme.switchToLight).toBeTruthy();
      expect(translation.notFound.title).toBeTruthy();
    }
  });
});
