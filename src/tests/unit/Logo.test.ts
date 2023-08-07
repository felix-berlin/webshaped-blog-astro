import { mount } from "@vue/test-utils";
import { it, expect, describe, afterEach, beforeAll } from "vitest";
import {
  useTestStorageEngine,
  setTestStorageKey,
  cleanTestStorage,
} from "@nanostores/persistent";
// @ts-ignore: Unresolved import
import Logo from "@components/Logo.vue";
import { isDarkMode } from "@stores/store";

describe("Logo", () => {
  beforeAll(() => {
    useTestStorageEngine();
  });

  afterEach(() => {
    cleanTestStorage();
  });

  it("has the light logo variant in dark mode", () => {
    setTestStorageKey("darkMode", "true");
    const wrapper = mount(Logo);
    const img = wrapper.find("img");

    expect(isDarkMode.get()).toEqual(true);
    expect(img.attributes("src")).toBe(
      "/assets/logo/web_shaped_logo_2023_light.svg",
    );
  });

  it("has the dark logo variant in dark mode", () => {
    setTestStorageKey("darkMode", "false");
    const wrapper = mount(Logo);
    const img = wrapper.find("img");

    expect(isDarkMode.get()).toEqual(false);
    expect(img.attributes("src")).toBe(
      "/assets/logo/web_shaped_logo_2023_dark.svg",
    );
  });
});
