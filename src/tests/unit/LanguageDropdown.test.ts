// @ts-ignore: Unresolved import
import LanguageDropdown from "@components/LanguageDropdown.vue";
import { currentLanguage, translationRoutes } from "@stores/store";
import { mount } from "@vue/test-utils";
import { it, expect, describe, beforeEach } from "vitest";

describe("LanguageDropdown.vue", () => {
  beforeEach(() => {
    currentLanguage.set("de");
    translationRoutes.set({ de: "/de/about", en: "/en/about" });
  });

  it("renders the dropdown button", () => {
    const wrapper = mount(LanguageDropdown);
    expect(wrapper.find(".c-button.c-button--icon").exists()).toBe(true);
  });

  it("renders a VDropdown component", () => {
    const wrapper = mount(LanguageDropdown);
    expect(wrapper.findComponent({ name: "VDropdown" }).exists()).toBe(true);
  });

  it("renders with the correct button classes", () => {
    const wrapper = mount(LanguageDropdown);
    const button = wrapper.find(".c-button");
    expect(button.exists()).toBe(true);
    expect(button.classes()).toContain("c-button--icon");
  });

  it("does not render links before dropdown is opened (popper slot is lazy)", () => {
    const wrapper = mount(LanguageDropdown);
    // The c-lang-dropdown items are inside VDropdown's #popper slot which
    // is only rendered when the dropdown is opened (floating-vue default lazy behavior)
    const items = wrapper.findAll(".c-lang-dropdown__item");
    expect(items.length).toBe(0);
  });

  it("renders language menu items when VDropdown popper slot is rendered (covers lines 6-11)", () => {
    const wrapper = mount(LanguageDropdown, {
      global: {
        stubs: {
          VDropdown: {
            template: '<div><slot /><slot name="popper" /></div>',
          },
        },
      },
    });
    const items = wrapper.findAll(".c-lang-dropdown__item");
    expect(items.length).toBeGreaterThan(0);
  });

  it("active language link has is-active class when lang matches", () => {
    currentLanguage.set("de");
    const wrapper = mount(LanguageDropdown, {
      global: {
        stubs: {
          VDropdown: {
            template: '<div><slot /><slot name="popper" /></div>',
          },
        },
      },
    });
    const activeLink = wrapper.find(".c-lang-dropdown__link.is-active");
    expect(activeLink.exists()).toBe(true);
  });
});
