import { createFileRoute } from '@tanstack/react-router';
import { SignOutButton } from '#/components/sign-out-button';

export const Route = createFileRoute('/_auth/app/')({ component: App });
function App() {
  const { user } = Route.useRouteContext();
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <section className="space-y-4 rounded-xl border bg-card p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold">
          欢迎，
          {user.name}
        </h1>
        <SignOutButton />
      </section>
    </main>
  );
}
