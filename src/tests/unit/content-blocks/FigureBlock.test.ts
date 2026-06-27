// @ts-ignore: Unresolved import
import FigureBlock from "@components/content-blocks/FigureBlock.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("FigureBlock.vue", () => {
  it("renders figure element", () => {
    const block = {
      name: "core/image",
      attributes: { src: "https://example.com/img.jpg", alt: "Test", caption: null },
      mediaDetails: { width: 800, height: 600 },
    };
    const wrapper = mount(FigureBlock, { props: { block: block as any } });
    expect(wrapper.find("figure.c-blocks__image").exists()).toBe(true);
  });

  it("renders ImageResponsive for core/image block", () => {
    const block = {
      name: "core/image",
      attributes: { src: "https://example.com/img.jpg", alt: "Alt text", caption: null },
      mediaDetails: { width: 800, height: 600 },
    };
    const wrapper = mount(FigureBlock, { props: { block: block as any } });
    expect(wrapper.findComponent({ name: "ImageResponsive" }).exists()).toBe(true);
  });

  it("does not render ImageResponsive for non-image block", () => {
    const block = {
      name: "core/video",
      attributes: { src: "https://example.com/video.mp4", alt: "", caption: null },
      mediaDetails: null,
    };
    const wrapper = mount(FigureBlock, { props: { block: block as any } });
    expect(wrapper.findComponent({ name: "ImageResponsive" }).exists()).toBe(false);
  });

  it("renders figcaption when caption is present", () => {
    const block = {
      name: "core/image",
      attributes: { src: "https://example.com/img.jpg", alt: "Alt", caption: "A caption" },
      mediaDetails: { width: 800, height: 600 },
    };
    const wrapper = mount(FigureBlock, { props: { block: block as any } });
    expect(wrapper.find("figcaption").exists()).toBe(true);
    expect(wrapper.find("figcaption").html()).toContain("A caption");
  });

  it("does not render figcaption when caption is null", () => {
    const block = {
      name: "core/image",
      attributes: { src: "https://example.com/img.jpg", alt: "Alt", caption: null },
      mediaDetails: { width: 800, height: 600 },
    };
    const wrapper = mount(FigureBlock, { props: { block: block as any } });
    expect(wrapper.find("figcaption").exists()).toBe(false);
  });
});
