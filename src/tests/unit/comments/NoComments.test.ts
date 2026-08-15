// @ts-ignore: Unresolved import
import NoComments from "@components/comments/NoComments.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("NoComments.vue", () => {
  it("renders the no-comments container", () => {
    const wrapper = mount(NoComments, { props: { lang: "de" } });
    expect(wrapper.find(".c-no-comments").exists()).toBe(true);
  });

  it("renders the text wrap", () => {
    const wrapper = mount(NoComments, { props: { lang: "de" } });
    expect(wrapper.find(".c-no-comments__text-wrap").exists()).toBe(true);
  });

  it("renders two text elements", () => {
    const wrapper = mount(NoComments, { props: { lang: "de" } });
    const texts = wrapper.findAll(".c-no-comments__text");
    expect(texts).toHaveLength(2);
  });

  it("second text contains anchor link to createComment", () => {
    const wrapper = mount(NoComments, { props: { lang: "de" } });
    const textTwo = wrapper.find(".c-no-comments__text.is-two");
    expect(textTwo.html()).toContain("#createComment");
  });

  it("renders icon elements", () => {
    const wrapper = mount(NoComments, { props: { lang: "de" } });
    const icons = wrapper.findAll(".c-no-comments__icon");
    expect(icons.length).toBeGreaterThanOrEqual(1);
  });
});
