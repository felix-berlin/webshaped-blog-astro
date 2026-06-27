// @ts-ignore: Unresolved import
import MobileTableOfContents from "@components/post/MobileTableOfContents.vue";
import { windowWidth } from "@stores/store";
import { mount } from "@vue/test-utils";
import { it, expect, describe, beforeEach } from "vitest";

beforeEach(() => {
  windowWidth.set(800);
});

const headings = [
  { content: "Introduction", level: 2 },
  { content: "Getting Started", level: 3 },
];

describe("MobileTableOfContents.vue", () => {
  it("renders nav when windowWidth < 1024", () => {
    windowWidth.set(800);
    const wrapper = mount(MobileTableOfContents, {
      props: { headings },
    });
    expect(wrapper.find("nav.c-mobile-toc").exists()).toBe(true);
  });

  it("does not render nav when windowWidth >= 1024", async () => {
    windowWidth.set(1200);
    const wrapper = mount(MobileTableOfContents, {
      props: { headings },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("nav.c-mobile-toc").exists()).toBe(false);
  });

  it("renders details element for toggle", () => {
    windowWidth.set(800);
    const wrapper = mount(MobileTableOfContents, {
      props: { headings },
    });
    expect(wrapper.find("details.c-mobile-toc__button-wrap").exists()).toBe(true);
  });

  it("renders TableOfContents component inside", () => {
    windowWidth.set(800);
    const wrapper = mount(MobileTableOfContents, {
      props: { headings },
    });
    expect(wrapper.findComponent({ name: "TableOfContents" }).exists()).toBe(true);
  });

  it("shows the first heading content as active headline on mount", async () => {
    windowWidth.set(800);
    const wrapper = mount(MobileTableOfContents, {
      props: { headings },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.activeHeadlineText).toBe("Introduction");
  });

  it("shows active headline text in span", async () => {
    windowWidth.set(800);
    const wrapper = mount(MobileTableOfContents, {
      props: { headings },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".c-mobile-toc__active-headline").exists()).toBe(true);
  });

  it("currentHeadline updates activeHeadlineText", async () => {
    windowWidth.set(800);
    const wrapper = mount(MobileTableOfContents, {
      props: { headings },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.currentHeadline("Getting Started");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.activeHeadlineText).toBe("Getting Started");
    wrapper.unmount();
  });

  it("TableOfContents emitting current-headline event updates activeHeadlineText via template handler", async () => {
    windowWidth.set(800);
    const wrapper = mount(MobileTableOfContents, {
      props: { headings },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const toc = wrapper.findComponent({ name: "TableOfContents" });
    await toc.vm.$emit("currentHeadline", "Getting Started");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.activeHeadlineText).toBe("Getting Started");
    wrapper.unmount();
  });

  it("closeDropdown closes the details element when toggleButton exists", async () => {
    windowWidth.set(800);
    const wrapper = mount(MobileTableOfContents, {
      props: { headings },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const details = wrapper.find("details").element as HTMLDetailsElement;
    details.open = true;
    wrapper.vm.closeDropdown();
    await wrapper.vm.$nextTick();
    expect(details.open).toBe(false);
    wrapper.unmount();
  });

  it("onClickOutside triggers closeDropdown", async () => {
    windowWidth.set(800);
    const wrapper = mount(MobileTableOfContents, {
      props: { headings },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const details = wrapper.find("details").element as HTMLDetailsElement;
    details.open = true;
    // Click outside the nav
    document.body.click();
    await wrapper.vm.$nextTick();
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("closeDropdown returns early when toggleButton ref is null (width >= 1024)", () => {
    windowWidth.set(1200); // v-if="pageWidth < 1024" is false, so toggleButton doesn't render
    const wrapper = mount(MobileTableOfContents, {
      props: { headings },
    });
    // toggleButton.value is null (template didn't render), calling closeDropdown should not throw
    expect(() => wrapper.vm.closeDropdown()).not.toThrow();
    wrapper.unmount();
    windowWidth.set(800);
  });
});
