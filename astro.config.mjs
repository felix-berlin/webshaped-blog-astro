import { defineConfig } from "astro/config";
import path, { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import prefetch from "@astrojs/prefetch";
import matomo from "astro-matomo";
import serviceWorker from "astrojs-service-worker";
import pagefind from "astro-pagefind";
import Icons from "unplugin-icons/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://develop.webshaped-blog-astro.pages.dev", //TODO:  https://webshaped.de
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  markdown: {
    // Can be 'shiki' (default), 'prism' or false to disable highlighting
    syntaxHighlight: "prism",
  },
  integrations: [
    vue({
      appEntrypoint: "/src/pages/_app",
      script: {
        propsDestructure: true,
      },
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
    plugins: [
      Icons({
        iconCustomizer(collection, icon, props) {
          // customize all icons in this collection
          if (collection === "tabler" || collection === "lucide") {
            props.width = "24";
            props.height = "24";
          }
        },
      }), // chooses the compiler automatically
    ],
    resolve: {
      alias: {
        "@sass-butler/": `${path.resolve(
          __dirname,
          "node_modules/@felix_berlin/sass-butler/",
        )}/`,
        "@styles/": `${path.resolve(__dirname, "src/styles/")}/`,
        "@types/": `${path.resolve(__dirname, "src/types/")}/`,
        "@assets/": `${path.resolve(__dirname, "src/assets/")}/`,
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
