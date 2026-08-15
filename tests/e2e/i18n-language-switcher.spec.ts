import { test, expect } from "@playwright/test";

const LANGUAGE_SWITCHER = ".c-main-nav__buttons > div.c-button--icon";

test.describe("i18n language switcher and locale routing", () => {
  test("redirects / to /de", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL("/de");
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(
      page.getByRole("heading", { level: 1, name: "Kürzlich veröffentlicht" }),
    ).toBeVisible();
  });

  test("switches language from the homepage via the header dropdown", async ({ page }) => {
    await page.goto("/de");

    const germanHeading = page.getByRole("heading", { level: 1 });
    await expect(germanHeading).toBeVisible();
    const germanHeadingText = await germanHeading.textContent();

    await page.locator(LANGUAGE_SWITCHER).click();

    await expect(page.getByRole("link", { exact: true, name: "Deutsch" })).toBeVisible();
    const englishLink = page.getByRole("link", { exact: true, name: "English" });
    await expect(englishLink).toBeVisible();

    await englishLink.click();

    await expect(page).toHaveURL("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    // The English UI copy ("Posts"/"About") is visibly different from the German nav ("Beiträge"/"Über mich").
    await expect(page.getByRole("menuitem", { name: "Posts" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "About" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(germanHeadingText ?? "");
  });

  test("switches language from a blog post page via the header dropdown", async ({ page }) => {
    await page.goto("/de/posts/matomo-tracking-script-optimal-einbinden");

    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Matomo (Piwik) Tracking Script optimal einbinden – mehr Performance, genauere Zahlen",
      }),
    ).toBeVisible();

    await page.locator(LANGUAGE_SWITCHER).click();
    await page.getByRole("link", { exact: true, name: "English" }).click();

    await expect(page).toHaveURL("/en/posts/matomo-tracking-script-optimal-embedding");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Integrate Matomo (Piwik) tracking script optimally – more performance, more accurate statistics",
      }),
    ).toBeVisible();
  });

  test("returns 404 for an unconfigured locale", async ({ page }) => {
    const response = await page.goto("/fr/");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "404: Not found" })).toBeVisible();
    await expect(page.locator("html")).not.toHaveAttribute("lang", "de");
  });
});
