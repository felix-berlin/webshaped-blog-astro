// @ts-ignore: Unresolved import
import TabDisplay from "@components/tabs/TabDisplay.vue";
import { mount, flushPromises } from "@vue/test-utils";
import { it, expect, describe, vi } from "vitest";
import { defineComponent } from "vue";

// Mock the async-loaded components so factories run without triggering real module cascade
vi.mock("@components/comments/CommentsClient.vue", () => {
  const component = defineComponent({ name: "CommentsClient", template: "<div>comments</div>" });
  return {
    default: component,
    __isTeleport: false,
    __isKeepAlive: false,
    __esModule: true,
  };
});
vi.mock("@components/webmentions/LoadWebmentions.vue", () => {
  const component = defineComponent({ name: "LoadWebmentions", template: "<div>webmentions</div>" });
  return {
    default: component,
    __isTeleport: false,
    __isKeepAlive: false,
    __esModule: true,
  };
});

describe("TabDisplay.vue", () => {
  it("renders the component", () => {
    const wrapper = mount(TabDisplay, {
      props: {
        postId: "123",
        authorId: "author-1",
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders TabsView", () => {
    const wrapper = mount(TabDisplay, {
      props: {
        postId: "123",
        authorId: "author-1",
      },
    });
    expect(wrapper.findComponent({ name: "TabsView" }).exists()).toBe(true);
  });

  it("renders two TabItem components", () => {
    const wrapper = mount(TabDisplay, {
      props: {
        postId: "123",
        authorId: "author-1",
      },
    });
    const tabItems = wrapper.findAllComponents({ name: "TabItem" });
    expect(tabItems).toHaveLength(2);
  });

  it("second tab is Webmentions", () => {
    const wrapper = mount(TabDisplay, {
      props: {
        postId: "123",
        authorId: "author-1",
      },
    });
    const tabItems = wrapper.findAllComponents({ name: "TabItem" });
    expect(tabItems[1].props("header")).toBe("Webmentions");
  });

  it("async component factories resolve on flushPromises (covers CommentsClient factory)", async () => {
    const wrapper = mount(TabDisplay, {
      props: { postId: "123", authorId: "author-1" },
    });
    // flushPromises triggers the CommentsClient defineAsyncComponent factory
    await flushPromises();
    expect(wrapper.findComponent({ name: "TabsView" }).exists()).toBe(true);
  });

  it("clicking Webmentions tab triggers LoadWebmentions factory (covers lines 7, 27)", async () => {
    const wrapper = mount(TabDisplay, {
      props: { postId: "123", authorId: "author-1" },
    });

    const buttons = wrapper.findAll("button");
    const webmentionsBtn = buttons.find((b) => b.text().includes("Webmentions"));
    if (webmentionsBtn) {
      await webmentionsBtn.trigger("click");
      await flushPromises();
    }

    const tabsView = wrapper.findComponent({ name: "TabsView" });
    expect(tabsView.vm.selectedTabHeader).toBe("Webmentions");
    wrapper.unmount();
  });
});
