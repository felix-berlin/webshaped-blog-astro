// @vitest-environment node
import Blocks from "@components/content-blocks/Blocks.astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (blocks: unknown[]) => container.renderToString(Blocks, { props: { blocks } });

describe("Blocks.astro", () => {
  it("renders paragraphs as HTML", async () => {
    const html = await render([
      { name: "core/paragraph", attributes: { content: "Hello <strong>world</strong>" } },
    ]);
    expect(html).toContain('<p class="c-blocks__paragraph">Hello <strong>world</strong></p>');
  });

  it("renders headings with the TOC anchor id and decoded text", async () => {
    const html = await render([
      { name: "core/heading", attributes: { content: "Getting Started", level: 3 } },
      { name: "core/heading", attributes: { content: "Tom &amp; Jerry", level: 2 } },
    ]);
    expect(html).toContain(
      '<h3 class="c-blocks__heading c-blocks__heading--3" id="getting-started">Getting Started</h3>',
    );
    expect(html).toContain(">Tom &amp; Jerry</h2>");
  });

  it("renders ordered lists with one nested level", async () => {
    const html = await render([
      {
        name: "core/list",
        attributes: { ordered: true },
        innerBlocks: [
          {
            attributes: { content: "Parent" },
            innerBlocks: [
              {
                attributes: { ordered: false },
                innerBlocks: [{ attributes: { content: "Child" } }],
              },
            ],
          },
          { attributes: { content: "Second" } },
        ],
      },
    ]);
    expect(html).toMatch(/<ol class="c-blocks__list c-blocks__list--ordered">/);
    expect(html).toMatch(/<ul class="c-blocks__list c-blocks__list--unordered">.*Child/s);
    expect(html).toContain("Second");
  });

  it("renders every button of a buttons block", async () => {
    const html = await render([
      {
        name: "core/buttons",
        innerBlocks: [
          { name: "core/button", attributes: { text: "One", url: "https://a.test" } },
          null,
          { name: "core/button", attributes: { text: "Two", url: "https://b.test", rel: "me" } },
        ],
      },
    ]);
    expect(html.match(/c-button--primary/g)).toHaveLength(2);
    expect(html).toContain('href="https://b.test"');
    expect(html).toContain('rel="me"');
  });

  it("recurses into details blocks", async () => {
    const html = await render([
      {
        name: "core/details",
        attributes: { summary: "More", showContent: true },
        innerBlocks: [{ name: "core/paragraph", attributes: { content: "Inside" } }],
      },
    ]);
    expect(html).toMatch(/<details class="c-block-details" open>/);
    expect(html).toContain("<summary");
    expect(html).toContain("Inside");
  });

  it("highlights code blocks with the shared themes", async () => {
    const html = await render([
      { name: "core/code", attributes: { content: "const a = 1;", className: "js" } },
    ]);
    expect(html).toContain('class="c-blocks__code"');
    expect(html).toContain("astro-code");
  });

  it("skips unknown and empty blocks", async () => {
    const html = await render([null, { name: "core/unknown" }, { name: null }]);
    expect(html.trim()).toBe("");
  });
});
