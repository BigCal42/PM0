import { expect, test } from '@playwright/test';
import { goToApp, signInWithDemoAccount } from './helpers/workflows';

test.describe('Authentication smoke', () => {
  test('renders Supabase auth screen for logged out user', async ({ page }) => {
    await goToApp(page);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('allows switching to demo mode without credentials', async ({ page }) => {
    await signInWithDemoAccount(page);
    await expect(page.getByRole('heading', { name: /orion workday transformation/i })).toBeVisible();
  });
});
