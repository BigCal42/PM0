import { test, expect } from '@playwright/test';

test('home page loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check that the page title is correct
  await expect(page).toHaveTitle(/PM0/);
  
  // Check that the main heading is visible
  await expect(page.getByRole('heading', { name: /PM0 Dashboard/i })).toBeVisible();
  
  // Check that key navigation elements are present
  await expect(page.getByText(/Plan Smarter/i)).toBeVisible();
});

