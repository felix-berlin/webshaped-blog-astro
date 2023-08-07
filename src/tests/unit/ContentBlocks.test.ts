import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import ContentBlocks from "@components/ContentBlocks.vue";

describe("ContentBlocks", () => {
  test("ContentBlocks renders correctly", () => {
    const blocks = [
      {
        name: "core/paragraph",
        attributesJSON: '{"content":"This is a paragraph."}',
        originalContent: "<p>This is a paragraph.</p>",
      },
      {
        name: "core/heading",
        attributesJSON: '{"content":"This is a heading","level":2}',
        originalContent: "<h2>This is a heading</h2>",
      },
      {
        name: "core/code",
        attributesJSON: "{}",
        originalContent: '<code>console.log("Hello, world!");</code>',
      },
      {
        name: "core/image",
        attributesJSON:
          '{"url":"https://example.com/image.jpg","alt":"An example image","caption":"This is an example image."}',
        originalContent:
          '<figure><img src="https://example.com/image.jpg" alt="An example image"><figcaption>This is an example image.</figcaption></figure>',
      },
      {
        name: "core/button",
        attributesJSON:
          '{"text":"Click me!","url":"https://example.com","title":"An example link","target":"_blank","rel":"noopener noreferrer","className":"primary","anchor":"click-me"}',
        originalContent:
          '<a href="https://example.com" title="An example link" target="_blank" rel="noopener noreferrer" class="c-blocks__button primary" id="click-me">Click me!</a>',
      },
      {
        name: "core/html",
        attributesJSON: "{}",
        originalContent: "<div>This is some custom HTML.</div>",
      },
    ];

    const wrapper = mount(ContentBlocks, {
      props: {
        blocks,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
