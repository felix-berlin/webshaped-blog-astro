// @ts-ignore: Unresolved import
import MenuSubmenu from "@components/menu-nav/MenuSubmenu.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("MenuSubmenu.vue", () => {
  it("renders menu element", () => {
    const wrapper = mount(MenuSubmenu, {
      props: { isOpen: true },
    });
    expect(wrapper.find("menu").exists()).toBe(true);
  });

  it("has role=menu", () => {
    const wrapper = mount(MenuSubmenu, {
      props: { isOpen: true },
    });
    expect(wrapper.find("menu").attributes("role")).toBe("menu");
  });

  it("has correct classes", () => {
    const wrapper = mount(MenuSubmenu, {
      props: { isOpen: true },
    });
    const menu = wrapper.find("menu");
    expect(menu.classes()).toContain("c-submenu");
    expect(menu.classes()).toContain("u-list-reset");
  });

  it("renders slot content", () => {
    const wrapper = mount(MenuSubmenu, {
      props: { isOpen: true },
      slots: {
        default: "<li>Menu item</li>",
      },
    });
    expect(wrapper.find("li").text()).toBe("Menu item");
  });

  it("menu is hidden when isOpen=false", () => {
    const wrapper = mount(MenuSubmenu, {
      props: { isOpen: false },
    });
    const menu = wrapper.find("menu");
    expect(menu.isVisible()).toBe(false);
  });

  it("menu is visible when isOpen=true", () => {
    const wrapper = mount(MenuSubmenu, {
      props: { isOpen: true },
    });
    const menu = wrapper.find("menu");
    expect(menu.isVisible()).toBe(true);
  });
});
