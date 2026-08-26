import { createServerFn } from '@tanstack/react-start';
import { getSession } from './session.server';

export const $getSession = createServerFn({ method: 'GET' }).handler(async () => {
  return await getSession();
});
