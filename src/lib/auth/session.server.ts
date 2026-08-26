import { getRequest, setResponseHeader } from '@tanstack/react-start/server';
import { auth } from './auth.server';

export async function getSession() {
  const result = await auth.api.getSession({
    headers: getRequest().headers,
    returnHeaders: true,
  });
  const cookies = result.headers?.getSetCookie();

  if (cookies?.length) {
    setResponseHeader('Set-Cookie', cookies);
  }

  return result.response ?? null;
}
