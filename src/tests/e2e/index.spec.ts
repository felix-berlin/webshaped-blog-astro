import { test, expect } from "@playwright/test";

test("dark and light mode toggle", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Toggle dark mode
  await page.locator(".c-color-mode-toggle").click();
  await expect(page.locator("html")).toHaveClass("dark");
  await expect(page.locator("html")).not.toHaveClass("light");
  await expect(
    page.locator(".c-color-mode-toggle .lucide-moon-icon"),
  ).toHaveAttribute("aria-label", "Dunklen Modus aktivieren");

  // Toggle light mode
  await page.locator(".c-color-mode-toggle").click();
  await expect(page.locator("html")).toHaveClass("");
  await expect(
    page.locator(".c-color-mode-toggle .lucide-sun-icon"),
  ).toHaveAttribute("aria-label", "Hellen Modus aktivieren");
});

test("MainNav submenu toggle", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  const menu = page.locator(".is-menu-title");
  const firstSubmenu = page.locator("#submenu00");

  await menu.click();

  await expect(firstSubmenu).toBeVisible();

  await page.locator("body").click();

  await expect(firstSubmenu).not.toBeVisible();
});
