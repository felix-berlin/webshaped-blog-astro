import type { App } from 'vue';
import FloatingVue from 'floating-vue';

export default (app: App) => {
  app.use(FloatingVue);
}
