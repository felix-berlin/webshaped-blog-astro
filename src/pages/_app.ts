import type { App } from "vue";

import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import * as store from "@stores/store";
import urql, { cacheExchange, fetchExchange } from "@urql/vue";
import { WP_API } from "astro:env/client";
import FloatingVue from "floating-vue";

export default async (app: App) => {
  app.use(FloatingVue);
  app.use(autoAnimatePlugin);

  // Astro runs this once per server-rendered Vue component; only the client-only
  // comment islands query WordPress through urql, so skip the client (and the
  // devtools) on the server.
  if (import.meta.env.SSR) return;

  app.use(urql, {
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    url: WP_API,
  });
  if (import.meta.env.DEV) {
    // Dynamic import keeps @nanostores/logger (a devDependency) out of the production bundle.
    const { devtools } = await import("@nanostores/vue/devtools");
    app.use(devtools, store);
  }
};
