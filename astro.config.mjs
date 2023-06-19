import { defineConfig } from "astro/config";
import path, { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import prefetch from "@astrojs/prefetch";
import critters from "astro-critters";
import matomo from "astro-matomo";
import serviceWorker from "astrojs-service-worker";
import pagefind from "astro-pagefind";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://develop.webshaped-blog-astro.pages.dev", //TODO:  https://webshaped.de
  build: {
    format: "file",
  },
  markdown: {
    // Can be 'shiki' (default), 'prism' or false to disable highlighting
    syntaxHighlight: "prism",
  },
  integrations: [
    vue({
      appEntrypoint: "/src/pages/_app",
    }),
    sitemap({
      lastmod: new Date(),
      i18n: {
        defaultLocale: "de",
        // All urls that don't contain `de` or `en` after `https://webshaped.de/` will be treated as default locale, i.e. `de`
        locales: {
          de: "de-DE",
          // The `defaultLocale` value must present in `locales` keys
          en: "en-US",
        },
      },
    }),
    prefetch(),
    critters({
      critters: import.meta.env.PROD,
    }),
    matomo({
      enabled: import.meta.env.PROD,
      host: "https://analytics.webshaped.de/",
      siteId: 3,
      debug: true,
      heartBeatTimer: 5,
      disableCookies: true,
    }),
    serviceWorker(),
    pagefind(),
  ],
  // output: import.meta.env.PROD ? 'server' : false,
  // adapter: cloudflare({ mode: "directory" })
  vite: {
    plugins: [],
    resolve: {
      alias: {
        "@sass-butler/": `${path.resolve(
          __dirname,
          "node_modules/@felix_berlin/sass-butler/"
        )}/`,
        "@styles/": `${path.resolve(__dirname, "src/styles/")}/`,
        "@types/": `${path.resolve(__dirname, "src/types/")}/`,
      },
    },
    // build: {
    //   rollupOptions: {
    //     output: {
    //       entryFileNames: '[name].[hash].js',
    //       chunkFileNames: '[name].[hash].js',
    //       assetFileNames: '[name].[hash][extname]',
    //     },
    //   },
    // },
  },
});
