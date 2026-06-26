// @ts-ignore: Unresolved import
import WebmentionsCount from "@components/webmentions/WebmentionsCount.vue";
import { currentLanguage, currentWebmentionsCount } from "@stores/store";
import { mount } from "@vue/test-utils";
import { it, expect, describe, beforeEach } from "vitest";

describe("WebmentionsCount.vue", () => {
  beforeEach(() => {
    currentLanguage.set("en");
    currentWebmentionsCount.set(0);
  });

  it("renders the component", () => {
    const wrapper = mount(WebmentionsCount, {
      props: { lang: "en" as any },
    });
    expect(wrapper.find(".c-webmentions-count").exists()).toBe(true);
  });

  it("renders as a div by default", () => {
    const wrapper = mount(WebmentionsCount, {
      props: { lang: "en" as any },
    });
    expect(wrapper.find("div.c-webmentions-count").exists()).toBe(true);
  });

  it("renders as a custom element when elementIs is provided", () => {
    const wrapper = mount(WebmentionsCount, {
      props: {
        lang: "en" as any,
        elementIs: "section",
      },
    });
    expect(wrapper.find("section.c-webmentions-count").exists()).toBe(true);
  });

  it("renders the count from the store", () => {
    currentWebmentionsCount.set(5);
    const wrapper = mount(WebmentionsCount, {
      props: { lang: "en" as any },
    });
    expect(wrapper.find(".c-webmentions-count__count").text()).toContain("5");
  });

  it("renders icon element", () => {
    const wrapper = mount(WebmentionsCount, {
      props: { lang: "en" as any },
    });
    expect(wrapper.find(".c-webmentions-count__icon").exists()).toBe(true);
  });
});
