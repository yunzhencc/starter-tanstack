import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

test('visitor signs up, signs out, signs in, and cannot visit app while logged out', async ({ page }) => {
  const email = `${randomUUID()}@example.test`;

  await page.goto('/app');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByRole('link', { name: '创建账户' }).click();
  await page.getByLabel('姓名').fill('Test User');
  await page.getByLabel('邮箱').fill(email);
  await page.getByLabel('密码', { exact: true }).fill('password123');
  await page.getByLabel('确认密码').fill('password123');
  await page.getByRole('button', { name: '创建账户' }).click();
  await expect(page).toHaveURL(/\/app$/);

  await page.getByRole('button', { name: '退出登录' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel('邮箱').fill(email);
  await page.getByLabel('密码', { exact: true }).fill('password123');
  await page.getByRole('button', { name: '登录' }).click();
  await expect(page).toHaveURL(/\/app$/);
});
