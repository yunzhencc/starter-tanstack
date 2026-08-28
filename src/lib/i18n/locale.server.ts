import {
  getCookie,
  getRequestHeader,
  setResponseHeader,
} from '@tanstack/react-start/server';
import { localeCookieName, resolveRequestLocale } from './index';

export function getLocale() {
  setResponseHeader('Vary', 'Cookie, Accept-Language');

  return resolveRequestLocale(
    getCookie(localeCookieName),
    getRequestHeader('accept-language'),
  );
}
