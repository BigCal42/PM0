import { test, expect } from '@playwright/test';

test('homepage renders PM0 header', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /PM0/i })).toBeVisible();
});
