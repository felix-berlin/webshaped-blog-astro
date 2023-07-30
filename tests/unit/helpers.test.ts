import { it, expect, describe, vi } from "vitest";
// @ts-ignore: Unresolved import
import { isHtml, parse, getHtmlContent } from "@lib/helpers";

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
});

describe("parse()", () => {
  it("test_valid_json_string", () => {
    const str = '{"name":"John","age":30,"city":"New York"}';
    const result = parse(str);
    expect(result).toEqual({ name: "John", age: 30, city: "New York" });
  });

  it("test_empty_string", () => {
    const str = "";
    const result = parse(str);
    expect(result).toBeUndefined();
  });

  it("test_null", () => {
    const str = null;
    const result = parse(str);
    expect(result).toBeUndefined();
  });

  it("test_undefined", () => {
    const str = undefined;
    const result = parse(str);
    expect(result).toBeUndefined();
  });

  it("test_invalid_json_string", () => {
    const str = '{"name":"John","age":30,"city":"New York"';
    expect(() => parse(str)).toThrowError("Failed to parse JSON string");
  });
});

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
