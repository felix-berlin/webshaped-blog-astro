import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TabItem from "@components/tabs/TabItem.vue";

describe("TabItem.vue", () => {
  const factory = (props = {}, provide = {}) => {
    return mount(TabItem, {
      props: {
        header: "Tab 1",
        badge: "1",
        ...props,
      },
      global: {
        provide: {
          selectedTabHeader: "Tab 1",
          tabProps: [
            { header: "Kommentare", tabId: "tab-0", tabpanelId: "tabpanel-0" },
            { header: "Webmentions", tabId: "tab-1", tabpanelId: "tabpanel-1" },
          ],
          ...provide,
        },
      },
    });
  };

  it("renders correctly when header matches selectedTabHeader", () => {
    const wrapper = factory();
    expect(wrapper.find(".c-tab").exists()).toBe(true);
  });

  it("does not render when header does not match selectedTabHeader", () => {
    const wrapper = factory({}, { selectedTabHeader: "Tab 2" });
    expect(wrapper.find(".c-tab").exists()).toBe(false);
  });
});
