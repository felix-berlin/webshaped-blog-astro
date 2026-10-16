import TabItem from "@components/tabs/TabItem.vue";
import { SelectedTabKey, TabsKey } from "@components/tabs/tabs";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { ref } from "vue";

describe("TabItem.vue", () => {
  const factory = (props = {}, { selectedTabHeader = "Tab 1" } = {}) => {
    return mount(TabItem, {
      props: {
        header: "Tab 1",
        badge: "1",
        ...props,
      },
      global: {
        provide: {
          [SelectedTabKey]: ref(selectedTabHeader),
          [TabsKey]: [
            { header: "Tab 1", tabId: "tab-0", tabpanelId: "tabpanel-0" },
            { header: "Tab 2", tabId: "tab-1", tabpanelId: "tabpanel-1" },
          ],
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

describe("TabItem.vue aria wiring", () => {
  it("links the panel to its tab", () => {
    const wrapper = mount(TabItem, {
      props: { header: "Tab 2" },
      global: {
        provide: {
          [SelectedTabKey]: ref("Tab 2"),
          [TabsKey]: [{ header: "Tab 2", tabId: "tab-1", tabpanelId: "tabpanel-1" }],
        },
      },
    });
    expect(wrapper.find(".c-tab").attributes()).toMatchObject({
      "aria-labelledby": "tab-1",
      id: "tabpanel-1",
    });
  });
});
