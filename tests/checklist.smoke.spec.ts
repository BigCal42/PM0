import { expect, test } from '@playwright/test';
import { openChecklist, signInWithDemoAccount } from './helpers/workflows';

test.describe('Readiness checklist smoke', () => {
  test.beforeEach(async ({ page }) => {
    await signInWithDemoAccount(page);
    await openChecklist(page);
  });

  test('shows checklist items grouped by category', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /readiness/i })).toBeVisible();
    await expect(page.getByRole('group', { name: /integration/i })).toBeVisible();
    await expect(page.getByRole('group', { name: /readiness/i })).toBeVisible();
  });

  test('allows completing a checklist item', async ({ page }) => {
    const item = page.getByRole('row', { name: /tenant provisioning/i });
    await item.getByRole('button', { name: /mark complete/i }).click();
    await expect(item.getByRole('status', { name: /complete/i })).toBeVisible();
  });
});
