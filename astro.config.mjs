import { defineConfig, envField } from "astro/config";
import vue from "@astrojs/vue";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import matomo from "astro-matomo";
import Icons from "unplugin-icons/vite";
// import AstroPWA from "@vite-pwa/astro";
import sentry from "@sentry/astro";
import codecovplugin from "@codecov/astro-plugin";
import { default as pagefind } from "./src/integrations/pagefind.ts";
import { visualizer } from "rollup-plugin-visualizer";
import { version } from "./package.json";
import spotlightjs from "@spotlightjs/astro";
import graphqlLoader from "vite-plugin-graphql-loader";

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
} = loadEnv(process.env.NODE_ENV, process.cwd(), "");
// console.log("TEST", new URL(WP_API).host);

const apiHost = new URL(WP_API).host;

const visualizerPlugin = visualizer({
  open: BUNDLE_ANALYZER_OPEN === "true",
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
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  experimental: {
    responsiveImages: true,
    clientPrerender: true,
  },
  redirects: {
    "/category/web-analytics": "/de/category/matomo/1",
  },
  integrations: [
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
    //     enabled: PWA_DEBUG === "true",
    //     navigateFallbackAllowlist: [/^\/$/],
    //   },
    //   experimental: {
    //     directoryAndTrailingSlashHandler: true,
    //   },
    // }),
    sentry({
      release: {
        name: version,
      },
      dsn: SENTRY_DSN,
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
    codecovplugin({
      enableBundleAnalysis: true,
      bundleName: "web-shaped-bundle",
      uploadToken: CODECOV_TOKEN,
    }),
    (await import("@playform/inline")).default(),
  ],
  env: {
    schema: {
      WP_API: envField.string({ context: "client", access: "public", optional: false, url: true }),
      WP_REST_API: envField.string({
        context: "client",
        access: "public",
        optional: false,
        url: true,
      }),
      WP_AUTH_REFRESH_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      LAST_FM_SCROBBLER_API: envField.string({
        context: "client",
        access: "public",
        optional: false,
        url: true,
      }),
      ENABLE_ANALYTICS: envField.boolean({ context: "client", access: "public", default: false }),
      SENTRY_DSN: envField.string({
        context: "server",
        access: "public",
        optional: true,
        url: true,
      }),
      SENTRY_PROJECT_ID: envField.string({ context: "server", access: "public", optional: true }),
      SENTRY_AUTH_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
      SENTRY_ENVIRONMENT: envField.string({ context: "server", access: "public", optional: true }),
      GITHUB_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
      SITE_URL: envField.string({
        context: "client",
        access: "public",
        optional: false,
        url: true,
      }),
      CODECOV_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      PWA_DEBUG: envField.boolean({ context: "server", access: "public", default: false }),
      BUNDLE_ANALYZER_OPEN: envField.boolean({
        context: "server",
        access: "public",
        default: false,
      }),
      SHOW_TEST_DATA: envField.boolean({
        context: "client",
        access: "public",
        default: false,
      }),
    },
  },
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
      BUNDLE_ANALYZER_OPEN === "true" ? visualizerPlugin : null,
      graphqlLoader({ sourceMapOptions: { hires: true } }),
    ],

    css: {
      preprocessorMaxWorkers: true,
    },

    build: {
      sourcemap: true, // This is needed for sentryVitePlugin
    },
  },
});
