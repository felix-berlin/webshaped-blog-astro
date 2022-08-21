import { defineConfig } from 'astro/config';
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import preact from '@astrojs/preact';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import prefetch from '@astrojs/prefetch';
import astroI18next from "astro-i18next";
import vueI18n from '@intlify/vite-plugin-vue-i18n';

// https://astro.build/config
export default defineConfig({
  experimental: {
    integrations: true,
  },
	integrations: [preact(), vue(), sitemap(), prefetch(), astroI18next({
    baseLanguage: "de",
    i18next: {
      debug: true, // convenient during development to check for missing keys
      supportedLngs: ["de", "en"],
    },
  })],
	site: `http://astro.build`,
	// output: import.meta.env.PROD ? 'server' : false,
  // adapter: cloudflare({ mode: "directory" })
  vite: {
    plugins: [
      vue({
        reactivityTransform: true
      }),
      vueI18n({
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        // compositionOnly: false,

        // you need to set i18n resource including paths !
        include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
      })
    ]
  }
});
