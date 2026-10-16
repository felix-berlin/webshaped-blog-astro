import TableOfContents from "@components/post/TableOfContents.vue";
import { tocHeadings } from "@services/fragments/blockFragments";
import { mount } from "@vue/test-utils";
import { afterEach, it, expect, describe, vi } from "vitest";

const OriginalObserver = globalThis.IntersectionObserver;
afterEach(() => vi.stubGlobal("IntersectionObserver", OriginalObserver));

/** Replaces IntersectionObserver with one the test can fire by hand. */
const stubObserver = () => {
  let callback: IntersectionObserverCallback | undefined;
  const disconnect = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb;
      }
      observe = vi.fn();
      disconnect = disconnect;
    },
  );
  return {
    disconnect,
    intersect: (target: Element, isIntersecting: boolean) =>
      callback?.([{ isIntersecting, target }] as never, {} as never),
  };
};

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

  it("disconnects its IntersectionObserver on unmount", () => {
    const observer = stubObserver();
    const wrapper = mount(TableOfContents, { props: { headings, tocId: "toc" } });
    wrapper.unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
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

  it("marks the heading that scrolls into view as active and emits its text", async () => {
    const observer = stubObserver();
    const wrapper = mount(TableOfContents, {
      props: { headings: [heading("Section", 2)], tocId: "toc" },
    });
    const target = Object.assign(document.createElement("h2"), {
      id: "section",
      textContent: "Section",
    });

    observer.intersect(target, true);
    await wrapper.vm.$nextTick();

    expect(wrapper.find("a").classes()).toContain("is-active");
    expect(wrapper.emitted("currentHeadline")).toEqual([["Section"]]);
  });

  it("ignores headings that are leaving the viewport", async () => {
    const observer = stubObserver();
    const wrapper = mount(TableOfContents, {
      props: { headings: [heading("Section", 2)], tocId: "toc" },
    });
    const target = Object.assign(document.createElement("h2"), { id: "section" });

    observer.intersect(target, false);
    await wrapper.vm.$nextTick();

    expect(wrapper.find("a").classes()).not.toContain("is-active");
    expect(wrapper.emitted("currentHeadline")).toBeUndefined();
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
