// @ts-ignore: Unresolved import
import Comments from "@components/comments/Comments.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

const makeComment = (id: string, name: string) => ({
  id,
  databaseId: parseInt(id),
  commentId: parseInt(id),
  content: `<p>Comment from ${name}</p>`,
  dateGmt: "2024-01-15T10:00:00",
  status: "APPROVE",
  parentId: null,
  author: {
    node: {
      id: `author-${id}`,
      name,
      avatar: {
        url: "https://example.com/avatar.jpg",
        width: 96,
        height: 96,
      },
    },
  },
  replies: { nodes: [] },
});

describe("Comments.vue", () => {
  it("renders the comments section", () => {
    const wrapper = mount(Comments, {
      props: {
        authorId: "author-1",
        comments: { nodes: [] as any },
        currentPostId: 1,
        lang: "en",
      },
    });
    expect(wrapper.find(".c-comments").exists()).toBe(true);
  });

  it("renders a headline", () => {
    const wrapper = mount(Comments, {
      props: {
        authorId: "author-1",
        comments: { nodes: [] as any },
        currentPostId: 1,
        lang: "en",
      },
    });
    expect(wrapper.find("h2").exists()).toBe(true);
  });

  it("shows 'no comments' message when comments array is empty", () => {
    const wrapper = mount(Comments, {
      props: {
        authorId: "author-1",
        comments: { nodes: [] as any },
        currentPostId: 1,
        lang: "en",
      },
    });
    const p = wrapper.find("p");
    expect(p.exists()).toBe(true);
    expect(p.text()).toBeTruthy();
  });

  it("does not show 'no comments' message when there are comments", () => {
    const comments = { nodes: [makeComment("1", "Alice")] as any };
    const wrapper = mount(Comments, {
      props: {
        authorId: "author-1",
        comments,
        currentPostId: 1,
        lang: "en",
      },
    });
    // The "no comments" p is a direct child of .c-comments; use native DOM selector
    const noCommentsP = wrapper.element.querySelector(".c-comments > p");
    expect(noCommentsP).toBeNull();
  });

  it("renders CommentItem for each comment", () => {
    const comments = {
      nodes: [makeComment("1", "Alice"), makeComment("2", "Bob")] as any,
    };
    const wrapper = mount(Comments, {
      props: {
        authorId: "author-1",
        comments,
        currentPostId: 1,
        lang: "en",
      },
    });
    const commentItems = wrapper.findAllComponents({ name: "CommentItem" });
    expect(commentItems).toHaveLength(2);
  });

  it("renders CreateComment component", () => {
    const wrapper = mount(Comments, {
      props: {
        authorId: "author-1",
        comments: { nodes: [] as any },
        currentPostId: 1,
        lang: "en",
      },
    });
    expect(wrapper.findComponent({ name: "CreateComment" }).exists()).toBe(true);
  });

  it("passes currentPostId to CreateComment", () => {
    const wrapper = mount(Comments, {
      props: {
        authorId: "author-1",
        comments: { nodes: [] as any },
        currentPostId: 42,
        lang: "en",
      },
    });
    const createComment = wrapper.findComponent({ name: "CreateComment" });
    expect(createComment.props("currentPostId")).toBe(42);
  });
});
