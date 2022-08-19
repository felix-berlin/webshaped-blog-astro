import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import prefetch from '@astrojs/prefetch';

// https://astro.build/config
export default defineConfig({
	integrations: [preact(), vue(), sitemap(), prefetch()],
	site: `http://astro.build`,
	// output: import.meta.env.PROD ? 'server' : false,
  // adapter: cloudflare({ mode: "directory" })
  vite: {
    plugins: [
      vue({
        reactivityTransform: true
      })
    ]
  }
});
