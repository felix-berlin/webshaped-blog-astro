import type { App } from "vue";
import FloatingVue from "floating-vue";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
// import { devtools, attachStores } from '@nanostores/vue/devtools';

// import { currentWebmentionsCount, isDarkMode } from '@stores/store';

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
  // TODO: Fix this
  // app.use(devtools);
  // attachStores(app,
  //   {
  //     'currentWebmentionsCount': currentWebmentionsCount,
  //     'isDarkMode': isDarkMode
  //   }
  // )
};
