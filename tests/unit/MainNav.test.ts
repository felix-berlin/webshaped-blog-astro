import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { it, test, expect, describe, vi, beforeEach, afterEach } from "vitest";
import { JSDOM } from "jsdom";
// @ts-ignore: Unresolved import
import MainNav from "@components/hero/MainNav.vue";
import MenuNav from "@components/menu-nav/MenuNav.vue";

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

  // test("renders correctly", () => {
  //   const mockResizeObserver = vi.fn();
  //   mockResizeObserver.mockReturnValue({
  //     observe: vi.fn(),
  //     unobserve: vi.fn(),
  //     disconnect: vi.fn(),
  //   });
  //   const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  //   global.window = dom.window;
  //   global.document = dom.window.document;
  //   global.window.ResizeObserver = mockResizeObserver;

  //   const wrapper = mount(MainNav, {
  //     props: {
  //       menuItems: menuItems,
  //       lang: {
  //         locale: "de_DE",
  //         id: "de",
  //       },
  //     },
  //   });

  //   expect(wrapper.exists()).toBe(true);
  // });

  test("toggles flyout menu on button click", async () => {
    const mockResizeObserver = vi.fn();
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    mockResizeObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    });
    global.window.ResizeObserver = mockResizeObserver;
    global.window = dom.window;
    global.document = dom.window.document;
    // global.window.innerWidth = 765;
    // global.window.innerHeight = 1024;
    // console.log(global.window.innerWidth, global.window.innerHeight);

    const wrapper = mount(MainNav, {
      props: {
        menuItems: menuItems,
        lang: {
          locale: "de_DE",
          id: "de",
        },
      },
      vm: {
        isMobile: false,
        mainHeaderWidth: 760,
      },
    });

    const button = wrapper.find(".c-main-nav__toggle");

    await button.trigger("click");

    // const MenuNavComponent = wrapper.getComponent(".c-main-nav__menu");

    expect(wrapper.vm.flyoutIsOpen).toBe(true);
  });
});
