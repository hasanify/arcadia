import { expect, test } from '@playwright/test';

test.describe('Arcadia Studio E2E', () => {
  test('loads the workstation interface with correct title and chrome', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Arcadia/);
    await expect(page.getByTestId('top-bar')).toBeVisible();
    await expect(page.getByText('Arcadia')).toBeVisible();
    await expect(page.getByTestId('controller-view')).toBeVisible();
    await expect(page.getByTestId('status-line')).toBeVisible();
  });

  test('toggles theme between light and dark', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    const themeBtn = page.getByTitle(/Switch to (Light|Dark) mode/i);
    await themeBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await themeBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('switches to Mappings tab and displays mapping subtabs', async ({ page }) => {
    await page.goto('/');

    const mappingsTabBtn = page.getByRole('button', { name: 'Mappings' });
    await mappingsTabBtn.click();

    await expect(page.getByTestId('mappings-screen')).toBeVisible();
    await expect(page.getByText('Notes & Scales')).toBeVisible();
  });
});
