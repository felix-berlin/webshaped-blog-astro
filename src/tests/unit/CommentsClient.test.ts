import CommentsClient from "@components/comments/CommentsClient.vue";
import { mount } from "@vue/test-utils";
import { HttpResponse } from "msw";
import { graphql } from "msw/graphql";
import { it, expect, describe, vi, beforeEach } from "vitest";

import { server } from "@/tests/mocks/node";

// Same endpoint the urql client in src/tests/setup.ts talks to.
const wordpress = graphql.link("https://cms.webshaped.test/graphql");
const requests = vi.fn();

const commentNode = (id: string, content: string) => ({
  __typename: "Comment",
  id,
  content,
  dateGmt: "2024-01-01T10:00:00",
  parentId: null,
  parentDatabaseId: 0,
  author: {
    __typename: "CommentToCommenterConnectionEdge",
    node: { __typename: "CommentAuthor", id: "a1", name: "Jane", avatar: null },
  },
  replies: { __typename: "CommentToCommentConnection", nodes: [] },
});

const page = (ids: string[], hasNextPage: boolean, endCursor: string) => ({
  comments: {
    __typename: "RootQueryToCommentConnection",
    pageInfo: { __typename: "RootQueryToCommentConnectionPageInfo", hasNextPage, endCursor },
    edges: ids.map((id) => ({
      __typename: "RootQueryToCommentConnectionEdge",
      cursor: id,
      node: commentNode(id, `Comment ${id}`),
    })),
  },
});

const mockComments = (pages: Record<string, ReturnType<typeof page>>) =>
  server.use(
    wordpress.query("GetCommentsById", ({ variables }) => {
      requests(variables);
      return HttpResponse.json({ data: pages[variables.after ?? ""] });
    }),
  );

const mountComments = () =>
  mount(CommentsClient, {
    props: { currentPostId: "42", authorId: "a1", lang: "en" },
    global: { stubs: { CreateComment: true } },
  });

beforeEach(() => requests.mockClear());

describe("CommentsClient", () => {
  it("loads the first page of root comments on mount", async () => {
    mockComments({ "": page(["1", "2"], false, "2") });
    const wrapper = mountComments();

    await vi.waitFor(() => expect(wrapper.findAll(".c-comment__text")).toHaveLength(2));
    expect(requests).toHaveBeenCalledWith(expect.objectContaining({ contentId: "42", first: 5 }));
    expect(wrapper.find(".c-comments__load-more-button").exists()).toBe(false);
  });

  it("shows NoComments when the post has none", async () => {
    mockComments({ "": page([], false, "") });
    const wrapper = mountComments();
    await vi.waitFor(() =>
      expect(wrapper.findComponent({ name: "NoComments" }).exists()).toBe(true),
    );
  });

  it("appends the next page when 'load more' is clicked", async () => {
    mockComments({ "": page(["1"], true, "c1"), c1: page(["2"], false, "c2") });
    const wrapper = mountComments();

    await vi.waitFor(() =>
      expect(wrapper.find(".c-comments__load-more-button").exists()).toBe(true),
    );
    await wrapper.find(".c-comments__load-more-button").trigger("click");

    await vi.waitFor(() => expect(wrapper.findAll(".c-comment__text")).toHaveLength(2));
    expect(requests).toHaveBeenLastCalledWith(expect.objectContaining({ after: "c1" }));
  });
});
