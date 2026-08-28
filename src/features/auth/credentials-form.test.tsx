import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createI18n } from '#/lib/i18n/provider';
import { CredentialsForm } from './credentials-form';

const auth = vi.hoisted(() => ({
  navigate: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useNavigate: () => auth.navigate,
}));

vi.mock('#/lib/auth/auth-client', () => ({
  authClient: { signIn: { email: auth.signIn }, signUp: { email: auth.signUp } },
}));

afterEach(() => {
  cleanup();
  auth.navigate.mockClear();
  auth.signIn.mockReset();
  auth.signUp.mockReset();
});

async function submitLogin() {
  fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: '登录' }));
}

describe('credentials form', () => {
  it('shows the localized fallback when Better Auth returns an empty error message', async () => {
    auth.signIn.mockResolvedValue({ error: { message: '' } });
    const i18n = createI18n('zh-CN');
    render(<I18nextProvider i18n={i18n}><CredentialsForm mode="login" /></I18nextProvider>);

    await submitLogin();

    expect((await screen.findByRole('alert')).textContent).toBe('认证失败，请重试');
  });

  it('keeps a non-empty Better Auth error message unchanged', async () => {
    auth.signIn.mockResolvedValue({ error: { message: 'Invalid credentials' } });
    const i18n = createI18n('zh-CN');
    render(<I18nextProvider i18n={i18n}><CredentialsForm mode="login" /></I18nextProvider>);

    await submitLogin();

    expect((await screen.findByRole('alert')).textContent).toBe('Invalid credentials');
  });

  it('shows a validation error instead of submitting an invalid email address', async () => {
    const i18n = createI18n('zh-CN');
    render(<I18nextProvider i18n={i18n}><CredentialsForm mode="login" /></I18nextProvider>);

    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'not-an-email' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    expect((await screen.findByRole('alert')).textContent).toBe('请输入有效的邮箱地址');
    expect(auth.signIn).not.toHaveBeenCalled();
  });

  it('marks the confirmation field invalid instead of registering mismatched passwords', async () => {
    const i18n = createI18n('zh-CN');
    render(<I18nextProvider i18n={i18n}><CredentialsForm mode="signup" /></I18nextProvider>);

    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: 'Taylor' } });
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'different' } });
    fireEvent.click(screen.getByRole('button', { name: '创建账户' }));

    expect((await screen.findByRole('alert')).textContent).toBe('两次输入的密码不一致');
    expect(screen.getByLabelText('确认密码').getAttribute('aria-invalid')).toBe('true');
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it('shows only the required error when confirmation is empty', async () => {
    const i18n = createI18n('zh-CN');
    render(<I18nextProvider i18n={i18n}><CredentialsForm mode="signup" /></I18nextProvider>);

    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: 'Taylor' } });
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: '创建账户' }));

    expect(await screen.findByText('请填写确认密码')).not.toBeNull();
    expect(screen.queryByText('两次输入的密码不一致')).toBeNull();
    expect(auth.signUp).not.toHaveBeenCalled();
  });
});
