import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import { firstCategoryPage } from "@utils/helpers";

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
