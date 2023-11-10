import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TabItem from "@components/tabs/TabItem.vue";

describe("TabItem.vue", () => {
  it("renders correctly when header is equal to selectedTabHeader", async () => {
    const wrapper = mount(TabItem, {
      props: {
        header: "Tab 1",
        badge: "1",
      },
      global: {
        provide: {
          selectedTabHeader: "Tab 1",
        },
      },
    });

    expect(wrapper.find(".c-tab").exists()).toBe(true);
  });

  it("does not render when header is not equal to selectedTabHeader", async () => {
    const wrapper = mount(TabItem, {
      props: {
        header: "Tab 1",
        badge: "1",
      },
      global: {
        provide: {
          selectedTabHeader: "Tab 2",
        },
      },
    });

    expect(wrapper.find(".c-tab").exists()).toBe(false);
  });
});
