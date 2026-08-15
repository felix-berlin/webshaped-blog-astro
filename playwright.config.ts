import type { PlaywrightTestConfig } from "@playwright/test";

import { devices } from "@playwright/test";
import { isAgent } from "std-env";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./tests/e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters
   * The HTML report is always generated for humans to open later. For the live
   * terminal output, AI agents (detected via std-env, same signal Vitest 4.1+
   * uses for its "agent" reporter) get the minimal 'dot' reporter instead of
   * the verbose per-test 'list' output, to save tokens. */
  reporter: [["html", { open: "never" }], [isAgent && !process.env.CI ? "dot" : "list"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: "http://localhost:4321",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  webServer: {
    // `pnpm dev`'s predev hook runs gql:generate via `infisical run --`,
    // which tries an interactive CLI login and hangs in CI. CI already
    // injects real secrets as plain env vars (Infisical/secrets-action, see
    // the Playwright workflow) and src/gql/ is committed, so `astro dev`
    // alone is enough there; locally, secrets only exist via `infisical
    // run --`, so `pnpm dev` is still required.
    // ASTRO_DEV_BACKGROUND=0 is required in both cases: Astro 7 auto-detects
    // AI coding agents and CI-like non-TTY environments and daemonizes
    // itself, exiting the launching command immediately instead of staying
    // in the foreground the way Playwright's webServer expects.
    command: process.env.CI
      ? "ASTRO_DEV_BACKGROUND=0 pnpm exec astro dev"
      : "ASTRO_DEV_BACKGROUND=0 pnpm dev",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
};

export default config;
