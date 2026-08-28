# Internationalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add globally switchable Simplified Chinese and English to all current user-visible UI.

**Architecture:** Keep the two translation resources bundled in `src/lib/i18n/`. The server renders `zh-CN`; a client provider uses `i18next-browser-languagedetector` after mount to prefer the saved local value, then browser languages, while a native language selector persists explicit user choices.

**Tech Stack:** React 19, TanStack Start, i18next, react-i18next, i18next-browser-languagedetector, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-28-internationalization-design.md`

## Global Constraints

- Support exactly `zh-CN` and `en`; `zh-CN` is the fallback and SSR language.
- Detector order is exactly `localStorage`, then `navigator`; it writes no automatic cache.
- Persist only explicit selector changes in `localStorage` key `starter-tanstack:locale`.
- Do not add an HTTP translation backend, cookie, URL language state, database state, or locale-prefixed routes.
- Keep Better Auth responses and server behavior unchanged.

---

### Task 1: Add the locale contract and dependency

**Files:**
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `pnpm-lock.yaml`
- Create: `src/lib/i18n/index.ts`
- Create: `src/lib/i18n/index.test.ts`

**Interfaces:**
- Produces: `AppLocale = 'zh-CN' | 'en'`, `fallbackLocale`, `localeStorageKey`, `languageDetectionOptions`, `resolveLocale(input: string | readonly string[] | undefined): AppLocale`, and `resources`.
- Consumes: no project-local interface.

- [ ] **Step 1: Write the failing locale tests**

```ts
import { describe, expect, it } from 'vitest';
import { fallbackLocale, languageDetectionOptions, resolveLocale } from './index';

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
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test --run src/lib/i18n/index.test.ts`

Expected: FAIL because `src/lib/i18n/index.ts` does not exist.

- [ ] **Step 3: Add the detector dependency and locale module**

Add `i18next-browser-languagedetector` with the existing `catalog:core` convention, run `pnpm install`, then create the minimal module:

```ts
import type { DetectorOptions } from 'i18next-browser-languagedetector';

export type AppLocale = 'zh-CN' | 'en';
export const fallbackLocale: AppLocale = 'zh-CN';
export const localeStorageKey = 'starter-tanstack:locale';
export const languageDetectionOptions: DetectorOptions = {
  order: ['localStorage', 'navigator'],
  caches: [],
  lookupLocalStorage: localeStorageKey,
};

export function resolveLocale(input: string | readonly string[] | undefined): AppLocale {
  const languages = typeof input === 'string' ? [input] : input ?? [];
  const language = languages.find(item => item.toLowerCase().startsWith('zh') || item.toLowerCase().startsWith('en'))?.toLowerCase();
  if (language?.startsWith('en')) return 'en';
  if (language?.startsWith('zh')) return 'zh-CN';
  return fallbackLocale;
}
```

Add the two `translation` resource objects in the same file with every key consumed in Tasks 2 and 3.

- [ ] **Step 4: Run the focused test**

Run: `pnpm test --run src/lib/i18n/index.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the locale contract**

```bash
git add package.json pnpm-workspace.yaml pnpm-lock.yaml src/lib/i18n/index.ts src/lib/i18n/index.test.ts
git commit -m "feat(i18n): add locale configuration"
```

### Task 2: Initialize i18next and expose the global selector

**Files:**
- Create: `src/lib/i18n/provider.tsx`
- Create: `src/components/language-toggle/index.tsx`
- Create: `src/components/language-toggle/index.test.tsx`
- Modify: `src/routes/__root.tsx`

**Interfaces:**
- Consumes: `AppLocale`, `fallbackLocale`, `languageDetectionOptions`, `localeStorageKey`, `resolveLocale`, and `resources` from `src/lib/i18n/index.ts`.
- Produces: `AppI18nProvider` and `LanguageToggle`.

- [ ] **Step 1: Write failing selector tests**

```tsx
it('persists an explicit English choice', async () => {
  render(<LanguageToggle />);
  fireEvent.change(screen.getByLabelText('语言'), { target: { value: 'en' } });
  expect(window.localStorage.getItem('starter-tanstack:locale')).toBe('en');
});

it('uses self-identifying language option labels', () => {
  render(<LanguageToggle />);
  expect(screen.getByRole('option', { name: '简体中文' })).not.toBeNull();
  expect(screen.getByRole('option', { name: 'English' })).not.toBeNull();
});
```

- [ ] **Step 2: Run the selector test to verify it fails**

Run: `pnpm test --run src/components/language-toggle/index.test.tsx`

Expected: FAIL because the provider and selector do not exist.

- [ ] **Step 3: Implement the client-safe provider and selector**

Initialize one i18next instance with bundled resources and `lng: fallbackLocale`. In `AppI18nProvider`, use `useEffect` to dynamically import the browser detector, call `detect(languageDetectionOptions.order)`, normalize its result with `resolveLocale`, and call `i18n.changeLanguage`. Subscribe to `languageChanged` to set `document.documentElement.lang` and `document.title`; unsubscribe on unmount.

Implement the selector with the native `<select>` and the existing Tailwind form styling. Its `onChange` must set `localStorage` with `localeStorageKey` before calling `i18n.changeLanguage`:

```tsx
<select
  aria-label={t('language.label')}
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
```

Wrap root children with `AppI18nProvider` and place `LanguageToggle` in a fixed top-right container so it is available on guest and authenticated routes. Keep the root `<html>` SSR `lang` as `zh-CN`.

- [ ] **Step 4: Run selector tests**

Run: `pnpm test --run src/components/language-toggle/index.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit the provider and selector**

```bash
git add src/lib/i18n/provider.tsx src/components/language-toggle src/routes/__root.tsx
git commit -m "feat(i18n): add global language selector"
```

### Task 3: Translate all current user-visible copy

**Files:**
- Modify: `src/features/auth/credentials-form.tsx`
- Modify: `src/components/theme-toggle/index.tsx`
- Modify: `src/components/sign-out-button.tsx`
- Modify: `src/features/home/index.tsx`
- Modify: `src/routes/_auth/app/index.tsx`
- Modify: `src/routes/__root.tsx`

**Interfaces:**
- Consumes: `useTranslation` from `react-i18next` and the keys defined in `src/lib/i18n/index.ts`.
- Produces: no new public interface.

- [ ] **Step 1: Write failing translation-resource assertions**

Add to `src/lib/i18n/index.test.ts`:

```ts
it('contains English and Chinese text for every current page area', () => {
  for (const locale of ['zh-CN', 'en'] as const) {
    const translation = resources[locale].translation;
    expect(translation.auth.login.title).toBeTruthy();
    expect(translation.app.welcome).toBeTruthy();
    expect(translation.theme.switchToLight).toBeTruthy();
    expect(translation.notFound.title).toBeTruthy();
  }
});
```

- [ ] **Step 2: Run the resource test to verify it fails**

Run: `pnpm test --run src/lib/i18n/index.test.ts`

Expected: FAIL until all translation keys are supplied.

- [ ] **Step 3: Replace hard-coded visible strings with translation keys**

Use `const { t } = useTranslation()` in each client component and replace the existing copy, including:

```tsx
<h1>{t(signup ? 'auth.signup.title' : 'auth.login.title')}</h1>
<p role="alert">{error || t('auth.errorFallback')}</p>
<Button>{t('auth.signOut')}</Button>
<h1>{t('app.welcome', { name: user.name })}</h1>
```

In `src/routes/__root.tsx`, use the bundled `zh-CN` resource for the SSR route title and 404 title. The provider updates the document title after client-side language changes. Do not translate Better Auth response messages.

- [ ] **Step 4: Run focused tests and type check**

Run: `pnpm test --run src/lib/i18n/index.test.ts src/components/language-toggle/index.test.tsx src/components/theme-toggle/index.test.tsx && pnpm exec tsc --noEmit`

Expected: all tests and the type check PASS.

- [ ] **Step 5: Commit translated UI**

```bash
git add src/lib/i18n/index.ts src/lib/i18n/index.test.ts src/features/auth/credentials-form.tsx src/components/theme-toggle/index.tsx src/components/sign-out-button.tsx src/features/home/index.tsx src/routes/_auth/app/index.tsx src/routes/__root.tsx
git commit -m "feat(i18n): translate current interface"
```

### Task 4: Verify production behavior

**Files:**
- Modify: no source files expected.

**Interfaces:**
- Consumes: completed Tasks 1-3.
- Produces: verified local implementation.

- [ ] **Step 1: Run the complete unit test suite**

Run: `CI=true pnpm test --run`

Expected: PASS.

- [ ] **Step 2: Run production validation**

Run: `CI=true pnpm build && git diff --check`

Expected: build completes and `git diff --check` emits no output.

- [ ] **Step 3: Check the staged release diff and commit**

```bash
git status --short
git diff --check HEAD
git add -A
git diff --cached --check
git commit -m "feat(i18n): add bilingual interface"
```

Expected: only internationalization implementation files are committed.
