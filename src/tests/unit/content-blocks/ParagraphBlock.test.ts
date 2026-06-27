// @ts-ignore: Unresolved import
import ParagraphBlock from "@components/content-blocks/ParagraphBlock.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("ParagraphBlock.vue", () => {
  it("renders a paragraph element", () => {
    const block = {
      name: "core/paragraph",
      attributes: { content: "Hello world", align: null },
    };
    const wrapper = mount(ParagraphBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("p.c-blocks__paragraph").exists()).toBe(true);
  });

  it("renders HTML content", () => {
    const block = {
      name: "core/paragraph",
      attributes: {
        content: "Text with <strong>bold</strong>",
        align: null,
      },
    };
    const wrapper = mount(ParagraphBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("p").html()).toContain("<strong>bold</strong>");
  });

  it("renders null content without crashing", () => {
    const block = {
      name: "core/paragraph",
      attributes: { content: null, align: null },
    };
    const wrapper = mount(ParagraphBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("p").exists()).toBe(true);
  });

  it("renders empty string content", () => {
    const block = {
      name: "core/paragraph",
      attributes: { content: "", align: null },
    };
    const wrapper = mount(ParagraphBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("p").text()).toBe("");
  });
});
