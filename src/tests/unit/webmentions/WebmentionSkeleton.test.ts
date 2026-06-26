// @ts-ignore: Unresolved import
import WebmentionSkeleton from "@components/webmentions/WebmentionSkeleton.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("WebmentionSkeleton.vue", () => {
  it("renders the skeleton article", () => {
    const wrapper = mount(WebmentionSkeleton);
    expect(wrapper.find("article.c-webmention.is-loading").exists()).toBe(true);
  });

  it("renders the header section", () => {
    const wrapper = mount(WebmentionSkeleton);
    expect(wrapper.find(".c-webmention__header").exists()).toBe(true);
  });

  it("renders the author image placeholder", () => {
    const wrapper = mount(WebmentionSkeleton);
    expect(wrapper.find(".c-webmention__author-image").exists()).toBe(true);
  });

  it("renders the content section", () => {
    const wrapper = mount(WebmentionSkeleton);
    expect(wrapper.find(".c-webmention__content").exists()).toBe(true);
  });
});
