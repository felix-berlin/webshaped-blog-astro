import type { App } from 'vue';
import FloatingVue from 'floating-vue';

export default (app: App) => {
  app.use(FloatingVue, {
    themes: {
      ...FloatingVue.options.themes,
      'submenu': {
        $extend: 'menu',
        distance: 8,
        placement: 'bottom-start',
        popperClass: 'c-menu__dropdown',
      },
    },
  });
}
