import type { FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';

export function CredentialsForm({ mode }: { mode: 'login' | 'signup' }) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const signup = mode === 'signup';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending)
      return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const name = String(form.get('name') ?? '');
    const confirmPassword = String(form.get('confirmPassword') ?? '');
    if (signup && password !== confirmPassword)
      return setError('两次输入的密码不一致');
    setPending(true);
    setError('');
    const result = signup
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });
    setPending(false);
    if (result.error)
      return setError(result.error.message ?? '认证失败，请重试');
    await navigate({ to: '/app' });
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <form onSubmit={submit} aria-busy={pending} className="w-full max-w-sm space-y-5 rounded-xl border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{signup ? '创建账户' : '欢迎回来'}</h1>
          <p className="text-sm text-muted-foreground">{signup ? '填写基础信息即可开始使用。' : '输入账户信息以继续。'}</p>
        </div>
        {signup && (
          <label className="grid gap-2 text-sm">
            姓名
            <input name="name" required autoComplete="name" className="h-9 rounded-md border bg-background px-3" />
          </label>
        )}
        <label className="grid gap-2 text-sm">
          邮箱
          <input name="email" type="email" required autoComplete="email" className="h-9 rounded-md border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm">
          密码
          <input name="password" type="password" required autoComplete={signup ? 'new-password' : 'current-password'} className="h-9 rounded-md border bg-background px-3" />
        </label>
        {signup && (
          <label className="grid gap-2 text-sm">
            确认密码
            <input name="confirmPassword" type="password" required autoComplete="new-password" className="h-9 rounded-md border bg-background px-3" />
          </label>
        )}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? '请稍候…' : signup ? '创建账户' : '登录'}</Button>
        <p className="text-center text-sm text-muted-foreground">
          {signup ? '已有账户？' : '还没有账户？'}
          {' '}
          <Link to={signup ? '/login' : '/signup'} className="underline">{signup ? '登录' : '创建账户'}</Link>
        </p>
      </form>
    </main>
  );
}
