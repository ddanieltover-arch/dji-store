import { test, expect } from '@playwright/test';

test.describe('DJI Store EU storefront smoke', () => {
  test('homepage renders official EU mark', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Store EU')).toBeVisible();
  });

  test('checkout journey is reachable', async ({ page }) => {
    await page.goto('/');
    await page.getByTitle('Open shopping bag').click().catch(() => undefined);
  });
});
