import TableOfContents from "@components/post/TableOfContents.vue";
import { tocHeadings } from "@services/fragments/blockFragments";
import { mount } from "@vue/test-utils";
import { it, expect, describe, vi } from "vitest";

const heading = (content: string, level: number) =>
  tocHeadings([{ name: "core/heading", attributes: { content, level } } as never])[0];

const headings = [
  heading("Introduction", 2),
  heading("Getting Started", 2),
  heading("Advanced Topics", 3),
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
      props: { headings: [heading("Hello World", 2)], tocId: "toc" },
    });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe("#hello-world");
  });

  it("creates correct href from HTML heading", () => {
    const wrapper = mount(TableOfContents, {
      props: { headings: [heading("<em>Test</em>", 2)], tocId: "toc" },
    });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe("#Test");
  });

  it("adds depth class to links", () => {
    const wrapper = mount(TableOfContents, {
      props: {
        headings: [heading("H2 heading", 2), heading("H3 heading", 3)],
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
      props: { headings: [heading("Hello", 2)], tocId: "toc" },
    });
    await wrapper.find("a").trigger("click");
    expect(wrapper.emitted("tocLinkClicked")).toBeTruthy();
  });

  it("isActiveHeadline returns false for non-active heading", () => {
    const wrapper = mount(TableOfContents, {
      props: { headings: [heading("Test Heading", 2)], tocId: "toc" },
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

  it("marks the link active when activeHeadlineId matches", async () => {
    const wrapper = mount(TableOfContents, {
      props: { headings: [heading("Hello World", 2)], tocId: "toc" },
    });
    wrapper.vm.activeHeadlineId = "hello-world";
    await wrapper.vm.$nextTick();
    expect(wrapper.find("a").classes()).toContain("is-active");
  });

  it("handleIntersect sets active headline when entry is intersecting", async () => {
    const wrapper = mount(TableOfContents, {
      props: { headings: [heading("Section", 2)], tocId: "toc" },
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
      props: { headings: [heading("Section", 2)], tocId: "toc" },
    });
    const mockEl = document.createElement("h2");
    mockEl.id = "section";
    wrapper.vm.activeHeadlineId = "other";

    const entries = [{ isIntersecting: false, target: mockEl }] as any;
    wrapper.vm.handleIntersect(entries);

    expect(wrapper.vm.activeHeadlineId).toBe("other");
  });

  it("observes the post's h2/h3 headings on mount", () => {
    const observe = vi.fn();
    const OriginalObserver = globalThis.IntersectionObserver;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe = observe;
        disconnect = vi.fn();
      },
    );
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
    expect(observe).toHaveBeenCalledTimes(2);
    wrapper.unmount();
    document.body.innerHTML = "";
    vi.stubGlobal("IntersectionObserver", OriginalObserver);
  });
});
