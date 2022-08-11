import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
	integrations: [preact(), vue(), sitemap()],
	site: `http://astro.build`,
	// output: import.meta.env.PROD ? 'server' : false,
  // adapter: cloudflare({ mode: "directory" })
});
