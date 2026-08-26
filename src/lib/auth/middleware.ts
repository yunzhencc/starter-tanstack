import { createMiddleware } from '@tanstack/react-start';
import { setResponseStatus } from '@tanstack/react-start/server';
import { getSession } from './session.server';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession();

  if (!session) {
    setResponseStatus(401);
    throw new Error('Unauthorized');
  }

  return next({ context: { user: session.user } });
});
