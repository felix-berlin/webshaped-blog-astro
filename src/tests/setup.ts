import { useAutoAnimate } from "@formkit/auto-animate/vue";
import urql, { cacheExchange, fetchExchange } from "@urql/vue";
import { config } from "@vue/test-utils";
import {
  // Directives
  vTooltip,
  vClosePopper,
  // Components
  Dropdown,
  Tooltip,
  Menu,
} from "floating-vue";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "./mocks/node.ts";

// Fixed endpoint for the MSW handlers. Deliberately not read from the real
// config: tests must not depend on which environment Infisical resolved, and a
// vi.stubEnv here would run after astro:env/client is already imported, so it
// never takes effect anyway.
const WP_API = "https://cms.webshaped.test/graphql";

config.global.components = {
  VDropdown: Dropdown,
  VTooltip: Tooltip,
  VMenu: Menu,
};

config.global.directives = {
  "close-popper": vClosePopper,
  tooltip: vTooltip,
  "auto-animate": useAutoAnimate,
};

config.global.plugins = [
  [
    urql,
    {
      url: WP_API,
      fetchOptions: {
        headers: {
          "Content-Type": "application/json",
        },
      },
      exchanges: [cacheExchange, fetchExchange],
    },
  ],
];

class ResizeObserverMock {
  callback: ResizeObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    (globalThis as any).__lastResizeObserver = this;
  }
}
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

class IntersectionObserverMock {
  callback: IntersectionObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
    this.callback = callback;
  }
}
vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
