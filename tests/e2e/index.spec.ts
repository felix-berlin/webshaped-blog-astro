import { test, expect } from '@playwright/test';

test('homepage has title and links to intro page', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Blog Index/);
});

test('dark mode toggle class', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Toggle dark mode
  await page.locator('.c-color-mode-toggle').click();
  await expect(page.locator('html')).toHaveClass('dark');
  await expect(page.locator('html')).not.toHaveClass('light');
  await expect(page.locator('.c-color-mode-toggle .lucide-moon-icon')).toHaveAttribute('aria-label', 'Dunklen Modus aktivieren');

  // Toggle light mode
  await page.locator('.c-color-mode-toggle').click();
  await expect(page.locator('html')).toHaveClass('');
  await expect(page.locator('.c-color-mode-toggle .lucide-sun-icon')).toHaveAttribute('aria-label', 'Hellen Modus aktivieren');

});
