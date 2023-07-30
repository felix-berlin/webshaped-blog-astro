import { mount } from "@vue/test-utils";
import { it, expect, describe, afterEach, beforeAll } from "vitest";
import {
  useTestStorageEngine,
  setTestStorageKey,
  cleanTestStorage,
} from "@nanostores/persistent";
// @ts-ignore: Unresolved import
import ColorModeToggle from "@components/ColorModeToggle.vue";
import { isDarkMode } from "@stores/store";

describe("ColorModeToggle", () => {
  beforeAll(() => {
    useTestStorageEngine();
  });

  afterEach(() => {
    cleanTestStorage();
  });
  it("toggles the color mode when clicked", async () => {
    setTestStorageKey("darkMode", "false");
    const wrapper = mount(ColorModeToggle, {
      global: {
        mocks: {
          __: (locale, key) => key,
        },
      },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(isDarkMode.get()).toEqual(true);
    expect(wrapper.vm.isDark).toBe(true);
    expect(document.querySelector("html")?.classList.contains("dark")).toBe(
      true,
    );

    await button.trigger("click");

    expect(isDarkMode.get()).toEqual(false);
    expect(wrapper.vm.isDark).toBe(false);
    expect(document.querySelector("html")?.classList.contains("dark")).toBe(
      false,
    );
  });
});
