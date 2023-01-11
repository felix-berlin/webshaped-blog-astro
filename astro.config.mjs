import { defineConfig } from 'astro/config';
import path, { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import prefetch from '@astrojs/prefetch';
import critters from "astro-critters";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);



// https://astro.build/config
export default defineConfig({
  site: `https://webshaped.de`,
  experimental: {
    integrations: true
  },
  markdown: {
    // Can be 'shiki' (default), 'prism' or false to disable highlighting
    syntaxHighlight: 'prism',
  },
  integrations: [
    vue({
      appEntrypoint: '/src/pages/_app'
    }), sitemap({
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'de',
        // All urls that don't contain `de` or `en` after `https://webshaped.de/` will be treated as default locale, i.e. `de`
        locales: {
          de: 'de-DE',
          // The `defaultLocale` value must present in `locales` keys
          en: 'en-US'
        }
      }
    }),
    prefetch(),
    critters()
  ],
  // output: import.meta.env.PROD ? 'server' : false,
  // adapter: cloudflare({ mode: "directory" })
  vite: {
    plugins: [],
    resolve: {
      alias: {
        '@sass-butler/': `${path.resolve(__dirname, 'node_modules/@felix_berlin/sass-butler/')}/`,
        '@styles/': `${path.resolve(__dirname, 'src/styles/')}/`
      }
    } // build: {
    //   rollupOptions: {
    //     output: {
    //       entryFileNames: '[name].[hash].js',
    //       chunkFileNames: '[name].[hash].js',
    //       assetFileNames: '[name].[hash][extname]',
    //     },
    //   },
    // },

  }
});
