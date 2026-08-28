import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '#/components/ui/button';
import { authClient } from '#/lib/auth/auth-client';

export function SignOutButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  async function signOut() {
    await authClient.signOut();
    await navigate({ to: '/login' });
  }
  return <Button variant="outline" onClick={signOut}>{t('auth.signOut')}</Button>;
}
