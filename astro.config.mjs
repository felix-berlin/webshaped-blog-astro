import { defineConfig } from 'astro/config';
import path, { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import preact from '@astrojs/preact';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import prefetch from '@astrojs/prefetch';
import astroI18next from 'astro-i18next';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
export default defineConfig({
  experimental: {
    integrations: true,
  },
	integrations: [
    preact(),
    vue({ appEntrypoint: '/src/pages/_app' }),
    sitemap(),
    prefetch(),
    // astroI18next()
  ],
	site: `https://webshaped.de`,
	// output: import.meta.env.PROD ? 'server' : false,
  // adapter: cloudflare({ mode: "directory" })
  vite: {
    plugins: [
      vueI18n({
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        // compositionOnly: false,

        // you need to set i18n resource including paths !
        include: resolve(__dirname, './src/locales/**'),
      })
    ],
    resolve: {
      alias: {
        '@sass-butler/': `${path.resolve(__dirname, 'node_modules/@felix_berlin/sass-butler/')}/`,
        '@styles/': `${path.resolve(__dirname, 'src/styles/')}/`,
      }
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
  }
});
