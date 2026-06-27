// @ts-ignore: Unresolved import
import Menu from "@components/Menu.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

const makeMenuItems = (items: any[]) => ({ nodes: items });

describe("Menu.vue", () => {
  it("renders a link for items without child items", () => {
    const menuItems = makeMenuItems([
      { label: "Home", path: "/", childItems: { nodes: [] } },
    ]);
    const wrapper = mount(Menu, { props: { menuItems: menuItems as any } });
    const link = wrapper.find("a.c-menu__link");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("/");
    expect(link.text()).toBe("Home");
  });

  it("renders a span title for items with children", () => {
    const menuItems = makeMenuItems([
      {
        label: "Products",
        path: null,
        childItems: {
          nodes: [{ label: "Product 1", path: "/product-1" }],
        },
      },
    ]);
    const wrapper = mount(Menu, { props: { menuItems: menuItems as any } });
    expect(wrapper.find("span.is-menu-title").exists()).toBe(true);
    expect(wrapper.find("span.c-menu__link-title").text()).toBe("Products");
  });

  it("renders submenu items for parent items with children", () => {
    const menuItems = makeMenuItems([
      {
        label: "Products",
        path: null,
        childItems: {
          nodes: [
            { label: "Product 1", path: "/product-1" },
            { label: "Product 2", path: "/product-2" },
          ],
        },
      },
    ]);
    const wrapper = mount(Menu, { props: { menuItems: menuItems as any } });
    const submenuLinks = wrapper.findAll(".c-submenu__link");
    expect(submenuLinks).toHaveLength(2);
    expect(submenuLinks[0].text()).toBe("Product 1");
    expect(submenuLinks[1].text()).toBe("Product 2");
  });

  it("adds has-child class to items with children", () => {
    const menuItems = makeMenuItems([
      {
        label: "Products",
        path: null,
        childItems: {
          nodes: [{ label: "Product 1", path: "/product-1" }],
        },
      },
    ]);
    const wrapper = mount(Menu, { props: { menuItems: menuItems as any } });
    expect(wrapper.find("li.c-menu__item").classes()).toContain("has-child");
  });

  it("does not add has-child class to items without children", () => {
    const menuItems = makeMenuItems([
      { label: "Home", path: "/", childItems: { nodes: [] } },
    ]);
    const wrapper = mount(Menu, { props: { menuItems: menuItems as any } });
    expect(wrapper.find("li.c-menu__item").classes()).not.toContain("has-child");
  });

  it("renders multiple top-level items", () => {
    const menuItems = makeMenuItems([
      { label: "Home", path: "/", childItems: { nodes: [] } },
      { label: "About", path: "/about", childItems: { nodes: [] } },
      { label: "Blog", path: "/blog", childItems: { nodes: [] } },
    ]);
    const wrapper = mount(Menu, { props: { menuItems: menuItems as any } });
    expect(wrapper.findAll("li.c-menu__item")).toHaveLength(3);
  });

  it("renders the outer menu element with correct class", () => {
    const menuItems = makeMenuItems([]);
    const wrapper = mount(Menu, { props: { menuItems: menuItems as any } });
    expect(wrapper.find("menu.c-menu").exists()).toBe(true);
  });
});
