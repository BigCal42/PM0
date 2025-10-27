import { expect, test } from '@playwright/test';

test.describe('PM0 smoke flow', () => {
  test('auth → project creation → resource entry → heatmap visibility', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Email').fill('demo@pm0.app');
    await page.getByLabel('Password').fill('supersecure');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByRole('heading', { name: 'Project Setup' })).toBeVisible();

    await page.getByLabel('Project Name').fill('Cardiology Rollout');
    await page.getByRole('button', { name: 'Create Project' }).click();

    await expect(page.getByText('Project created and ready for staffing.')).toBeVisible();

    await page.getByLabel('Role').fill('Nurse Educator');
    await page.getByLabel('Month').selectOption({ label: 'January' });
    await page.getByLabel('Hours').fill('120');
    await page.getByLabel('Scenario').selectOption('accelerated');
    await page.getByRole('button', { name: 'Add Resource' }).click();

    await expect(page.getByTestId('heatmap-table')).toBeVisible();
    await expect(page.getByRole('row', { name: /Nurse Educator/i })).toContainText('144');

    const cell = page.getByTestId('heatmap-cell-0-0');
    await expect(cell).toHaveAttribute('data-severity', 'high');
  });
});
