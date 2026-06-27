// @ts-ignore: Unresolved import
import ButtonBlock from "@components/content-blocks/ButtonBlock.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

const mockBlock = {
  name: "core/button",
  attributes: {
    url: "https://example.com",
    text: "Click me",
    title: "Button title",
    linkTarget: "_blank",
    rel: "noopener",
    textAlign: "center",
    type: "button",
  },
};

describe("ButtonBlock.vue", () => {
  it("renders an anchor element", () => {
    const wrapper = mount(ButtonBlock, {
      props: { block: mockBlock as any },
    });
    expect(wrapper.find("a").exists()).toBe(true);
  });

  it("renders the button text", () => {
    const wrapper = mount(ButtonBlock, {
      props: { block: mockBlock as any },
    });
    expect(wrapper.find("a").text()).toBe("Click me");
  });

  it("renders the correct href", () => {
    const wrapper = mount(ButtonBlock, {
      props: { block: mockBlock as any },
    });
    expect(wrapper.find("a").attributes("href")).toBe("https://example.com");
  });

  it("renders the correct target attribute", () => {
    const wrapper = mount(ButtonBlock, {
      props: { block: mockBlock as any },
    });
    expect(wrapper.find("a").attributes("target")).toBe("_blank");
  });

  it("renders the correct title attribute", () => {
    const wrapper = mount(ButtonBlock, {
      props: { block: mockBlock as any },
    });
    expect(wrapper.find("a").attributes("title")).toBe("Button title");
  });

  it("renders the correct rel attribute", () => {
    const wrapper = mount(ButtonBlock, {
      props: { block: mockBlock as any },
    });
    expect(wrapper.find("a").attributes("rel")).toBe("noopener");
  });

  it("has the button CSS classes", () => {
    const wrapper = mount(ButtonBlock, {
      props: { block: mockBlock as any },
    });
    expect(wrapper.find("a").classes()).toContain("c-button");
    expect(wrapper.find("a").classes()).toContain("c-button--primary");
  });
});
