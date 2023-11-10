import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, beforeEach, expect, it } from "vitest";
import TabsView from "@components/tabs/TabsView.vue";

describe("TabsView.vue", () => {
  it("renders correctly", () => {
    const wrapper = mount(TabsView, {
      slots: {
        default: `
          <div header="Tab 1" badge="1"></div>
          <div header="Tab 2" badge="2"></div>
        `,
      },
    });

    expect(wrapper.html()).toContain("Tab 1");
    expect(wrapper.html()).toContain("Tab 2");
  });

  it("changes selected tab on click", async () => {
    const wrapper = mount(TabsView, {
      slots: {
        default: `
          <div header="Tab 1" badge="1"></div>
          <div header="Tab 2" badge="2"></div>
        `,
      },
    });

    await wrapper.find(".c-tabs__header-button.is-inactive").trigger("click");
    await nextTick();

    expect(wrapper.vm.selectedTabHeader).toBe("Tab 2");
  });
});
