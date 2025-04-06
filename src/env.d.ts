import type { TranslationRoutes } from "@layouts/DefaultLayout.astro";

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="../.astro/astro-env.d.ts" />
declare module "@pagefind/default-ui";

// Extend the Window interface
declare global {
  interface Window {
    translationRoutes?: TranslationRoutes;
  }
}
