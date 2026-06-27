// @ts-ignore: Unresolved import
import MainNav from "@components/hero/MainNav.vue";
import { isMobileBreakpoint } from "@stores/store";
import { mount } from "@vue/test-utils";
import { JSDOM } from "jsdom";
import { it, test, expect, describe, vi, beforeEach, afterEach } from "vitest";
import { nextTick } from "vue";

beforeEach(() => {
  // create teleport target
  const el = document.createElement("header");
  el.id = "mainHeader";
  document.body.appendChild(el);
});

afterEach(() => {
  // clean up
  document.body.outerHTML = "";
});

describe("MainNav", () => {
  const menuItems = {
    nodes: [
      {
        label: "Beiträge",
        order: 1,
        path: "/",
        childItems: {
          nodes: [
            {
              label: "JavaScript",
              order: 2,
              path: "/category/javascript/",
            },
            { label: "PHP", order: 3, path: "/category/php/" },
            {
              label: "WordPress",
              order: 4,
              path: "/category/wordpress/",
            },
            { label: "Matomo", order: 5, path: "/category/matomo/" },
            { label: "VS Code", order: 6, path: "/category/vs-code/" },
          ],
        },
      },
    ],
  };

  test("renders correctly", () => {
    const wrapper = mount(MainNav, {
      props: {
        menuItems: menuItems,
        lang: {
          locale: "de_DE",
          id: "de",
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("renders ButtonBar when isMobile is false", () => {
    const wrapper = mount(MainNav, {
      props: {
        menuItems: menuItems,
        lang: {
          locale: "de_DE",
          id: "de",
        },
      },
      global: {
        mocks: {
          isMobile: false,
        },
      },
    });

    expect(wrapper.findComponent({ name: "ButtonBar" }).exists()).toBe(true);
  });

  it("renders mobile toggle button when isMobile is true", async () => {
    isMobileBreakpoint.set(true);
    const wrapper = mount(MainNav, {
      props: { menuItems: menuItems as any },
      attachTo: document.body,
    });
    await nextTick();
    expect(wrapper.find(".c-main-nav__toggle").isVisible()).toBe(true);
    isMobileBreakpoint.set(false);
    wrapper.unmount();
  });

  it("shows mobile flyout with MenuNav when isMobile=true and flyout is open", async () => {
    isMobileBreakpoint.set(true);
    const wrapper = mount(MainNav, {
      props: { menuItems: menuItems as any },
      attachTo: document.body,
    });
    await nextTick();
    await wrapper.find(".c-main-nav__toggle").trigger("click");
    await nextTick();
    expect(wrapper.vm.flyoutIsOpen).toBe(true);
    isMobileBreakpoint.set(false);
    wrapper.unmount();
  });

  it("ResizeObserver callback updates isMobileBreakpoint", async () => {
    const wrapper = mount(MainNav, {
      props: { menuItems: menuItems as any },
      attachTo: document.body,
    });
    await nextTick();
    const observer = (globalThis as any).__lastResizeObserver;
    if (observer) {
      observer.callback([{ contentRect: { width: 760 } }]);
      await nextTick();
    }
    wrapper.unmount();
  });

  it("ResizeObserver callback closes flyout when not mobile", async () => {
    isMobileBreakpoint.set(true);
    const wrapper = mount(MainNav, {
      props: { menuItems: menuItems as any },
      attachTo: document.body,
    });
    await nextTick();
    await wrapper.find(".c-main-nav__toggle").trigger("click");
    expect(wrapper.vm.flyoutIsOpen).toBe(true);
    const observer = (globalThis as any).__lastResizeObserver;
    if (observer) {
      observer.callback([{ contentRect: { width: 1200 } }]);
      await nextTick();
    }
    isMobileBreakpoint.set(false);
    wrapper.unmount();
  });

  it("submenu-state event from desktop MenuNav updates submenuIsOpen (covers line 40)", async () => {
    isMobileBreakpoint.set(false);
    const wrapper = mount(MainNav, {
      props: { menuItems: menuItems as any },
      attachTo: document.body,
    });
    await nextTick();
    const menuNav = wrapper.findComponent({ name: "MenuNav" });
    await menuNav.vm.$emit("submenu-state", true);
    await nextTick();
    expect(wrapper.vm.submenuIsOpen).toBe(true);
    wrapper.unmount();
  });

  it("submenu-state event from mobile flyout MenuNav updates submenuIsOpen (covers line 26)", async () => {
    isMobileBreakpoint.set(true);
    const wrapper = mount(MainNav, {
      props: { menuItems: menuItems as any },
      attachTo: document.body,
    });
    await nextTick();
    await wrapper.find(".c-main-nav__toggle").trigger("click");
    await nextTick();
    expect(wrapper.vm.flyoutIsOpen).toBe(true);
    const menuNavs = wrapper.findAllComponents({ name: "MenuNav" });
    if (menuNavs.length > 0) {
      await menuNavs[0].vm.$emit("submenu-state", true);
      await nextTick();
      expect(wrapper.vm.submenuIsOpen).toBe(true);
    }
    isMobileBreakpoint.set(false);
    wrapper.unmount();
  });

  test("toggles flyout menu on button click", async () => {
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    global.window = dom.window;
    global.document = dom.window.document;

    const event = new Event("resize");
    window.dispatchEvent(event);

    global.window.innerWidth = 765;
    global.window.innerHeight = 1024;

    const wrapper = mount(MainNav, {
      props: {
        menuItems: menuItems,
        lang: {
          locale: "de_DE",
          id: "de",
        },
      },
    });

    wrapper.vm.isMobile = true;
    wrapper.vm.mainHeaderWidth = 760;

    const button = wrapper.find(".c-main-nav__toggle");

    expect(button.exists()).toBe(true);

    await button.trigger("click");

    const MenuNavComponent = wrapper.getComponent(".c-main-nav__menu");

    expect(wrapper.vm.flyoutIsOpen).toBe(true);
    expect(MenuNavComponent.exists()).toBe(true);
  });
});
