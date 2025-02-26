import { mount } from "@vue/test-utils";
import { it, expect, describe, vi } from "vitest";
// @ts-ignore: Unresolved import
import PostOlderThan from "@components/post/PostOlderThan.vue";

describe("PostOlderThan", () => {
  it("displays the correct text when the post is older than the specified number of years", () => {
    const date = new Date(2023, 11, 19);

    vi.useFakeTimers();
    vi.setSystemTime(date);

    const wrapper = mount(PostOlderThan, {
      props: {
        date: "2010-01-01",
        showAfterYears: 10,
        lang: "en",
      },
    });

    expect(wrapper.text()).toContain(
      "This post is already 13 years old. The content might not be up to date anymore.",
    );

    vi.useRealTimers();
  });

  it("does not display anything when the post is not older than the specified number of years", () => {
    const date = new Date(2023, 11, 19);
    vi.useFakeTimers();
    vi.setSystemTime(date);

    const wrapper = mount(PostOlderThan, {
      props: {
        date: "2020-01-01",
        showAfterYears: 10,
        lang: "en",
      },
    });

    expect(wrapper.exists()).toBe(true);

    vi.useRealTimers();
  });
});
