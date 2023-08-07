/// <reference types="vitest" />

import path from "node:path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [Vue()],
  test: {
    include: [
      "src/tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@components": `${path.resolve(__dirname, "./src/components/")}/`,
      "@stores": `${path.resolve(__dirname, "./src/stores/")}/`,
      "@i18n": `${path.resolve(__dirname, "./src/i18n/")}/`,
      "@layouts": path.resolve(__dirname, "./src/layouts/"),
      "@lib": path.resolve(__dirname, "./src/lib/"),
      "@utils": path.resolve(__dirname, "./src/utils/"),
      "@ts_types": path.resolve(__dirname, "./src/types/"),
      "@features": path.resolve(__dirname, "./src/features/"),
      "@services": path.resolve(__dirname, "./src/services/"),
    },
  },
});
