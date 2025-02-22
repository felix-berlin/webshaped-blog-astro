import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import matomo from "astro-matomo";
import serviceWorker from "astrojs-service-worker";
import Icons from "unplugin-icons/vite";
// import AstroPWA from "@vite-pwa/astro";
// import sentry from "@sentry/astro";

const { PUBLIC_WP_API } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

const apiHost = new URL(PUBLIC_WP_API).host;

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: node({
    mode: "standalone",
  }),
  site: import.meta.env.DEV
    ? "http://localhost:4321"
    : "https://develop.webshaped-blog-astro.pages.dev",
  //TODO:  https://webshaped.de
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
  prefetch: true,
  integrations: [
    vue({
      appEntrypoint: "/src/pages/_app",
      script: {
        propsDestructure: true,
      },
      devtools: {
        launchEditor: "code",
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
    matomo({
      enabled: import.meta.env.PROD,
      host: "https://analytics.webshaped.de/",
      siteId: 3,
      debug: true,
      heartBeatTimer: 5,
      disableCookies: true,
    }),
    serviceWorker(),
    // TODO: replace service worker with AstroPWA
    // AstroPWA({
    //   mode: "development",
    //   base: "/",
    //   scope: "/",
    //   // includeAssets: ["favicon.svg"],
    //   registerType: "autoUpdate",
    //   manifest: {
    //     name: "Web Shaped",
    //     short_name: "Web Shaped",
    //     theme_color: "#ffffff",
    //     display: "standalone",
    //     start_url: "/",
    //     id: "/",
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
    //     navigateFallback: "/404",
    //     globPatterns: [
    //       "**/*.{css,js,html,svg,png,avif,webp,ico,txt,woff,woff2}",
    //     ],
    //   },
    //   devOptions: {
    //     enabled: true,
    //     navigateFallbackAllowlist: [/^\/404$/],
    //   },
    // }),
    //
    // TODO: on hold, cloudflare pages is not yet supported
    // @see: https://docs.sentry.io/platforms/javascript/guides/astro/#compatibility
    // sentry({
    //   dsn: import.meta.env.SENTRY_DSN,
    //   sourceMapsUploadOptions: {
    //     project: import.meta.env.SENTRY_PROJECT_ID,
    //     authToken: import.meta.env.SENTRY_AUTH_TOKEN,
    //   },
    // }),
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

    css: {
      preprocessorMaxWorkers: true,
    },

    build: {
      sourcemap: true, // This is needed for sentryVitePlugin
    },
  },
});
