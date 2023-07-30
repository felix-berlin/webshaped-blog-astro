/// <reference types="vitest" />

import path, { resolve, dirname } from "node:path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [Vue()],
  test: {
    include: ["tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@components": `${path.resolve(__dirname, "./src/components/")}/`,
      "@stores": `${path.resolve(__dirname, "./store/")}/`,
      "@i18n": `${path.resolve(__dirname, "./src/i18n/")}/`,
      "@layouts": path.resolve(__dirname, "src/layouts/"),
      "@lib": path.resolve(__dirname, "src/lib/"),
    },
  },
});
