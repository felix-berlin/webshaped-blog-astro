import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import MenuItem from "@components/menu-nav/MenuItem.vue";

describe("MenuItem", () => {
  const twoMenuItem = {
    label: "Products",
    path: null,
    childItems: {
      nodes: [
        {
          label: "Product 1",
          path: "/product-1",
          childItems: null,
        },
        {
          label: "Product 2",
          path: "/product-2",
          childItems: null,
        },
      ],
    },
  };

  it("renders a link if the menu item does not have child items", () => {
    const menuItem = {
      label: "Home",
      path: "/",
      childItems: null,
    };
    const wrapper = mount(MenuItem, {
      props: {
        menuItem,
        depth: 0,
        index: 0,
      },
    });
    expect(wrapper.find("a").exists()).toBe(true);
  });

  it("renders a button if the menu item has child items", () => {
    const wrapper = mount(MenuItem, {
      props: {
        menuItem: twoMenuItem,
        depth: 0,
        index: 0,
      },
    });
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("toggles the submenu when the button is clicked", async () => {
    const wrapper = mount(MenuItem, {
      props: {
        menuItem: twoMenuItem,
        depth: 0,
        index: 0,
      },
    });
    const button = wrapper.find("button");
    await button.trigger("click");
    expect(wrapper.vm.isOpen).toBe(true);
  });

  it("toggles the submenu when the user clicks", async () => {
    const wrapper = mount(MenuItem, {
      props: {
        menuItem: twoMenuItem,
        depth: 0,
        index: 0,
      },
    });
    const button = wrapper.find("button");
    await button.trigger("click");

    expect(wrapper.vm.isOpen).toBe(true);
    expect(wrapper.emitted()).toHaveProperty("submenu-state");

    await button.trigger("click");

    expect(wrapper.vm.isOpen).toBe(false);
    expect(wrapper.findComponent({ name: "MenuSubmenu" }).vm.isOpen).toBe(
      false,
    );
  });
});
