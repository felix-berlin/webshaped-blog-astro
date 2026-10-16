import MobileTableOfContents from "@components/post/MobileTableOfContents.vue";
import { tocHeadings } from "@services/fragments/blockFragments";
import { mount } from "@vue/test-utils";
import { it, expect, describe, beforeEach, vi } from "vitest";
import { ref } from "vue";

const isBelowDesktop = ref(true);
vi.mock("@/composables/useBreakpoint", () => ({ useBelowBreakpoint: () => isBelowDesktop }));

const heading = (content: string, level: number) =>
  tocHeadings([{ name: "core/heading", attributes: { content, level } } as never])[0];

beforeEach(() => {
  isBelowDesktop.value = true;
});

const headings = [heading("Introduction", 2), heading("Getting Started", 3)];

const activeHeadline = (wrapper: ReturnType<typeof mount>) =>
  wrapper.find(".c-mobile-toc__active-headline").text();

describe("MobileTableOfContents.vue", () => {
  it("renders nav below the desktop breakpoint", () => {
    isBelowDesktop.value = true;
    const wrapper = mount(MobileTableOfContents, {
      props: { headings, lang: "de" },
    });
    expect(wrapper.find("nav.c-mobile-toc").exists()).toBe(true);
  });

  it("does not render nav from the desktop breakpoint on", async () => {
    isBelowDesktop.value = false;
    const wrapper = mount(MobileTableOfContents, {
      props: { headings, lang: "de" },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("nav.c-mobile-toc").exists()).toBe(false);
  });

  it("renders details element for toggle", () => {
    isBelowDesktop.value = true;
    const wrapper = mount(MobileTableOfContents, {
      props: { headings, lang: "de" },
    });
    expect(wrapper.find("details.c-mobile-toc__button-wrap").exists()).toBe(true);
  });

  it("renders TableOfContents component inside", () => {
    isBelowDesktop.value = true;
    const wrapper = mount(MobileTableOfContents, {
      props: { headings, lang: "de" },
    });
    expect(wrapper.findComponent({ name: "TableOfContents" }).exists()).toBe(true);
  });

  it("shows the first heading as active headline on mount", async () => {
    isBelowDesktop.value = true;
    const wrapper = mount(MobileTableOfContents, {
      props: { headings, lang: "de" },
    });
    await wrapper.vm.$nextTick();
    expect(activeHeadline(wrapper)).toBe("Introduction");
  });

  it("shows the headline the TableOfContents reports as current", async () => {
    isBelowDesktop.value = true;
    const wrapper = mount(MobileTableOfContents, {
      props: { headings, lang: "de" },
    });
    await wrapper
      .findComponent({ name: "TableOfContents" })
      .vm.$emit("currentHeadline", "Getting Started");
    await wrapper.vm.$nextTick();
    expect(activeHeadline(wrapper)).toBe("Getting Started");
  });

  it("closes the dropdown when a TOC link is clicked", async () => {
    isBelowDesktop.value = true;
    const wrapper = mount(MobileTableOfContents, {
      props: { headings, lang: "de" },
      attachTo: document.body,
    });
    const details = wrapper.find("details").element as HTMLDetailsElement;
    details.open = true;
    await wrapper.find(".c-mobile-toc__dropdown a").trigger("click");
    expect(details.open).toBe(false);
    wrapper.unmount();
  });

  it("closes the dropdown on a click outside", async () => {
    isBelowDesktop.value = true;
    const wrapper = mount(MobileTableOfContents, {
      props: { headings, lang: "de" },
      attachTo: document.body,
    });
    const details = wrapper.find("details").element as HTMLDetailsElement;
    details.open = true;
    // onClickOutside reacts to a pointerdown followed by a click outside the nav.
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(details.open).toBe(false);
    wrapper.unmount();
  });
});
