import { describe, expect, it } from "vitest";

import { isLocaleShapedPath } from "../../middleware";

describe("isLocaleShapedPath", () => {
  it("matches a two-letter locale segment", () => {
    expect(isLocaleShapedPath("/fr/about")).toBe(true);
    expect(isLocaleShapedPath("/fr")).toBe(true);
  });

  it("does not match non-locale-shaped paths", () => {
    expect(isLocaleShapedPath("/api/cms")).toBe(false);
    expect(isLocaleShapedPath("/404")).toBe(false);
    expect(isLocaleShapedPath("/sitemap-index.xml")).toBe(false);
    expect(isLocaleShapedPath("/")).toBe(false);
  });
});
