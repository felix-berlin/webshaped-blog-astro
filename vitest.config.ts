/// <reference types="vitest" />
import { coverageConfigDefaults } from "vitest/config";
import { getViteConfig, envField } from "astro/config";

export default getViteConfig(
  {
    test: {
      include: ["src/tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      exclude: ["src/tests/unit/__needsFix/*"],
      globals: true,
      environment: "jsdom",
      setupFiles: ["src/tests/setup.ts", "@vitest/web-worker"],
      coverage: {
        include: ["src/**"],
        exclude: [
          "src/types/**",
          "src/env.d.ts",
          "src/pages/_app.ts",
          ...coverageConfigDefaults.exclude,
        ],
        reportsDirectory: "./tests/unit/coverage",
      },
    },
  },
  {
    env: {
      schema: {
        WP_API: envField.string({
          context: "client",
          access: "public",
          default: "https://test.webshaped.test/api",
        }),
        WP_REST_API: envField.string({
          context: "client",
          access: "public",
          default: "https://test.webshaped.test/wp-json",
        }),
        WP_AUTH_REFRESH_TOKEN: envField.string({
          context: "client",
          access: "public",
          default: "no-a-real-token",
        }),
        WEBMENTION_URL: envField.string({
          context: "server",
          access: "public",
          default: "https://webmention.io/test.test",
        }),
        LAST_FM_SCROBBLER_API: envField.string({
          context: "client",
          access: "public",
          default: "https://last-fm.test",
        }),
        ENABLE_ANALYTICS: envField.boolean({ context: "client", access: "public", default: false }),
        SENTRY_DSN: envField.string({
          context: "server",
          access: "public",
          optional: true,
          default: "",
        }),
        SENTRY_PROJECT_ID: envField.string({
          context: "server",
          access: "public",
          optional: true,
          default: "",
        }),
        SENTRY_AUTH_TOKEN: envField.string({
          context: "server",
          access: "public",
          optional: true,
          default: "",
        }),
        GITHUB_TOKEN: envField.string({
          context: "server",
          access: "secret",
          default: "",
        }),
        SITE_URL: envField.string({
          context: "client",
          access: "public",
          default: "http://localhost:4321",
        }),
      },
    },
  },
);
