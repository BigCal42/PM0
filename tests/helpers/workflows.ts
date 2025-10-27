import { expect, Page } from '@playwright/test';

export async function goToApp(page: Page) {
  await page.goto('/');
  await expect(page).toHaveTitle(/PM0/i);
}

export async function signInWithDemoAccount(page: Page) {
  await goToApp(page);
  await page.getByRole('button', { name: /use demo mode/i }).click();
  await expect(page.getByTestId('demo-banner')).toBeVisible();
}

export async function createProjectFromTemplate(page: Page, name: string) {
  await page.getByTestId('create-project').click();
  await page.getByLabel('Project Name').fill(name);
  await page.getByLabel('Template').selectOption('workday');
  await page.getByRole('button', { name: /Create Project/i }).click();
  await expect(page.getByRole('heading', { name })).toBeVisible();
}

export async function addRoleToProject(page: Page, roleName: string) {
  await page.getByTestId('add-role').click();
  await page.getByLabel('Role Name').fill(roleName);
  await page.getByLabel('Category').fill('Change');
  await page.getByLabel('Billable Rate').fill('175');
  await page.getByRole('button', { name: /Save Role/i }).click();
  await expect(page.getByRole('row', { name: new RegExp(roleName, 'i') })).toBeVisible();
}

export async function openHeatmap(page: Page) {
  await page.getByRole('link', { name: /Heatmap/i }).click();
  await expect(page.getByTestId('heatmap-grid')).toBeVisible();
}

export async function openScenarioGenerator(page: Page) {
  await page.getByRole('link', { name: /Scenarios/i }).click();
  await expect(page.getByTestId('scenario-list')).toBeVisible();
}

export async function openChecklist(page: Page) {
  await page.getByRole('link', { name: /Readiness Checklist/i }).click();
  await expect(page.getByTestId('readiness-list')).toBeVisible();
}
