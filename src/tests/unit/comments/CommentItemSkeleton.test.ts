// @ts-ignore: Unresolved import
import CommentItemSkeleton from "@components/comments/CommentItemSkeleton.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("CommentItemSkeleton.vue", () => {
  it("renders without errors", () => {
    const wrapper = mount(CommentItemSkeleton);
    expect(wrapper.exists()).toBe(true);
  });

  it("has loading class", () => {
    const wrapper = mount(CommentItemSkeleton);
    expect(wrapper.find(".c-comment.is-loading").exists()).toBe(true);
  });

  it("renders the article element", () => {
    const wrapper = mount(CommentItemSkeleton);
    expect(wrapper.find("article.c-comment__item").exists()).toBe(true);
  });
});
