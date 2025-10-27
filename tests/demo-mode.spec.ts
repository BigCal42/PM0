import { expect, test } from '@playwright/test';
import { goToApp, signInWithDemoAccount } from './helpers/workflows';

test.describe('Demo mode smoke', () => {
  test('persists selections across navigation', async ({ page }) => {
    await signInWithDemoAccount(page);
    await page.getByRole('link', { name: /resources/i }).click();
    await expect(page.getByRole('heading', { name: /resources/i })).toBeVisible();
    await page.getByRole('link', { name: /dashboard/i }).click();
    await expect(page.getByTestId('demo-banner')).toBeVisible();
  });

  test('allows toggling back to live Supabase mode', async ({ page }) => {
    await goToApp(page);
    await page.getByRole('button', { name: /switch to live data/i }).click();
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });
});
