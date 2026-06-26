// @ts-ignore: Unresolved import
import ListBlock from "@components/content-blocks/ListBlock.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

const makeBlock = (ordered: boolean, items: string[]) => ({
  name: "core/list",
  attributes: { ordered },
  innerBlocks: items.map((content) => ({
    attributes: { content },
    innerBlocks: [],
  })),
});

describe("ListBlock.vue", () => {
  it("renders an unordered list when ordered is false", () => {
    const block = makeBlock(false, ["Item 1", "Item 2"]);
    const wrapper = mount(ListBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("ul").exists()).toBe(true);
    expect(wrapper.find("ol").exists()).toBe(false);
  });

  it("renders an ordered list when ordered is true", () => {
    const block = makeBlock(true, ["First", "Second"]);
    const wrapper = mount(ListBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("ol").exists()).toBe(true);
    expect(wrapper.find("ul").exists()).toBe(false);
  });

  it("has the correct list class", () => {
    const block = makeBlock(false, ["Item"]);
    const wrapper = mount(ListBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("ul").classes()).toContain("c-blocks__list");
    expect(wrapper.find("ul").classes()).toContain("c-blocks__list--unordered");
  });

  it("has ordered list class for ordered lists", () => {
    const block = makeBlock(true, ["Item"]);
    const wrapper = mount(ListBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("ol").classes()).toContain("c-blocks__list--ordered");
  });

  it("renders the correct number of list items", () => {
    const block = makeBlock(false, ["Item 1", "Item 2", "Item 3"]);
    const wrapper = mount(ListBlock, {
      props: { block: block as any },
    });
    const items = wrapper.findAll("li");
    expect(items).toHaveLength(3);
  });

  it("renders empty list when no innerBlocks", () => {
    const block = { name: "core/list", attributes: { ordered: false }, innerBlocks: [] };
    const wrapper = mount(ListBlock, {
      props: { block: block as any },
    });
    expect(wrapper.find("ul").exists()).toBe(true);
    expect(wrapper.findAll("li")).toHaveLength(0);
  });
});
