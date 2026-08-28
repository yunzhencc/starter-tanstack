import { useForm } from '@tanstack/react-form';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '#/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Input } from '#/components/ui/input';
import { authClient } from '#/lib/auth/auth-client';

export function CredentialsForm({ mode }: { mode: 'login' | 'signup' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const signup = mode === 'signup';
  const schema = useMemo(() => z.object({
    name: z.string(),
    email: z.string().min(1, t('auth.requiredField', { field: t('auth.email') })).email(t('auth.invalidEmail')),
    password: z.string().min(1, t('auth.requiredField', { field: t('auth.password') })),
    confirmPassword: z.string(),
  }).superRefine((value, context) => {
    if (!signup)
      return;
    if (!value.name)
      context.addIssue({ code: 'custom', message: t('auth.requiredField', { field: t('auth.name') }), path: ['name'] });
    if (!value.confirmPassword)
      context.addIssue({ code: 'custom', message: t('auth.requiredField', { field: t('auth.confirmPassword') }), path: ['confirmPassword'] });
    else if (value.password !== value.confirmPassword)
      context.addIssue({ code: 'custom', message: t('auth.passwordMismatch'), path: ['confirmPassword'] });
  }), [signup, t]);
  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      setError('');
      const result = signup
        ? await authClient.signUp.email({ name: value.name, email: value.email, password: value.password })
        : await authClient.signIn.email({ email: value.email, password: value.password });
      if (result.error) {
        setError(result.error.message || t('auth.errorFallback'));
        return;
      }
      await navigate({ to: '/app' });
    },
  });

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <form
        noValidate
        className="w-full max-w-sm space-y-5 rounded-xl border bg-card p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{t(signup ? 'auth.signup.title' : 'auth.login.title')}</h1>
          <p className="text-sm text-muted-foreground">{t(signup ? 'auth.signup.description' : 'auth.login.description')}</p>
        </div>
        <FieldGroup>
          {signup && (
            <form.Field name="name">
              {field => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.name}>{t('auth.name')}</FieldLabel>
                  <Input id={field.name} name={field.name} autoComplete="name" value={field.state.value} onBlur={field.handleBlur} onChange={event => field.handleChange(event.target.value)} aria-invalid={field.state.meta.errors.length > 0} />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          )}
          <form.Field name="email">
            {field => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>{t('auth.email')}</FieldLabel>
                <Input id={field.name} name={field.name} type="email" autoComplete="email" value={field.state.value} onBlur={field.handleBlur} onChange={event => field.handleChange(event.target.value)} aria-invalid={field.state.meta.errors.length > 0} />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
          <form.Field name="password">
            {field => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>{t('auth.password')}</FieldLabel>
                <Input id={field.name} name={field.name} type="password" autoComplete={signup ? 'new-password' : 'current-password'} value={field.state.value} onBlur={field.handleBlur} onChange={event => field.handleChange(event.target.value)} aria-invalid={field.state.meta.errors.length > 0} />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
          {signup && (
            <form.Field name="confirmPassword">
              {field => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.name}>{t('auth.confirmPassword')}</FieldLabel>
                  <Input id={field.name} name={field.name} type="password" autoComplete="new-password" value={field.state.value} onBlur={field.handleBlur} onChange={event => field.handleChange(event.target.value)} aria-invalid={field.state.meta.errors.length > 0} />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          )}
        </FieldGroup>
        {error && <FieldError>{error}</FieldError>}
        <form.Subscribe selector={state => state.isSubmitting}>
          {pending => <Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? t('auth.submitPending') : t(signup ? 'auth.signupAction' : 'auth.loginAction')}</Button>}
        </form.Subscribe>
        <p className="text-center text-sm text-muted-foreground">
          {t(signup ? 'auth.existingAccount' : 'auth.noAccount')}
          {' '}
          <Link to={signup ? '/login' : '/signup'} className="underline">{t(signup ? 'auth.loginAction' : 'auth.signupAction')}</Link>
        </p>
      </form>
    </main>
  );
}
