import { cleanup, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { afterEach, describe, expect, it } from 'vitest';
import { i18n } from '#/lib/i18n/provider';
import { Route } from './__root';

afterEach(async () => {
  cleanup();
  await i18n.changeLanguage('zh-CN');
});

describe('root 404 page', () => {
  it('shows English after the language changes', async () => {
    const NotFoundComponent = Route.options.notFoundComponent;
    if (!NotFoundComponent)
      throw new Error('Root not found component is missing');
    render(
      <I18nextProvider i18n={i18n}>
        <NotFoundComponent isNotFound routeId={Route.id} />
      </I18nextProvider>,
    );

    expect(screen.getByRole('heading', { name: '页面未找到' })).not.toBeNull();

    await i18n.changeLanguage('en');

    expect(screen.getByRole('heading', { name: 'Page not found' })).not.toBeNull();
  });
});
