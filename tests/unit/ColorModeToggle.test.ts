import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import ColorModeToggle from "@components/ColorModeToggle.vue";

describe("ColorModeToggle", () => {
  it("toggles the color mode when clicked", async () => {
    const wrapper = mount(ColorModeToggle, {
      global: {
        mocks: {
          __: (locale, key) => key,
        },
      },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(localStorage.getItem("darkMode")).toBe("true");
    expect(wrapper.vm.state.isDark).toBe(true);
    expect(document.querySelector("html")?.classList.contains("dark")).toBe(
      true,
    );

    await button.trigger("click");

    expect(localStorage.getItem("darkMode")).toBe("false");
    expect(wrapper.vm.state.isDark).toBe(false);
    expect(document.querySelector("html")?.classList.contains("dark")).toBe(
      false,
    );
  });
});
