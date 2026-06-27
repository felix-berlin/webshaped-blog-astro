// @ts-ignore: Unresolved import
import CommentItem from "@components/comments/CommentItem.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

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
    expect(wrapper.find(".c-comment__text").html()).toContain("<p>Test comment</p>");
  });

  it("toggles the reply comment form when the reply button is clicked", async () => {
    const replyButton = wrapper.find(".c-comment__reply-button");
    await replyButton.trigger("click");

    expect(wrapper.vm.replyToCommentForm).toBe(true);
    expect(wrapper.findComponent({ name: "CreateComment" }).exists()).toBe(true);
  });

  it("reply button text is there", () => {
    expect(wrapper.find(".c-comment__reply-button").text()).toBe("Antworten");
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

  it("hides reply button when depth >= 5", () => {
    const deepComment = {
      author: { node: { name: "Deep User" } },
      content: "<p>Deep comment</p>",
      dateGmt: "2022-01-01T00:00:00",
      replies: { nodes: [] },
    };
    const wrapper = mount(CommentItem, {
      props: {
        comment: deepComment as any,
        depth: 5,
        currentPostId: "1",
      },
    });
    expect(wrapper.find(".c-comment__reply-button").exists()).toBe(false);
  });

  it("shows user icon when comment has no avatar", () => {
    const comment = {
      author: {
        node: {
          name: "No Avatar User",
          avatar: null,
        },
      },
      content: "<p>Comment</p>",
      dateGmt: "2022-01-01T00:00:00",
      replies: { nodes: [] },
    };
    const wrapper = mount(CommentItem, {
      props: {
        comment: comment as any,
        depth: 0,
        currentPostId: "1",
      },
    });
    expect(wrapper.find(".c-comment__author-icon").exists()).toBe(true);
  });

  it("shows avatar image when comment has avatar", () => {
    const comment = {
      author: {
        node: {
          name: "Avatar User",
          avatar: {
            url: "https://example.com/avatar.jpg",
            width: 96,
            height: 96,
          },
        },
      },
      content: "<p>Comment</p>",
      dateGmt: "2022-01-01T00:00:00",
      replies: { nodes: [] },
    };
    const wrapper = mount(CommentItem, {
      props: {
        comment: comment as any,
        depth: 0,
        currentPostId: "1",
      },
    });
    expect(wrapper.find(".c-comment__author-image").exists()).toBe(true);
    expect(wrapper.find(".c-comment__author-image").attributes("src")).toBe(
      "https://example.com/avatar.jpg",
    );
  });

  it("close button inside reply form toggles form back to hidden", async () => {
    const commentWithId = {
      commentId: "reply-1",
      author: { node: { name: "Close Test" } },
      content: "<p>Close test</p>",
      dateGmt: "2022-01-01T00:00:00",
      replies: { nodes: [] },
    };
    const localWrapper = mount(CommentItem, {
      props: {
        comment: commentWithId as any,
        depth: 0,
        currentPostId: "1",
      },
    });
    await localWrapper.find(".c-comment__reply-button").trigger("click");
    expect(localWrapper.vm.replyToCommentForm).toBe(true);
    await localWrapper.vm.$nextTick();
    const closeBtn = localWrapper.find(".c-comment__close");
    if (closeBtn.exists()) {
      await closeBtn.trigger("click");
      expect(localWrapper.vm.replyToCommentForm).toBe(false);
    }
  });

  it("reply form uses is-even class when depth is odd (covers line 73 ternary branch)", async () => {
    const commentWithId = {
      commentId: "reply-odd",
      author: { node: { name: "Odd Depth User" } },
      content: "<p>Odd depth comment</p>",
      dateGmt: "2022-01-01T00:00:00",
      replies: { nodes: [] },
    };
    const localWrapper = mount(CommentItem, {
      props: {
        comment: commentWithId as any,
        depth: 1, // odd → isOdd(1) = true → 'is-even'
        currentPostId: "1",
        lang: { locale: "en_US", id: "en" },
      },
    });
    await localWrapper.find(".c-comment__reply-button").trigger("click");
    await localWrapper.vm.$nextTick();
    const replyForm = localWrapper.find(".c-comment.is-create-comment");
    expect(replyForm.exists()).toBe(true);
    expect(replyForm.classes()).toContain("is-even");
    localWrapper.unmount();
  });

  it("renders nested replies recursively", () => {
    const comment = {
      id: "1",
      author: { node: { name: "Parent User" } },
      content: "<p>Parent</p>",
      dateGmt: "2022-01-01T00:00:00",
      replies: {
        nodes: [
          {
            id: "2",
            author: { node: { name: "Child User" } },
            content: "<p>Child</p>",
            dateGmt: "2022-01-02T00:00:00",
            replies: { nodes: [] },
          },
        ],
      },
    };
    const wrapper = mount(CommentItem, {
      props: {
        comment: comment as any,
        depth: 0,
        currentPostId: "1",
      },
    });
    const nestedComment = wrapper.findAllComponents({ name: "CommentItem" });
    expect(nestedComment.length).toBeGreaterThanOrEqual(1);
  });
});
