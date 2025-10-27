import { expect, test } from '@playwright/test';
import { openHeatmap, signInWithDemoAccount } from './helpers/workflows';

test.describe('Heatmap smoke', () => {
  test.beforeEach(async ({ page }) => {
    await signInWithDemoAccount(page);
  });

  test('displays severity legend and cells', async ({ page }) => {
    await openHeatmap(page);
    await expect(page.getByTestId('severity-legend')).toBeVisible();
    await expect(page.getByRole('cell', { name: /jan 2024/i })).toBeVisible();
    await expect(page.getByTestId('heatmap-cell-watch')).toBeVisible();
  });

  test('supports exporting heatmap snapshot', async ({ page }) => {
    await openHeatmap(page);
    const exportButton = page.getByRole('button', { name: /export heatmap/i });
    await exportButton.click();
    await expect(page.getByText(/download started/i)).toBeVisible();
  });
});
