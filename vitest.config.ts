import { getViteConfig } from "astro/config";
/// <reference types="vitest" />
import { coverageConfigDefaults } from "vitest/config";

export default getViteConfig({
  test: {
    // No `reporters` set on purpose: Vitest 4.1+ auto-selects the minimal "agent"
    // reporter (failures only) when run from an AI coding agent (via std-env
    // detection) and falls back to the normal verbose reporter for humans.
    // Setting `reporters` explicitly here would disable that auto-detection.
    // `pnpm run test:ci` overrides this via --reporter CLI flags for CI runs.
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
        // GraphQL document exports (constants, no logic)
        "src/services/queries/**",
        "src/services/mutations/**",
        "src/services/fragments/**",
        "src/services/github/**",
        // All Astro server-side routes (require Astro server context)
        "src/pages/**",
        // Test files themselves should not be measured
        "src/tests/**",
        // Simple icon wrapper templates (no logic)
        "src/components/icons/**",
        // Async wrapper template only - all logic in Webmentions.vue
        "src/components/webmentions/LoadWebmentions.vue",
        // urql mutation + form flow - integration-level test only
        "src/components/comments/CreateComment.vue",
        ...coverageConfigDefaults.exclude,
      ],
      reportsDirectory: "./tests/unit/coverage",
    },
  },
});
