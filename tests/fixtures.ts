import { test as base } from '@playwright/test';
import { routes } from './support/routes';

type AppFixtures = {
  gotoApp: (path?: string) => Promise<void>;
};

export const test = base.extend<AppFixtures>({
  gotoApp: async ({ page }, use) => {
    await use(async (path = routes.home) => {
      await page.goto(path);
    });
  },
});

export const expect = test.expect;
