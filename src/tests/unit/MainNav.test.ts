import MainNav from "@components/hero/MainNav.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe, vi, beforeEach, afterEach } from "vitest";
import { nextTick, ref } from "vue";

const isMobile = ref(false);
vi.mock("@/composables/useBreakpoint", () => ({ useBelowBreakpoint: () => isMobile }));

const menuItems = {
  nodes: [
    {
      label: "Beiträge",
      order: 1,
      path: "/",
      childItems: {
        nodes: [
          { label: "JavaScript", order: 2, path: "/category/javascript/" },
          { label: "PHP", order: 3, path: "/category/php/" },
        ],
      },
    },
  ],
};

const mountNav = () =>
  mount(MainNav, {
    props: { lang: "de", menuItems, translationsRoutes: { de: "/de", en: "/en" } },
    attachTo: document.body,
    global: { stubs: { ButtonBar: true } },
  });

beforeEach(() => {
  isMobile.value = false;
  // Teleport target for the mobile flyout
  const header = document.createElement("header");
  header.id = "mainHeader";
  document.body.appendChild(header);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.body.className = "";
});

describe("MainNav", () => {
  it("renders the desktop menu and button bar above the mobile breakpoint", () => {
    const wrapper = mountNav();
    expect(wrapper.find(".c-main-nav__toggle").isVisible()).toBe(false);
    expect(wrapper.findComponent({ name: "ButtonBar" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "MenuNav" }).exists()).toBe(true);
    wrapper.unmount();
  });

  it("toggles the mobile flyout and locks body scroll while it is open", async () => {
    isMobile.value = true;
    const wrapper = mountNav();
    const toggle = wrapper.find(".c-main-nav__toggle");
    expect(toggle.isVisible()).toBe(true);

    await toggle.trigger("click");
    expect(toggle.attributes("aria-expanded")).toBe("true");
    expect(document.querySelector("#mainHeader .c-main-nav__flyout")).not.toBeNull();
    expect(document.body.classList.contains("u-disable-scroll")).toBe(true);

    await toggle.trigger("click");
    expect(toggle.attributes("aria-expanded")).toBe("false");
    expect(document.body.classList.contains("u-disable-scroll")).toBe(false);
    wrapper.unmount();
  });

  it("closes the flyout and releases the scroll lock when leaving the mobile breakpoint", async () => {
    isMobile.value = true;
    const wrapper = mountNav();
    await wrapper.find(".c-main-nav__toggle").trigger("click");

    isMobile.value = false;
    await nextTick();
    await nextTick();

    expect(wrapper.find(".c-main-nav__toggle").attributes("aria-expanded")).toBe("false");
    expect(document.body.classList.contains("u-disable-scroll")).toBe(false);
    wrapper.unmount();
  });

  it("marks the desktop menu open while a submenu is open", async () => {
    const wrapper = mountNav();
    const menuNav = wrapper.findComponent({ name: "MenuNav" });
    await menuNav.vm.$emit("submenu-state", true);
    expect(menuNav.classes()).toContain("is-open");
    wrapper.unmount();
  });
});
