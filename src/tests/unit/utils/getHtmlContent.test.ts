import { it, expect, describe, vi } from "vitest";
// @ts-ignore: Unresolved import
import { getHtmlContent } from "@utils/helpers";

describe("getHtmlContent()", () => {
  it("test_empty_string", () => {
    const str = "";
    const result = getHtmlContent(str);
    expect(result).toBe("");
  });

  it("test_no_html_tags", () => {
    const str = "This is a test string";
    const result = getHtmlContent(str);
    expect(result).toBe("");
  });

  it("test_valid_html_string", () => {
    const str = "<h1>This is a test string</h1>";
    const result = getHtmlContent(str);
    expect(result).toBe("This is a test string");
  });

  it("test_nested_tags", () => {
    const str = "<h1>This is a <em>test</em> string</h1>";
    const result = getHtmlContent(str);
    expect(result).toBe("This is a test string");
  });

  it("test_html_attributes", () => {
    const str = '<h1 class="title">This is a test string</h1>';
    const result = getHtmlContent(str);
    expect(result).toBe("This is a test string");
  });

  it("test_invalid_html_string", () => {
    const str = "This is not a valid HTML string";
    const consoleSpy = vi.spyOn(console, "error");
    const result = getHtmlContent(str);
    expect(result).toBe("");
    expect(consoleSpy).toHaveBeenCalledWith(
      "The given string is not valid HTML",
    );
  });
});
