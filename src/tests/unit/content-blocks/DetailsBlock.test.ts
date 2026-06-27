// @ts-ignore: Unresolved import
import DetailsBlock from "@components/content-blocks/DetailsBlock.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("DetailsBlock.vue", () => {
  it("renders a details element", () => {
    const block = {
      attributes: { showContent: false, summary: "Click to expand" },
      innerBlocks: [],
    };
    const wrapper = mount(DetailsBlock, { props: { block: block as any } });
    expect(wrapper.find("details.c-block-details").exists()).toBe(true);
  });

  it("renders summary text", () => {
    const block = {
      attributes: { showContent: false, summary: "My Summary" },
      innerBlocks: [],
    };
    const wrapper = mount(DetailsBlock, { props: { block: block as any } });
    expect(wrapper.find("summary").text()).toBe("My Summary");
  });

  it("sets open attribute when showContent is true", () => {
    const block = {
      attributes: { showContent: true, summary: "Open by default" },
      innerBlocks: [],
    };
    const wrapper = mount(DetailsBlock, { props: { block: block as any } });
    expect(wrapper.find("details").attributes("open")).toBeDefined();
  });

  it("does not set open attribute when showContent is false", () => {
    const block = {
      attributes: { showContent: false, summary: "Closed by default" },
      innerBlocks: [],
    };
    const wrapper = mount(DetailsBlock, { props: { block: block as any } });
    expect(wrapper.find("details").attributes("open")).toBeUndefined();
  });

  it("renders ContentBlocks when innerBlocks is not empty", () => {
    const block = {
      attributes: { showContent: false, summary: "With content" },
      innerBlocks: [
        { name: "core/paragraph", attributes: { content: "Hello" }, innerBlocks: [] },
      ],
    };
    const wrapper = mount(DetailsBlock, { props: { block: block as any } });
    expect(wrapper.findComponent({ name: "ContentBlocks" }).exists()).toBe(true);
  });

  it("does not render ContentBlocks when innerBlocks is empty", () => {
    const block = {
      attributes: { showContent: false, summary: "No content" },
      innerBlocks: [],
    };
    const wrapper = mount(DetailsBlock, { props: { block: block as any } });
    expect(wrapper.findComponent({ name: "ContentBlocks" }).exists()).toBe(false);
  });
});
