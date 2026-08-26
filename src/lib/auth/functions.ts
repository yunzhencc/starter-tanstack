import { createServerFn, createServerOnlyFn } from '@tanstack/react-start';
import { getRequest, setResponseHeader } from '@tanstack/react-start/server';
import { auth } from '@/lib/auth/auth';

export const getSession = createServerOnlyFn(async () => {
  const result = await auth.api.getSession({
    headers: getRequest().headers,
    returnHeaders: true,
  });
  const cookies = result.headers?.getSetCookie();

  if (cookies?.length) {
    setResponseHeader('Set-Cookie', cookies);
  }

  return result.response ?? null;
});

export const $getSession = createServerFn({ method: 'GET' }).handler(async () => {
  return await getSession();
});
