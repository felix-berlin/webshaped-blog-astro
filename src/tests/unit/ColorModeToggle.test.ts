import { mount } from "@vue/test-utils";
import { JSDOM } from "jsdom";
import { it, expect, describe, beforeAll, afterEach } from "vitest";
// @ts-ignore: Unresolved import
import ColorModeToggle from "@components/ColorModeToggle.vue";
import { isDarkMode, language } from "@stores/store";
import { useTestStorageEngine, setTestStorageKey, cleanTestStorage } from "@nanostores/persistent";

describe("ColorModeToggle", async () => {
  beforeAll(() => {
    useTestStorageEngine();
  });
  afterEach(() => {
    cleanTestStorage();
  });

  it("renders the correct type", async () => {
    // Create a new JSDOM instance
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");

    // Set the global window and document objects to the JSDOM window and document objects
    global.window = dom.window;
    global.document = dom.window.document;

    // Mount the component
    const wrapper = mount(ColorModeToggle);

    // Test that the button toggles the color mode
    const button = wrapper.find("button");
    const html = document.querySelector("html");

    expect(html?.classList.contains("dark")).toBe(false);
    await button.trigger("click");
    expect(html?.classList.contains("dark")).toBe(true);
    await button.trigger("click");
    expect(html?.classList.contains("dark")).toBe(false);
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
