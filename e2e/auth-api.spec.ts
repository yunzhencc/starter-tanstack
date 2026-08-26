import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

test('auth endpoint creates an email account', async ({ request }) => {
  const response = await request.post('/api/auth/sign-up/email', {
    data: {
      name: 'Test User',
      email: `${randomUUID()}@example.test`,
      password: 'password123',
    },
  });

  expect(response.ok()).toBeTruthy();
});
