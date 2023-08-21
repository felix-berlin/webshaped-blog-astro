import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import { isCategoryPath } from "@utils/helpers";

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
