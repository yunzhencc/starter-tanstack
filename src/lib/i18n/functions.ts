import { createServerFn } from '@tanstack/react-start';
import { getLocale } from './locale.server';

export const $getLocale = createServerFn({ method: 'GET' }).handler(() =>
  getLocale(),
);
