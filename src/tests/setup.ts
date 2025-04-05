import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { config } from "@vue/test-utils";
import { server } from "./mocks/node.ts";
import { useAutoAnimate } from "@formkit/auto-animate/vue";

import {
  // Directives
  vTooltip,
  vClosePopper,
  // Components
  Dropdown,
  Tooltip,
  Menu,
} from "floating-vue";

vi.stubEnv("WP_API", "https://cms.webshaped.de/api");

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

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
