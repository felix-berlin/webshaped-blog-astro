// @ts-ignore: Unresolved import
import MenuItem from "@components/menu-nav/MenuItem.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe, nextTick, vi } from "vitest";

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
        hasChild: true,
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
        hasChild: true,
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
        hasChild: true,
      },
    });
    const button = wrapper.find("button");
    await button.trigger("click");

    expect(wrapper.vm.isOpen).toBe(true);
    expect(wrapper.emitted()).toHaveProperty("submenu-state");

    await button.trigger("click");

    expect(wrapper.vm.isOpen).toBe(false);
    expect(wrapper.findComponent({ name: "MenuSubmenu" }).vm.isOpen).toBe(false);
  });

  it("renders MenuSubmenu when hasChild is true", () => {
    const wrapper = mount(MenuItem, {
      props: { menuItem: twoMenuItem, depth: 0, index: 0, hasChild: true },
      attachTo: document.body,
    });
    expect(wrapper.findComponent({ name: "MenuSubmenu" }).exists()).toBe(true);
    wrapper.unmount();
  });

  it("calSubmenuDirection runs when submenu is in DOM", async () => {
    const wrapper = mount(MenuItem, {
      props: { menuItem: twoMenuItem, depth: 0, index: 0, hasChild: true },
      attachTo: document.body,
    });
    const button = wrapper.find("button");
    await button.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.submenuDirection).toBe("right");
    wrapper.unmount();
  });

  it("toggleMenuItem returns early when depth/index mismatch", async () => {
    const wrapper = mount(MenuItem, {
      props: { menuItem: twoMenuItem, depth: 0, index: 0, hasChild: true },
    });
    await wrapper.vm.toggleMenuItem(1, 1);
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("emits menu-item-target-clicked when sendEmit is true", async () => {
    const wrapper = mount(MenuItem, {
      props: { menuItem: twoMenuItem, depth: 0, index: 0, hasChild: true },
    });
    await wrapper.vm.toggleMenuItem(0, 0, true);
    expect(wrapper.emitted("menu-item-target-clicked")).toBeTruthy();
  });

  it("mouseenter on button triggers toggle", async () => {
    const wrapper = mount(MenuItem, {
      props: { menuItem: twoMenuItem, depth: 0, index: 0, hasChild: true },
    });
    await wrapper.find("button").trigger("mouseenter");
    expect(wrapper.vm.isOpen).toBe(true);
  });

  it("focus on button triggers toggleMenuItem (covers line 34)", async () => {
    const wrapper = mount(MenuItem, {
      props: { menuItem: twoMenuItem, depth: 0, index: 0, hasChild: true },
    });
    await wrapper.find("button").trigger("focus");
    expect(wrapper.vm.isOpen).toBe(true);
  });

  it("click on link emits menu-item-target-clicked (covers line 18)", async () => {
    const simpleItem = { label: "Home", path: "/", childItems: null };
    const wrapper = mount(MenuItem, {
      props: { menuItem: simpleItem as any, depth: 0, index: 0, hasChild: false },
    });
    await wrapper.find("a.c-menu__link").trigger("click");
    expect(wrapper.emitted("menu-item-target-clicked")).toBeTruthy();
  });

  it("renders a button (not direct link) for top-level item when hasChild is true", () => {
    const wrapper = mount(MenuItem, {
      props: { menuItem: twoMenuItem, depth: 0, index: 0, hasChild: true },
    });
    expect(wrapper.find("button.c-menu__link").exists()).toBe(true);
  });

  it("child MenuItem event handlers execute on mouseenter/click/focus (covers lines 58-60)", async () => {
    const wrapper = mount(MenuItem, {
      props: { menuItem: twoMenuItem, depth: 0, index: 0, hasChild: true },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();

    const childMenuItems = wrapper.findAllComponents({ name: "MenuItem" });
    expect(childMenuItems.length).toBeGreaterThan(0);

    await childMenuItems[0].trigger("mouseenter");
    await childMenuItems[0].trigger("click");
    await childMenuItems[0].trigger("focus");
    await wrapper.vm.$nextTick();

    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("onClickOutside closes submenu when clicking outside (covers lines 140-141)", async () => {
    const wrapper = mount(MenuItem, {
      props: { menuItem: twoMenuItem, depth: 0, index: 0, hasChild: true },
      attachTo: document.body,
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.vm.isOpen).toBe(true);

    // Allow isProcessingClick to reset after the button click (setTimeout 0)
    await new Promise((resolve) => setTimeout(resolve, 0));

    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isOpen).toBe(false);
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("onClickOutside returns early when target has is-menu-title class (covers line 138)", async () => {
    const wrapper = mount(MenuItem, {
      props: { menuItem: twoMenuItem, depth: 0, index: 0, hasChild: true },
      attachTo: document.body,
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.vm.isOpen).toBe(true);

    const fakeTarget = document.createElement("div");
    fakeTarget.classList.add("is-menu-title");
    document.body.appendChild(fakeTarget);
    fakeTarget.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isOpen).toBe(true);
    fakeTarget.remove();
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("child with childItems triggers null branch in event handlers (covers lines 58-60 null branch)", async () => {
    const nestedMenuItem = {
      label: "Products",
      path: null,
      childItems: {
        nodes: [
          {
            label: "Product 1",
            path: "/product-1",
            childItems: {
              nodes: [
                { label: "Sub 1", path: "/sub-1", childItems: null },
              ],
            },
          },
        ],
      },
    };
    const wrapper = mount(MenuItem, {
      props: { menuItem: nestedMenuItem as any, depth: 0, index: 0, hasChild: true },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const childMenuItems = wrapper.findAllComponents({ name: "MenuItem" });
    expect(childMenuItems.length).toBeGreaterThan(0);
    // These trigger the null branch (child has childItems → event handler is null)
    await childMenuItems[0].trigger("mouseenter");
    await childMenuItems[0].trigger("click");
    await childMenuItems[0].trigger("focus");
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("calSubmenuDirection sets left when submenu overflows right edge (covers line 157 left branch)", async () => {
    const wrapper = mount(MenuItem, {
      props: { menuItem: twoMenuItem, depth: 0, index: 0, hasChild: true },
      attachTo: document.body,
    });
    const submenuEl = wrapper.find(".c-submenu");
    if (submenuEl.exists()) {
      vi.spyOn(submenuEl.element, "getBoundingClientRect").mockReturnValue({
        left: 900,
        width: 300,
        top: 0,
        bottom: 0,
        right: 1200,
        height: 0,
        x: 900,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect);
    }
    const button = wrapper.find("button");
    await button.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.submenuDirection).toBe("left");
    wrapper.unmount();
    document.body.innerHTML = "";
  });
});
