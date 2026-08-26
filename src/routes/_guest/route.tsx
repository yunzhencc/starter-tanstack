import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { $getSession } from '@/lib/auth/functions';

export const Route = createFileRoute('/_guest')({ component: Outlet, beforeLoad: async () => {
  if (await $getSession())
    throw redirect({ to: '/app' });
} });
