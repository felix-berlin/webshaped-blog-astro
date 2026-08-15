import { describe, expect, it } from "vitest";

import { isLocaleShapedPath } from "../../middleware";

describe("isLocaleShapedPath", () => {
  it("matches a two-letter locale segment", () => {
    expect(isLocaleShapedPath("/fr/about")).toBe(true);
    expect(isLocaleShapedPath("/fr")).toBe(true);
  });

  it("matches any unconfigured, non-allowlisted top-level segment", () => {
    expect(isLocaleShapedPath("/foo/impressum")).toBe(true);
    expect(isLocaleShapedPath("/xyz/ueber-mich")).toBe(true);
    expect(isLocaleShapedPath("/abc")).toBe(true);
  });

  it("still matches a real configured locale path (requestHasLocale lets it through)", () => {
    expect(isLocaleShapedPath("/de/impressum")).toBe(true);
  });

  it("does not match non-locale-shaped paths", () => {
    expect(isLocaleShapedPath("/api/cms")).toBe(false);
    expect(isLocaleShapedPath("/404")).toBe(false);
    expect(isLocaleShapedPath("/sitemap-index.xml")).toBe(false);
    expect(isLocaleShapedPath("/robots.txt")).toBe(false);
    expect(isLocaleShapedPath("/_astro/chunk.js")).toBe(false);
    expect(isLocaleShapedPath("/pagefind/pagefind.js")).toBe(false);
    expect(isLocaleShapedPath("/assets/logo/logo.svg")).toBe(false);
    expect(isLocaleShapedPath("/category/web-analytics")).toBe(false);
    expect(isLocaleShapedPath("/")).toBe(false);
  });
});
