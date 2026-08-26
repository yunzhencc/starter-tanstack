import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';

export function SignOutButton() {
  const navigate = useNavigate();
  async function signOut() {
    await authClient.signOut();
    await navigate({ to: '/login' });
  }
  return <Button variant="outline" onClick={signOut}>退出登录</Button>;
}
