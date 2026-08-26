# Authentication foundation design

## Goal

Add the smallest production-shaped authentication foundation for this TanStack Start starter:

- local PostgreSQL via Docker Compose;
- email/password signup, sign-in, and sign-out;
- protected `/app` routes;
- server-side authorization for protected server functions and API routes;
- a browser smoke test for the logged-out flow.

GitHub/Google OAuth, Vite+, Nitro, and Query SSR integration are out of scope.

## Architecture

```text
Browser
  -> /api/auth/* route -> Better Auth -> Drizzle -> PostgreSQL
  -> _guest / _auth route guards -> cached current-user server function
Protected server function / API route -> auth middleware -> Better Auth session
```

`src/env/server.ts` owns server-only environment validation. `src/lib/db` owns the
single PostgreSQL/Drizzle connection and schema. `src/lib/auth` owns the Better Auth
configuration, client, current-user server function, query options, and middleware.
Neither database nor server auth modules may be imported by client components.

## Routes and session behavior

- `src/routes/api/auth/$.ts` forwards GET and POST requests to Better Auth.
- `_guest` contains `/login` and `/signup`; an authenticated visitor is redirected to
  `/app`.
- `_auth` wraps `/app`; a visitor without a session is redirected to `/login`.
- Route guards are a navigation convenience only. Protected server functions and API
  routes must use the auth middleware as their security boundary.
- The current-user server function forwards `Set-Cookie` headers from Better Auth so
  the browser receives refreshed session cookies.

## Data and configuration

- `docker-compose.yml` supplies PostgreSQL with a named development volume.
- `.env.example` documents `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `VITE_BASE_URL`.
- Drizzle owns application schema and migrations; generated Better Auth schema remains
  generated rather than manually edited.
- Production secrets are required through environment variables; test-only fallback
  values remain confined to Playwright's web-server process.

## Testing and validation

- Unit tests cover the smallest pure auth/query behavior that can run without a
  database.
- Playwright starts the built app through a new `start:e2e` script and verifies that a
  logged-out visitor can reach the login page.
- Validation runs targeted Vitest tests, the E2E smoke test when PostgreSQL is
  available, TypeScript checking, linting, and a production build.

## Explicit constraints

- Keep the existing next-themes provider and theme-transition behavior.
- Do not reintroduce `setupRouterSsrQueryIntegration`; this project previously hit a
  hydration failure through that integration.
- Do not migrate the existing Vite/ESLint toolchain to Vite+/Nitro/Oxlint/Oxfmt.
