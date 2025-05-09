/// <reference types="vitest" />
import { coverageConfigDefaults } from "vitest/config";
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["src/tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/tests/setup.ts", "@vitest/web-worker"],
    coverage: {
      include: ["src/**"],
      exclude: [
        "src/types/**",
        "src/gql/**",
        "src/env.d.ts",
        "src/pages/_app.ts",
        "codegen.ts",
        ...coverageConfigDefaults.exclude,
      ],
      reportsDirectory: "./tests/unit/coverage",
    },
  },
});
