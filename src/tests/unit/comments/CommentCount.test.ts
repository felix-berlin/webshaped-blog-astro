// @ts-ignore: Unresolved import
import CommentCount from "@components/comments/CommentCount.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("CommentCount.vue", () => {
  it("renders the component as a div by default", () => {
    const wrapper = mount(CommentCount);
    expect(wrapper.find("div.c-comment-count").exists()).toBe(true);
  });

  it("renders as a custom element when isElement is provided", () => {
    const wrapper = mount(CommentCount, {
      props: { isElement: "span" },
    });
    expect(wrapper.find("span.c-comment-count").exists()).toBe(true);
  });

  it("renders the comment count of 0 by default", () => {
    const wrapper = mount(CommentCount);
    expect(wrapper.find(".c-comment-count__count").text()).toBe("0");
  });

  it("renders the provided comment count", () => {
    const wrapper = mount(CommentCount, {
      props: { commentTotal: 12 },
    });
    expect(wrapper.find(".c-comment-count__count").text()).toBe("12");
  });

  it("renders null commentTotal as empty", () => {
    const wrapper = mount(CommentCount, {
      props: { commentTotal: null },
    });
    expect(wrapper.find(".c-comment-count__count").text()).toBe("");
  });

  it("renders the icon", () => {
    const wrapper = mount(CommentCount);
    expect(wrapper.find(".c-comment-count__icon").exists()).toBe(true);
  });
});
