import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { ThemeProvider } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '#/components/language-toggle';
import { BodyScrollbars } from '#/features/layout/body-scrollbars';
import { fallbackLocale, resources } from '#/lib/i18n';
import { $getLocale } from '#/lib/i18n/functions';
import { AppI18nProvider } from '#/lib/i18n/provider';
import appCss from '#/styles.css?url';

export const Route = createRootRoute({
  loader: () => $getLocale(),
  head: ({ loaderData }) => {
    const locale = loaderData ?? fallbackLocale;

    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: resources[locale].translation.app.title,
        },
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
      ],
    };
  },
  notFoundComponent: RootNotFound,
  shellComponent: RootDocument,
});

// eslint-disable-next-line react-refresh/only-export-components
function RootNotFound() {
  const { t } = useTranslation();
  return (
    <main>
      <h1>{t('notFound.title')}</h1>
    </main>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
function RootDocument({ children }: { children: React.ReactNode }) {
  const locale = Route.useLoaderData() ?? fallbackLocale;

  return (
    <html data-overlayscrollbars-initialize lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body data-overlayscrollbars-initialize suppressHydrationWarning>
        <AppI18nProvider locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableColorScheme
            enableSystem
            storageKey="starter-tanstack:theme"
            themes={['light', 'dark']}
          >
            <BodyScrollbars />
            {children}
            <div className="fixed right-4 top-4 z-50">
              <LanguageToggle />
            </div>
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          </ThemeProvider>
        </AppI18nProvider>
        <Scripts />
      </body>
    </html>
  );
}
