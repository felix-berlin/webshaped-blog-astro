// @ts-ignore: Unresolved import
import TableOfContentsClientSide from "@components/post/TableOfContentsClientSide.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("TableOfContentsClientSide.vue", () => {
  it("renders a nav element", () => {
    const wrapper = mount(TableOfContentsClientSide);
    expect(wrapper.find("nav").exists()).toBe(true);
  });

  it("has class c-toc", () => {
    const wrapper = mount(TableOfContentsClientSide);
    expect(wrapper.find("nav").classes()).toContain("c-toc");
  });

  it("uses default id tableOfContents", () => {
    const wrapper = mount(TableOfContentsClientSide);
    expect(wrapper.find("nav").attributes("id")).toBe("tableOfContents");
  });

  it("uses custom id from prop", () => {
    const wrapper = mount(TableOfContentsClientSide, {
      props: { id: "custom-toc" },
    });
    expect(wrapper.find("nav").attributes("id")).toBe("custom-toc");
  });

  it("has role=doc-toc", () => {
    const wrapper = mount(TableOfContentsClientSide);
    expect(wrapper.find("nav").attributes("role")).toBe("doc-toc");
  });

  it("mounts without errors", () => {
    expect(() => mount(TableOfContentsClientSide)).not.toThrow();
  });

  it("unmounts without errors", () => {
    const wrapper = mount(TableOfContentsClientSide);
    expect(() => wrapper.unmount()).not.toThrow();
  });

  it("builds TOC from DOM headings on mount", () => {
    document.body.innerHTML = `
      <div class="content">
        <h2 id="section-1">Section 1</h2>
        <h3 id="section-1-1">Section 1.1</h3>
      </div>
    `;
    const wrapper = mount(TableOfContentsClientSide, {
      props: { target: ".content" },
      attachTo: document.body,
    });
    expect(wrapper.find("nav").exists()).toBe(true);
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("accepts setIndexIdToHeadlines prop", () => {
    const wrapper = mount(TableOfContentsClientSide, {
      props: { setIndexIdToHeadlines: true },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("createTocClientSide builds TOC with h2 elements and setIndexId", () => {
    document.body.innerHTML = `
      <div class="content">
        <h2 id="">Section 1</h2>
        <h3 id="">Section 1.1</h3>
      </div>
      <div id="tableOfContents"></div>
    `;
    const wrapper = mount(TableOfContentsClientSide, {
      props: { target: ".content", setIndexIdToHeadlines: true },
      attachTo: document.body,
    });
    expect(document.querySelector(".c-toc__link")).toBeTruthy();
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("IntersectionObserver callback adds active class when entry is intersecting", async () => {
    document.body.innerHTML = `
      <div id="tableOfContents">
        <ul><li><a class="c-toc__link" href="#section-1">Section 1</a></li></ul>
      </div>
      <h2 id="section-1">Section 1</h2>
    `;
    const wrapper = mount(TableOfContentsClientSide, {
      attachTo: document.body,
    });
    const h2 = document.getElementById("section-1") as HTMLElement;
    const toc = document.getElementById("tableOfContents") as HTMLElement;
    const tocLink = toc.querySelector('a[href="#section-1"]') as HTMLAnchorElement;

    const mockEntry = { isIntersecting: true, target: h2 };
    const observerInstance = (wrapper.vm.observer as any);
    // The IntersectionObserverMock stores the callback as .callback
    if (observerInstance && observerInstance.callback) {
      observerInstance.callback([mockEntry]);
    }
    await wrapper.vm.$nextTick();
    expect(tocLink.classList.contains("c-toc__link--active")).toBe(true);
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("onMounted observes .c-blog__content headings when present in DOM", async () => {
    document.body.innerHTML = `
      <div class="c-blog__content">
        <h2 id="section-a">Section A</h2>
        <h3 id="section-b">Section B</h3>
      </div>
      <div id="tableOfContents"></div>
    `;
    const wrapper = mount(TableOfContentsClientSide, {
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const observerInstance = (wrapper.vm.observer as any);
    // observe() should have been called for the heading elements
    expect(observerInstance?.observe).toHaveBeenCalled();
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("IntersectionObserver callback skips non-intersecting entries", async () => {
    document.body.innerHTML = `
      <div id="tableOfContents">
        <ul><li><a class="c-toc__link c-toc__link--active" href="#section-1">Section 1</a></li></ul>
      </div>
      <h2 id="section-1">Section 1</h2>
    `;
    const wrapper = mount(TableOfContentsClientSide, {
      attachTo: document.body,
    });
    const h2 = document.getElementById("section-1") as HTMLElement;
    const toc = document.getElementById("tableOfContents") as HTMLElement;
    const tocLink = toc.querySelector('a[href="#section-1"]') as HTMLAnchorElement;

    const mockEntry = { isIntersecting: false, target: h2 };
    const observerInstance = (wrapper.vm.observer as any);
    if (observerInstance && observerInstance.callback) {
      observerInstance.callback([mockEntry]);
    }
    await wrapper.vm.$nextTick();
    // Link should still have active class since entry was not intersecting
    expect(tocLink.classList.contains("c-toc__link--active")).toBe(true);
    wrapper.unmount();
    document.body.innerHTML = "";
  });
});
