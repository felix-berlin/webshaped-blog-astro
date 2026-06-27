// @ts-ignore: Unresolved import
import ButtonsBlock from "@components/content-blocks/ButtonsBlock.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

const makeButton = (text: string, url: string) => ({
  attributes: { text, url, linkTarget: "_blank", className: "" },
  innerBlocks: [],
});

describe("ButtonsBlock.vue", () => {
  it("renders the buttons container", () => {
    const block = {
      innerBlocks: [makeButton("Click me", "https://example.com")],
    };
    const wrapper = mount(ButtonsBlock, { props: { block: block as any } });
    expect(wrapper.find(".c-buttons").exists()).toBe(true);
  });

  it("renders a ButtonBlock for each inner block", () => {
    const block = {
      innerBlocks: [
        makeButton("Button 1", "https://example.com/1"),
        makeButton("Button 2", "https://example.com/2"),
      ],
    };
    const wrapper = mount(ButtonsBlock, { props: { block: block as any } });
    const buttonBlocks = wrapper.findAllComponents({ name: "ButtonBlock" });
    expect(buttonBlocks).toHaveLength(2);
  });

  it("renders empty container when no inner blocks", () => {
    const block = { innerBlocks: [] };
    const wrapper = mount(ButtonsBlock, { props: { block: block as any } });
    expect(wrapper.find(".c-buttons").exists()).toBe(true);
    expect(wrapper.findAllComponents({ name: "ButtonBlock" })).toHaveLength(0);
  });
});
