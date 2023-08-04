import { afterAll, afterEach, beforeAll } from "vitest";
import { config } from "@vue/test-utils";

import {
  // Directives
  VTooltip,
  VClosePopper,
  // Components
  Dropdown as VDropdown,
  Tooltip,
  Menu as VMenu,
} from "floating-vue";

beforeAll(() => {
  config.global.components = {
    VDropdown,
    Tooltip,
    VMenu,
  };
  config.global.directives = {
    "close-popper": VClosePopper,
    tooltip: VTooltip,
  };
});
