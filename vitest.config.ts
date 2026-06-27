import { getViteConfig } from "astro/config";
/// <reference types="vitest" />
import { coverageConfigDefaults } from "vitest/config";

export default getViteConfig({
  test: {
    include: ["src/tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/tests/setup.ts", "@vitest/web-worker"],
    coverage: {
      include: ["src/**"],
      exclude: [
        // Auto-generated - never edit manually
        "src/types/**",
        "src/gql/**",
        "src/env.d.ts",
        // App entry point - Astro internal
        "src/pages/_app.ts",
        "codegen.ts",
        // Astro server-side templates - not unit-testable in jsdom
        "src/**/*.astro",
        // API routes require Astro server context
        "src/pages/api/**",
        // Astro build integrations require build context
        "src/integrations/**",
        // Node.js scripts (logic tested indirectly in lib/validateI18n.test.ts)
        "src/lib/**",
        // GraphQL document exports (constants, no logic)
        "src/services/queries/**",
        "src/services/mutations/**",
        "src/services/fragments/**",
        "src/services/github/**",
        "src/services/api.ts",
        // PWA service worker registration (requires virtual:pwa-register)
        "src/services/pwa.ts",
        // Uses browser localeFrom API not available in jsdom
        "src/stores/i18n.ts",
        // All Astro server-side routes (require Astro server context)
        "src/pages/**",
        // Test files themselves should not be measured
        "src/tests/**",
        // Simple icon wrapper templates (no logic)
        "src/components/icons/**",
        // Browser IIFE that runs on import (requires full DOM environment)
        "src/utils/smooth-scroll-anchor.ts",
        // Astro build/config file (not runtime code)
        "src/astro.config.ts",
        // Astro content collection config (build-time schema definitions)
        "src/content.config.ts",
        // PWA install prompt - disabled feature, requires beforeinstallprompt event
        "src/components/InstallApp.vue",
        // Async wrapper template only - all logic in Webmentions.vue
        "src/components/webmentions/LoadWebmentions.vue",
        // Complex urql + GraphQL pagination - integration-level test only
        "src/components/comments/CommentsClient.vue",
        "src/components/comments/CreateComment.vue",
        ...coverageConfigDefaults.exclude,
      ],
      reportsDirectory: "./tests/unit/coverage",
    },
  },
});
