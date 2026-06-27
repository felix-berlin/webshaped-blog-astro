// @ts-ignore: Unresolved import
import ContentBlocks from "@components/ContentBlocks.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("ContentBlocks.vue", () => {
  it("renders ParagraphBlock for core/paragraph", () => {
    const blocks = [
      { name: "core/paragraph", attributes: { content: "Hello world" }, innerBlocks: [] },
    ];
    const wrapper = mount(ContentBlocks, { props: { blocks: blocks as any } });
    expect(wrapper.findComponent({ name: "ParagraphBlock" }).exists()).toBe(true);
  });

  it("renders ListBlock for core/list", () => {
    const blocks = [
      {
        name: "core/list",
        attributes: { ordered: false },
        innerBlocks: [{ attributes: { content: "Item" }, innerBlocks: [] }],
      },
    ];
    const wrapper = mount(ContentBlocks, { props: { blocks: blocks as any } });
    expect(wrapper.findComponent({ name: "ListBlock" }).exists()).toBe(true);
  });

  it("renders HeadlineBlock for core/heading", () => {
    const blocks = [
      { name: "core/heading", attributes: { content: "Title", level: 2 }, innerBlocks: [] },
    ];
    const wrapper = mount(ContentBlocks, { props: { blocks: blocks as any } });
    expect(wrapper.findComponent({ name: "HeadlineBlock" }).exists()).toBe(true);
  });

  it("renders CodeBlock for core/code", () => {
    const blocks = [
      { name: "core/code", attributes: { content: "const x = 1;" }, innerBlocks: [] },
    ];
    const wrapper = mount(ContentBlocks, { props: { blocks: blocks as any } });
    expect(wrapper.findComponent({ name: "CodeBlock" }).exists()).toBe(true);
  });

  it("renders FigureBlock for core/image", () => {
    const blocks = [
      {
        name: "core/image",
        attributes: { src: "image.jpg", alt: "test" },
        mediaDetails: null,
        innerBlocks: [],
      },
    ];
    const wrapper = mount(ContentBlocks, { props: { blocks: blocks as any } });
    expect(wrapper.findComponent({ name: "FigureBlock" }).exists()).toBe(true);
  });

  it("renders ButtonBlock for core/buttons", () => {
    const blocks = [
      { name: "core/buttons", attributes: {}, innerBlocks: [] },
    ];
    const wrapper = mount(ContentBlocks, { props: { blocks: blocks as any } });
    expect(wrapper.findComponent({ name: "ButtonBlock" }).exists()).toBe(true);
  });

  it("renders multiple blocks", () => {
    const blocks = [
      { name: "core/paragraph", attributes: { content: "Para 1" }, innerBlocks: [] },
      { name: "core/paragraph", attributes: { content: "Para 2" }, innerBlocks: [] },
      { name: "core/heading", attributes: { content: "H2", level: 2 }, innerBlocks: [] },
    ];
    const wrapper = mount(ContentBlocks, { props: { blocks: blocks as any } });
    expect(wrapper.findAllComponents({ name: "ParagraphBlock" })).toHaveLength(2);
    expect(wrapper.findComponent({ name: "HeadlineBlock" }).exists()).toBe(true);
  });

  it("renders nothing for empty blocks array", () => {
    const wrapper = mount(ContentBlocks, { props: { blocks: [] } });
    expect(wrapper.html()).toBe("");
  });
});
