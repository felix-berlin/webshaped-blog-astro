import { it, expect, describe, vi } from "vitest";
// @ts-ignore: Unresolved import
import {
  isHtml,
  parse,
  getHtmlContent,
  isCategoryPath,
  firstCategoryPage,
  updateCategoryPaths,
} from "@lib/helpers";

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

describe("isCategoryPath()", () => {
  it("returns true when path contains category", () => {
    expect(isCategoryPath("/category/123")).toBe(true);
  });

  it("returns false when path does not contain category", () => {
    expect(isCategoryPath("/product/123")).toBe(false);
  });

  it("returns false when empty string is passed", () => {
    expect(isCategoryPath("")).toBe(false);
  });

  it("returns false when path contains Category (case sensitive)", () => {
    expect(isCategoryPath("/Category/123")).toBe(false);
  });

  it("returns true when path contains category as a substring", () => {
    expect(isCategoryPath("/sub-category/123")).toBe(true);
  });

  it("returns true when path contains category as a prefix or suffix", () => {
    expect(isCategoryPath("/category-sub/123")).toBe(true);
    expect(isCategoryPath("/sub-category/123/category")).toBe(true);
  });
});

describe("firstCategoryPage()", () => {
  it("returns the correct URL when given a valid category path and first page number", () => {
    const categoryPath = "/electronics";
    const firstPage = "3";
    const expectedUrl = "/electronics/3";
    expect(firstCategoryPage(categoryPath, firstPage)).toBe(expectedUrl);
  });

  it("returns the correct URL when first page number is not provided", () => {
    const categoryPath = "/electronics";
    const expectedUrl = "/electronics/1";
    expect(firstCategoryPage(categoryPath)).toBe(expectedUrl);
  });

  it("returns the correct URL when given an empty category path", () => {
    const categoryPath = "";
    const expectedUrl = "/1";
    expect(firstCategoryPage(categoryPath)).toBe(expectedUrl);
  });

  it("returns the correct URL when given a category path with trailing slash", () => {
    const categoryPath = "/electronics/";
    const expectedUrl = "/electronics/1";
    expect(firstCategoryPage(categoryPath)).toBe(expectedUrl);
  });

  it("returns the correct URL when given a category path with leading slash", () => {
    const categoryPath = "/electronics";
    const expectedUrl = "/electronics/1";
    expect(firstCategoryPage(categoryPath)).toBe(expectedUrl);
  });

  it("returns the correct URL when given a category path with leading slash", () => {
    const categoryPath = "/electronics";
    const expectedUrl = "/electronics/1";
    expect(firstCategoryPage(categoryPath)).toBe(expectedUrl);
  });
});

describe("updateCategoryPaths", () => {
  it("updates category paths in the main menu", () => {
    const mainMenuItems = {
      menuItems: {
        nodes: [
          {
            childItems: {
              nodes: [
                {
                  path: "/category1",
                },
                {
                  path: "/category2",
                },
              ],
            },
          },
        ],
      },
    };

    const updatedMenuItems = updateCategoryPaths(mainMenuItems);

    expect(updatedMenuItems.menuItems.nodes[0].childItems.nodes[0].path).toBe(
      "/category1/1",
    );
    expect(updatedMenuItems.menuItems.nodes[0].childItems.nodes[1].path).toBe(
      "/category2/1",
    );
  });

  it("does not update paths that are not category paths", () => {
    const mainMenuItems = {
      menuItems: {
        nodes: [
          {
            childItems: {
              nodes: [
                {
                  path: "/category1",
                },
                {
                  path: "/product1",
                },
              ],
            },
          },
        ],
      },
    };

    const updatedMenuItems = updateCategoryPaths(mainMenuItems);

    expect(updatedMenuItems.menuItems.nodes[0].childItems.nodes[0].path).toBe(
      "/category1/1",
    );
    expect(updatedMenuItems.menuItems.nodes[0].childItems.nodes[1].path).toBe(
      "/product1",
    );
  });

  it("returns null if mainMenuItems is null", () => {
    const mainMenuItems = null;

    const updatedMenuItems = updateCategoryPaths(mainMenuItems);

    expect(updatedMenuItems).toBeNull();
  });
});
