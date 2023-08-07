import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { it, expect, describe, beforeAll, vi } from "vitest";
// @ts-ignore: Unresolved import
import CommentsClient from "@components/comments/CommentsClient.vue";

describe("CommentsClient", () => {
  it("renders the component", () => {
    const wrapper = mount(CommentsClient, {
      props: {
        currentPostId: 1,
        id: "2",
        authorId: "dXNlcjox",
        lang: {
          locale: "en_US",
          id: "en",
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("displays a message when there are no comments", async () => {
    const wrapper = mount(CommentsClient, {
      props: {
        currentPostId: 1,
        id: "2",
        authorId: "dXNlcjox",
        lang: {
          locale: "en_US",
          id: "en",
        },
      },
    });

    wrapper.vm.data = {
      hasComments: false,
      hasLoaded: true,
    };
    // await nextTick();
    // console.log("wrapper", wrapper.html());

    // expect(wrapper.find(".c-comments__no-comments").text()).toBe(
    //   "No comments available.",
    // );
  });

  // it("displays a list of comments", async () => {
  //   const wrapper = mount(CommentsClient, {
  //     props: {
  //       currentPostId: "1",
  //       id: "2",
  //       authorId: "3",
  //       lang: {
  //         locale: "en_US",
  //         id: "en",
  //       },
  //     },
  //   });

  //   await wrapper.setData({
  //     data: {
  //       comments: [
  //         {
  //           node: {
  //             id: "1",
  //             author: {
  //               name: "John Doe",
  //             },
  //             content: "This is a comment.",
  //             createdAt: "2021-10-01T00:00:00Z",
  //             parentId: null,
  //           },
  //         },
  //         {
  //           node: {
  //             id: "2",
  //             author: {
  //               name: "Jane Doe",
  //             },
  //             content: "This is a reply.",
  //             createdAt: "2021-10-02T00:00:00Z",
  //             parentId: "1",
  //           },
  //         },
  //       ],
  //       hasComments: true,
  //     },
  //   });

  //   expect(wrapper.findAll(".c-comment")).toHaveLength(2);
  // });

  // it('loads more comments when the "Load more" button is clicked', async () => {
  //   const wrapper = mount(CommentsClient, {
  //     props: {
  //       currentPostId: "1",
  //       id: "2",
  //       authorId: "3",
  //       lang: {
  //         locale: "en_US",
  //         id: "en",
  //       },
  //     },
  //   });

  //   await wrapper.setData({
  //     data: {
  //       pageInfo: {
  //         hasNextPage: true,
  //         endCursor: "abc",
  //       },
  //     },
  //   });

  //   const button = wrapper.find(".c-comments__load-more-button");
  //   await button.trigger("click");

  //   expect(wrapper.emitted("load-more")).toBeTruthy();
  // });
});
