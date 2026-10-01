import type { App } from "vue";

import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import * as store from "@stores/store";
import urql, { cacheExchange, fetchExchange } from "@urql/vue";
import { WP_API } from "astro:env/client";
import FloatingVue from "floating-vue";

export default async (app: App) => {
  app.use(FloatingVue, {
    themes: {
      ...FloatingVue.options.themes,
      submenu: {
        $extend: "menu",
        distance: 8,
        placement: "bottom-start",
        popperClass: "c-menu__dropdown",
      },
    },
  });
  app.use(autoAnimatePlugin);
  app.use(urql, {
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    url: WP_API,
  });
  if (process.env.NODE_ENV !== "production") {
    // Dynamic import keeps @nanostores/logger (a devDependency) out of the production bundle.
    const { devtools } = await import("@nanostores/vue/devtools");
    app.use(devtools, store);
  }
};
