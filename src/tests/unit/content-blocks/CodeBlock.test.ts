// @ts-ignore: Unresolved import
import CodeBlock from "@components/content-blocks/CodeBlock.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("CodeBlock.vue", () => {
  it("renders pre element for core/code block", () => {
    const block = {
      name: "core/code",
      attributes: { content: "const x = 1;" },
    };
    const wrapper = mount(CodeBlock, { props: { block: block as any } });
    expect(wrapper.find("pre").exists()).toBe(true);
    expect(wrapper.find("code").text()).toBe("const x = 1;");
  });

  it("uses lang-txt class when className is not provided", () => {
    const block = {
      name: "core/code",
      attributes: { content: "console.log()" },
    };
    const wrapper = mount(CodeBlock, { props: { block: block as any } });
    expect(wrapper.find("pre").classes()).toContain("lang-txt");
  });

  it("uses className when provided", () => {
    const block = {
      name: "core/code",
      attributes: { content: "const x = 1;", className: "language-javascript" },
    };
    const wrapper = mount(CodeBlock, { props: { block: block as any } });
    expect(wrapper.find("pre").classes()).toContain("language-javascript");
    expect(wrapper.find("pre").classes()).not.toContain("lang-txt");
  });

  it("does not render pre for non-code block", () => {
    const block = {
      name: "core/paragraph",
      attributes: { content: "Hello" },
    };
    const wrapper = mount(CodeBlock, { props: { block: block as any } });
    expect(wrapper.find("pre").exists()).toBe(false);
  });
});
