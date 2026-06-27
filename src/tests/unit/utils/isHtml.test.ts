// @ts-ignore: Unresolved import
import { isHtml } from "@utils/helpers";
import { it, expect, describe, afterEach, beforeEach } from "vitest";

describe("isHtml()", () => {
  it("test_html_tag_present", () => {
    const str = "<div>test</div>";
    expect(isHtml(str)).toBe(true);
  });

  it("test_html_tag_not_present", () => {
    const str = "test";
    expect(isHtml(str)).toBe(false);
  });

  it("test_empty_string", () => {
    const str = "";
    expect(isHtml(str)).toBe(false);
  });

  it("test_single_html_tag", () => {
    const str = "<div></div>";
    expect(isHtml(str)).toBe(true);
  });

  it("test_nested_html_tags", () => {
    const str = "<div><span>test</span></div>";
    expect(isHtml(str)).toBe(true);
  });

  it("test_invalid_html_tags", () => {
    const str = "<div><span>test</div></span>";
    expect(isHtml(str)).toBe(true);
  });

  it("uses regex fallback when DOMParser is not defined (covers lines 27-28)", () => {
    const OriginalDOMParser = globalThis.DOMParser;
    // @ts-ignore
    delete globalThis.DOMParser;
    try {
      expect(isHtml("<p>test</p>")).toBe(true);
      expect(isHtml("not html text")).toBe(false);
    } finally {
      globalThis.DOMParser = OriginalDOMParser;
    }
  });
});
