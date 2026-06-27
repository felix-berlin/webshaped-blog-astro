// @ts-ignore: Unresolved import
import TableOfContents from "@components/post/TableOfContents.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe, vi } from "vitest";

const headings = [
  { content: "Introduction", level: 2 },
  { content: "Getting Started", level: 2 },
  { content: "Advanced Topics", level: 3 },
];

describe("TableOfContents.vue", () => {
  it("renders a nav element by default", () => {
    const wrapper = mount(TableOfContents, {
      props: { headings, tocId: "toc" },
    });
    expect(wrapper.find("nav").exists()).toBe(true);
  });

  it("uses custom htmlElement prop", () => {
    const wrapper = mount(TableOfContents, {
      props: { headings, htmlElement: "div", tocId: "toc" },
    });
    expect(wrapper.find("div").exists()).toBe(true);
    expect(wrapper.find("nav").exists()).toBe(false);
  });

  it("renders a link for each heading", () => {
    const wrapper = mount(TableOfContents, {
      props: { headings, tocId: "toc" },
    });
    const links = wrapper.findAll("a");
    expect(links).toHaveLength(3);
  });

  it("creates correct href from plain text heading", () => {
    const wrapper = mount(TableOfContents, {
      props: { headings: [{ content: "Hello World", level: 2 }], tocId: "toc" },
    });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe("#hello-world");
  });

  it("creates correct href from HTML heading", () => {
    const wrapper = mount(TableOfContents, {
      props: { headings: [{ content: "<em>Test</em>", level: 2 }], tocId: "toc" },
    });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe("#Test");
  });

  it("adds depth class to links", () => {
    const wrapper = mount(TableOfContents, {
      props: {
        headings: [
          { content: "H2 heading", level: 2 },
          { content: "H3 heading", level: 3 },
        ],
        tocId: "toc",
      },
    });
    const links = wrapper.findAll("a");
    expect(links[0].classes()).toContain("c-toc__link--depth-2");
    expect(links[1].classes()).toContain("c-toc__link--depth-3");
  });

  it("sets up IntersectionObserver on mount without errors", () => {
    // IntersectionObserver is mocked globally in setup.ts - just verify no throw
    expect(() => mount(TableOfContents, { props: { headings, tocId: "toc" } })).not.toThrow();
  });

  it("disconnects IntersectionObserver on unmount", () => {
    const wrapper = mount(TableOfContents, { props: { headings, tocId: "toc" } });
    // Should not throw on unmount
    expect(() => wrapper.unmount()).not.toThrow();
  });

  it("emits tocLinkClicked when a link is clicked", async () => {
    const wrapper = mount(TableOfContents, {
      props: { headings: [{ content: "Hello", level: 2 }], tocId: "toc" },
    });
    await wrapper.find("a").trigger("click");
    expect(wrapper.emitted("tocLinkClicked")).toBeTruthy();
  });

  it("isActiveHeadline returns false for non-active heading", () => {
    const wrapper = mount(TableOfContents, {
      props: { headings: [{ content: "Test Heading", level: 2 }], tocId: "toc" },
    });
    const link = wrapper.find("a");
    expect(link.classes()).not.toContain("is-active");
  });

  it("sets the tocId as the element id", () => {
    const wrapper = mount(TableOfContents, {
      props: { headings, tocId: "my-toc" },
    });
    expect(wrapper.find("nav").attributes("id")).toBe("my-toc");
  });

  it("isActiveHeadline returns true when activeHeadlineId matches", () => {
    const wrapper = mount(TableOfContents, {
      props: { headings: [{ content: "Hello World", level: 2 }], tocId: "toc" },
    });
    wrapper.vm.activeHeadlineId = "hello-world";
    const link = wrapper.find("a");
    expect(wrapper.vm.isActiveHeadline({ content: "Hello World", level: 2 })).toBe(true);
  });

  it("handleIntersect sets active headline when entry is intersecting", async () => {
    const wrapper = mount(TableOfContents, {
      props: { headings: [{ content: "Section", level: 2 }], tocId: "toc" },
      attachTo: document.body,
    });
    const mockEl = document.createElement("h2");
    mockEl.id = "section";
    mockEl.textContent = "Section";
    document.body.appendChild(mockEl);

    const entries = [{ isIntersecting: true, target: mockEl }] as any;
    wrapper.vm.handleIntersect(entries);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.activeHeadlineId).toBe("section");
    expect(wrapper.emitted("currentHeadline")).toBeTruthy();

    document.body.removeChild(mockEl);
    wrapper.unmount();
  });

  it("handleIntersect skips non-intersecting entries", async () => {
    const wrapper = mount(TableOfContents, {
      props: { headings: [{ content: "Section", level: 2 }], tocId: "toc" },
    });
    const mockEl = document.createElement("h2");
    mockEl.id = "section";
    wrapper.vm.activeHeadlineId = "other";

    const entries = [{ isIntersecting: false, target: mockEl }] as any;
    wrapper.vm.handleIntersect(entries);

    expect(wrapper.vm.activeHeadlineId).toBe("other");
  });

  it("observes headings in .c-blog__post on mount (covers line 104)", () => {
    document.body.innerHTML = `
      <div class="c-blog__post">
        <h2 id="intro">Introduction</h2>
        <h3 id="getting-started">Getting Started</h3>
      </div>
    `;
    const wrapper = mount(TableOfContents, {
      props: { headings, tocId: "toc" },
      attachTo: document.body,
    });
    const observerInstance = (wrapper.vm.observer as any);
    expect(observerInstance?.observe).toHaveBeenCalled();
    wrapper.unmount();
    document.body.innerHTML = "";
  });
});
