import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import CommentItem from "@components/comments/CommentItem.vue";

describe("CommentItem", () => {
  const comment = {
    author: {
      node: {
        name: "John Doe",
      },
    },
    content: "<p>Test comment</p>",
    dateGmt: "2022-01-01T00:00:00",
    replies: {
      nodes: [],
    },
  };
  const wrapper = mount(CommentItem, {
    props: {
      comment,
      depth: 0,
      currentPostId: 1,
      lang: {
        locale: "en_US",
        id: "en",
      },
    },
  });

  it("renders the author name", () => {
    expect(wrapper.find(".c-comment__author-name").text()).toBe("John Doe");
  });

  it("renders the comment content", () => {
    expect(wrapper.find(".c-comment__text").html()).toContain(
      "<p>Test comment</p>",
    );
  });

  it("toggles the reply comment form when the reply button is clicked", async () => {
    const replyButton = wrapper.find(".c-comment__reply-button");
    await replyButton.trigger("click");

    expect(wrapper.vm.replyToCommentForm).toBe(true);
    expect(wrapper.findComponent({ name: "CreateComment" }).exists()).toBe(
      true,
    );
  });

  it("reply button text is there", () => {
    expect(wrapper.find(".c-comment__reply-button").text()).toBe("Reply");
  });

  it("returns false for another user's comment", () => {
    const comment = {
      author: {
        node: {
          id: 2,
        },
      },
      content: "<p>Test comment</p>",
      dateGmt: "2022-01-01T00:00:00",
      replies: {
        nodes: [],
      },
    };
    const wrapper = mount(CommentItem, {
      props: {
        comment,
        depth: 0,
        currentPostId: 1,
        currentUser: {
          id: 1,
        },
        lang: {
          locale: "en_US",
          id: "en",
        },
      },
    });
    expect(wrapper.vm.isAuthor).toBe(false);
  });

  it("returns true for the current user's comment", () => {
    const comment = {
      author: {
        node: {
          id: 1,
        },
      },
      content: "<p>Test comment</p>",
      dateGmt: "2022-01-01T00:00:00",
      replies: {
        nodes: [],
      },
    };
    const wrapper = mount(CommentItem, {
      props: {
        comment,
        depth: 0,
        currentPostId: 1,
        currentUser: {
          id: 1,
        },
        authorId: 1,
        lang: {
          locale: "en_US",
          id: "en",
        },
      },
    });
    expect(wrapper.vm.isAuthor).toBe(true);
  });
});
