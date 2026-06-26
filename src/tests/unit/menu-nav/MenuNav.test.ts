// @ts-ignore: Unresolved import
import MenuNav from "@components/menu-nav/MenuNav.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe, vi } from "vitest";

const menuItems = [
  {
    label: "Blog",
    order: 1,
    path: "/de/posts",
    childItems: { nodes: [] },
  },
  {
    label: "About",
    order: 2,
    path: "/de/about",
    childItems: {
      nodes: [
        { label: "JavaScript", order: 3, path: "/de/category/javascript/1" },
        { label: "PHP", order: 4, path: "/de/category/php/1" },
      ],
    },
  },
];

describe("MenuNav.vue", () => {
  it("renders the menu element", () => {
    const wrapper = mount(MenuNav, {
      props: { menuItems: menuItems as any },
    });
    expect(wrapper.find("menu.c-menu").exists()).toBe(true);
  });

  it("renders a MenuItem for each top-level menu item (may include children)", () => {
    const wrapper = mount(MenuNav, {
      props: { menuItems: menuItems as any },
    });
    // findAllComponents finds nested MenuItems too (children are rendered recursively)
    const menuItemComponents = wrapper.findAllComponents({ name: "MenuItem" });
    expect(menuItemComponents.length).toBeGreaterThanOrEqual(2);
  });

  it("emits submenu-state event when MenuItem emits it", async () => {
    const wrapper = mount(MenuNav, {
      props: { menuItems: menuItems as any },
    });
    const menuItem = wrapper.findComponent({ name: "MenuItem" });
    await menuItem.vm.$emit("submenu-state", true);
    expect(wrapper.emitted("submenu-state")).toBeTruthy();
  });

  it("emits menu-item-target-clicked event when MenuItem emits it", async () => {
    const wrapper = mount(MenuNav, {
      props: { menuItems: menuItems as any },
    });
    const menuItem = wrapper.findComponent({ name: "MenuItem" });
    await menuItem.vm.$emit("menu-item-target-clicked", 1);
    expect(wrapper.emitted("menu-item-target-clicked")).toBeTruthy();
  });
});
