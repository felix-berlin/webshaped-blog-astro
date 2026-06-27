// @ts-ignore: Unresolved import
import ButtonBar from "@components/main-nav/ButtonBar.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("ButtonBar.vue", () => {
  it("renders the button bar container", () => {
    const wrapper = mount(ButtonBar);
    expect(wrapper.find(".c-main-nav__button-bar").exists()).toBe(true);
  });

  it("renders the buttons container", () => {
    const wrapper = mount(ButtonBar);
    expect(wrapper.find(".c-main-nav__buttons").exists()).toBe(true);
  });

  it("renders SearchModal component", () => {
    const wrapper = mount(ButtonBar);
    expect(wrapper.findComponent({ name: "SearchModal" }).exists()).toBe(true);
  });

  it("renders LanguageDropdown component", () => {
    const wrapper = mount(ButtonBar);
    expect(wrapper.findComponent({ name: "LanguageDropdown" }).exists()).toBe(true);
  });

  it("renders RssLink component", () => {
    const wrapper = mount(ButtonBar);
    expect(wrapper.findComponent({ name: "RssLink" }).exists()).toBe(true);
  });
});
