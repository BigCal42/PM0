import { expect, test } from '@playwright/test';
import { openScenarioGenerator, signInWithDemoAccount } from './helpers/workflows';

test.describe('Scenario generator smoke', () => {
  test.beforeEach(async ({ page }) => {
    await signInWithDemoAccount(page);
    await openScenarioGenerator(page);
  });

  test('lists baseline scenario with KPI metrics', async ({ page }) => {
    const row = page.getByRole('row', { name: /baseline fy24/i });
    await expect(row).toBeVisible();
    await expect(row.getByText(/total hours/i)).toBeVisible();
    await expect(row.getByText(/vendor spend/i)).toBeVisible();
  });

  test('can duplicate scenario with modified multipliers', async ({ page }) => {
    await page.getByRole('button', { name: /duplicate scenario/i }).click();
    await page.getByLabel(/scenario name/i).fill('Baseline Copy');
    await page.getByLabel(/effort multiplier/i).fill('1.1');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('row', { name: /baseline copy/i })).toBeVisible();
  });
});
