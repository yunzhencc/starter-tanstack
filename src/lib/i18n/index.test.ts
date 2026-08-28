import { describe, expect, it } from 'vitest';
import { fallbackLocale, resolveLocale, resolveRequestLocale, resources } from './index';

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

describe('resolveRequestLocale', () => {
  it('prefers a supported locale cookie over Accept-Language', () => {
    expect(resolveRequestLocale('en', 'zh-CN,zh;q=0.9')).toBe('en');
  });

  it('uses a supported Accept-Language value when there is no valid cookie', () => {
    expect(resolveRequestLocale('fr-FR', 'fr-FR, en-GB;q=0.9, zh-CN;q=0.8')).toBe('en');
  });
});
