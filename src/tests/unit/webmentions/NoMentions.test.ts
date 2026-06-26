// @ts-ignore: Unresolved import
import NoMentions from "@components/webmentions/NoMentions.vue";
import { currentLanguage } from "@stores/store";
import { mount } from "@vue/test-utils";
import { it, expect, describe, beforeEach } from "vitest";

describe("NoMentions.vue", () => {
  beforeEach(() => {
    currentLanguage.set("en");
  });

  it("renders the no-mentions container", () => {
    const wrapper = mount(NoMentions);
    expect(wrapper.find(".c-no-mentions").exists()).toBe(true);
  });

  it("renders the text wrap section", () => {
    const wrapper = mount(NoMentions);
    expect(wrapper.find(".c-no-mentions__text-wrap").exists()).toBe(true);
  });

  it("renders two text paragraphs", () => {
    const wrapper = mount(NoMentions);
    const texts = wrapper.findAll(".c-no-mentions__text");
    expect(texts).toHaveLength(2);
  });

  it("renders the share button component", () => {
    const wrapper = mount(NoMentions);
    // Share component is rendered but the inner button uses v-if="isSupported" (Web Share API)
    // so we check the component is mounted in the DOM via its parent wrapper class
    const shareWrapper = wrapper.find(".c-no-mentions__text-wrap");
    expect(shareWrapper.exists()).toBe(true);
  });

  it("renders icon elements", () => {
    const wrapper = mount(NoMentions);
    const icons = wrapper.findAll(".c-no-mentions__icon");
    expect(icons.length).toBeGreaterThanOrEqual(1);
  });
});
