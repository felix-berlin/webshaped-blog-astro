import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import vue from "@astrojs/vue";
import codecovAstroPlugin from "@codecov/astro-plugin";
// import AstroPWA from "@vite-pwa/astro";
import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";
import varlockAstroIntegration from "@varlock/astro-integration";
import matomo from "astro-matomo";
import { defineConfig } from "astro/config";
import { visualizer } from "rollup-plugin-visualizer";
import Icons from "unplugin-icons/vite";
import { ENV } from "varlock/env";
import graphqlLoader from "vite-plugin-graphql-loader";

import { version } from "./package.json";
import { default as pagefind } from "./src/integrations/pagefind.ts";

const sassAliases = {
  "@sass-butler/": new URL("./node_modules/@felix_berlin/sass-butler/", import.meta.url),
  "@styles/": new URL("./src/styles/", import.meta.url),
};

// Values come from varlock, validated against .env.schema before this runs —
// booleans arrive as real booleans, so no string comparisons here.
const {
  WP_API,
  SENTRY_DSN,
  SENTRY_PROJECT_ID,
  SENTRY_AUTH_TOKEN,
  SITE_URL,
  CODECOV_TOKEN,
  ENABLE_ANALYTICS,
  PWA_DEBUG,
  BUNDLE_ANALYZER_OPEN,
} = ENV;
// console.log("TEST", new URL(WP_API).host);

const apiHost = new URL(WP_API).host;

const visualizerPlugin = visualizer({
  open: BUNDLE_ANALYZER_OPEN,
  template: "treemap",
  gzipSize: true,
  brotliSize: true,
});

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  site: SITE_URL,
  trailingSlash: "never",
  markdown: {
    syntaxHighlight: "shiki",
    // shikiConfig: {
    //   experimentalThemes: {
    //     light: "github-light",
    //     dark: "github-dark",
    //   },
    // },
  },
  image: {
    domains: [apiHost],
    remotePatterns: [{ protocol: "https" }],
    responsiveStyles: true,
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  experimental: {
    clientPrerender: true,
  },
  redirects: {
    "/category/web-analytics": "/de/category/matomo/1",
  },
  integrations: [
    varlockAstroIntegration(),
    pagefind(),
    vue({
      appEntrypoint: "/src/pages/_app",
      // devtools: {
      //   launchEditor: "code",
      // },
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
    matomo({
      enabled: ENABLE_ANALYTICS,
      host: "https://analytics.webshaped.de/",
      siteId: 3,
      debug: false,
      heartBeatTimer: 5,
      disableCookies: true,
      viewTransition: {
        contentElement: "main",
      },
    }),
    // FIXME: PWA is not working (manifest is not found ect.)
    // AstroPWA({
    //   $schema: "https://json.schemastore.org/web-manifest-combined.json",
    //   mode: import.meta.env.DEV ? "development" : "production",
    //   base: "/",
    //   scope: "/",
    //   includeAssets: ["**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,avif,woff2,ico,txt}"],
    //   registerType: "autoUpdate",
    //   manifest: {
    //     name: "Web Shaped",
    //     short_name: "WS",
    //     theme_color: "#ffffff",
    //     background_color: "#303956",
    //     lang: "en",
    //     icons: [
    //       {
    //         src: "android-chrome-192x192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //       {
    //         src: "android-chrome-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "android-chrome-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //         purpose: "any maskable",
    //       },
    //     ],
    //   },
    //   workbox: {
    //     globDirectory: "dist",
    //     // navigateFallback: "/404",
    //     globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,avif,woff2,ico,txt}"],
    //   },
    //   devOptions: {
    //     enabled: PWA_DEBUG,
    //     navigateFallbackAllowlist: [/^\/$/],
    //   },
    //   experimental: {
    //     directoryAndTrailingSlashHandler: true,
    //   },
    // }),
    sentry({
      telemetry: false,
      sourceMapsUploadOptions: {
        project: SENTRY_PROJECT_ID,
        authToken: SENTRY_AUTH_TOKEN,
        filesToDeleteAfterUpload: ["dist/**/*.map"],
      },
      debug: false,
      bundleSizeOptimizations: {
        excludeDebugStatements: true,
        excludeReplayShadowDom: true,
        excludeReplayIframe: true,
      },
    }),
    // spotlightjs(),
    codecovAstroPlugin({
      enableBundleAnalysis: true,
      bundleName: "web-shaped-bundle",
      uploadToken: CODECOV_TOKEN,
      telemetry: false,
    }),
    (await import("@playform/inline")).default({
      // Conservative Beasties setup to keep critical CSS benefits
      // while avoiding destructive stylesheet rewrites.
      Beasties: {
        pruneSource: false,
        mergeStylesheets: false,
        preload: "swap",
      },
      Logger: 0,
    }),
  ],
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
      BUNDLE_ANALYZER_OPEN ? visualizerPlugin : null,
      graphqlLoader({ sourceMapOptions: { hires: true } }),
    ],

    css: {
      preprocessorMaxWorkers: true,
      transformer: "postcss",
      preprocessorOptions: {
        scss: {
          importers: [
            {
              findFileUrl(url) {
                for (const [prefix, base] of Object.entries(sassAliases)) {
                  if (url.startsWith(prefix)) {
                    return new URL(url.slice(prefix.length), base);
                  }
                }

                return null;
              },
            },
          ],
        },
      },
    },

    build: {
      sourcemap: true, // This is needed for sentryVitePlugin
    },
  },
});
