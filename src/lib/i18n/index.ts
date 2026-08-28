import type { DetectorOptions } from 'i18next-browser-languagedetector';

export type AppLocale = 'zh-CN' | 'en';

export const fallbackLocale: AppLocale = 'zh-CN';
export const localeStorageKey = 'starter-tanstack:locale';

export const languageDetectionOptions: DetectorOptions = {
  order: ['localStorage', 'navigator'],
  caches: [],
  lookupLocalStorage: localeStorageKey,
};

export function resolveLocale(input: string | readonly string[] | undefined): AppLocale {
  const languages = typeof input === 'string' ? [input] : input ?? [];
  const language = languages.find(item => item.toLowerCase().startsWith('zh') || item.toLowerCase().startsWith('en'))?.toLowerCase();
  if (language?.startsWith('en'))
    return 'en';
  if (language?.startsWith('zh'))
    return 'zh-CN';
  return fallbackLocale;
}

export const resources = {
  'zh-CN': {
    translation: {
      language: { label: '语言' },
      app: { title: 'TanStack Start Starter', welcome: '欢迎，{{name}}', home: '首页' },
      auth: {
        login: { title: '欢迎回来', description: '输入账户信息以继续。' },
        signup: { title: '创建账户', description: '填写基础信息即可开始使用。' },
        name: '姓名',
        email: '邮箱',
        password: '密码',
        confirmPassword: '确认密码',
        passwordMismatch: '两次输入的密码不一致',
        errorFallback: '认证失败，请重试',
        submitPending: '请稍候…',
        loginAction: '登录',
        signupAction: '创建账户',
        existingAccount: '已有账户？',
        noAccount: '还没有账户？',
        signOut: '退出登录',
      },
      theme: { switchToLight: '切换至浅色主题', switchToDark: '切换至深色主题' },
      notFound: { title: '页面未找到' },
    },
  },
  'en': {
    translation: {
      language: { label: 'Language' },
      app: { title: 'TanStack Start Starter', welcome: 'Welcome, {{name}}', home: 'Home' },
      auth: {
        login: { title: 'Welcome back', description: 'Enter your account details to continue.' },
        signup: { title: 'Create an account', description: 'Enter your basic information to get started.' },
        name: 'Name',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm password',
        passwordMismatch: 'The passwords do not match',
        errorFallback: 'Authentication failed. Please try again.',
        submitPending: 'Please wait…',
        loginAction: 'Log in',
        signupAction: 'Create account',
        existingAccount: 'Already have an account?',
        noAccount: 'Don\'t have an account?',
        signOut: 'Sign out',
      },
      theme: { switchToLight: 'Switch to light theme', switchToDark: 'Switch to dark theme' },
      notFound: { title: 'Page not found' },
    },
  },
} as const;
