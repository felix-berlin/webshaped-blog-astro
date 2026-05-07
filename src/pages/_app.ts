import type { App } from "vue";

import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import { devtools } from "@nanostores/vue/devtools";
import * as store from "@stores/store";
import urql, { cacheExchange, fetchExchange } from "@urql/vue";
import { WP_API } from "astro:env/client";
import FloatingVue from "floating-vue";

export default (app: App) => {
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
    app.use(devtools, store); // Only enable devtools in non-production environments
  }
};
