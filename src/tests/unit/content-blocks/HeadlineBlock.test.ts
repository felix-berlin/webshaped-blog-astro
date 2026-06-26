// @ts-ignore: Unresolved import
import HeadlineBlock from "@components/content-blocks/HeadlineBlock.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("HeadlineBlock.vue", () => {
  it("renders an h2 element for level 2", () => {
    const block = {
      name: "core/heading",
      attributes: { content: "My Heading", level: 2, align: null, textAlign: null },
    };
    const wrapper = mount(HeadlineBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("h2").exists()).toBe(true);
  });

  it("renders an h3 element for level 3", () => {
    const block = {
      name: "core/heading",
      attributes: { content: "Sub Heading", level: 3, align: null, textAlign: null },
    };
    const wrapper = mount(HeadlineBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("h3").exists()).toBe(true);
  });

  it("renders plain text content", () => {
    const block = {
      name: "core/heading",
      attributes: { content: "Plain Heading", level: 2, align: null, textAlign: null },
    };
    const wrapper = mount(HeadlineBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("h2").text()).toContain("Plain Heading");
  });

  it("renders HTML content using v-html span", () => {
    const block = {
      name: "core/heading",
      attributes: {
        content: "<em>Formatted Heading</em>",
        level: 2,
        align: null,
        textAlign: null,
      },
    };
    const wrapper = mount(HeadlineBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("h2 span").exists()).toBe(true);
    expect(wrapper.find("h2").html()).toContain("<em>Formatted Heading</em>");
  });

  it("adds an id attribute from plain text content", () => {
    const block = {
      name: "core/heading",
      attributes: { content: "My Cool Heading", level: 2, align: null, textAlign: null },
    };
    const wrapper = mount(HeadlineBlock, {
      props: { block: block as any },
    });
    const id = wrapper.find("h2").attributes("id");
    expect(id).toBe("my-cool-heading");
  });

  it("adds heading level class", () => {
    const block = {
      name: "core/heading",
      attributes: { content: "Heading", level: 2, align: null, textAlign: null },
    };
    const wrapper = mount(HeadlineBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("h2").classes()).toContain("c-blocks__heading--2");
  });
});
