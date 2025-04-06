import { mount } from "@vue/test-utils";
import { it, expect, describe, afterEach, beforeAll } from "vitest";
import { useTestStorageEngine, setTestStorageKey, cleanTestStorage } from "@nanostores/persistent";
// @ts-ignore: Unresolved import
import ColorModeToggle from "@components/ColorModeToggle.vue";
import { isDarkMode, language } from "@stores/store";

describe.skip("ColorModeToggle", () => {
  beforeAll(() => {
    useTestStorageEngine();
  });
  afterEach(() => {
    cleanTestStorage();
  });
  it("toggles the color mode when clicked", async () => {
    setTestStorageKey("darkMode", "false");
    setTestStorageKey("language", "{code: 'EN', locale: 'de_DE'}");
    const wrapper = mount(ColorModeToggle, {
      props: {
        lang: {
          locale: "de_DE",
          id: "de",
        },
      },
    });
    const button = wrapper.find("button");
    await button.trigger("click");
    expect(isDarkMode.get()).toEqual(true);
    expect(wrapper.vm.isDark).toBe(true);
    expect(document.querySelector("html")?.classList.contains("dark")).toBe(true);
    await button.trigger("click");
    expect(isDarkMode.get()).toEqual(false);
    expect(wrapper.vm.isDark).toBe(false);
    expect(document.querySelector("html")?.classList.contains("dark")).toBe(false);
  });
});
