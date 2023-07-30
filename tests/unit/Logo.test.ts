import { mount } from "@vue/test-utils";
import { it, expect, describe, afterEach } from "vitest";
// @ts-ignore: Unresolved import
import Logo from "@components/Logo.vue";
import { cleanStores, keepMount } from "nanostores";
import { isDarkMode } from "@stores/store";

describe("Logo", () => {
  afterEach(() => {
    cleanStores(isDarkMode);
  });
  it("renders the correct image source based on isDarkMode store", () => {
    keepMount(isDarkMode);
    isDarkMode.set(true);

    const wrapper = mount(Logo, {});

    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe(
      "/assets/logo/web_shaped_logo_2023_light.svg",
    );

    isDarkMode.set(false);
    expect(img.attributes("src")).toBe(
      "/assets/logo/web_shaped_logo_2023_dark.svg",
    );
  });
});
