import { expect, test } from './fixtures';
import { routes } from './support/routes';

test.describe('Landing page', () => {
  test('renders using configured base URL', async ({ gotoApp, page }) => {
    await gotoApp();

    await expect(page).toHaveURL(new RegExp(`${routes.home.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`));
    await expect(page).toHaveTitle(/PM0 v2/i);
    await expect(page.locator('#root')).toBeVisible();
  });
});
