import { describe, expect, it } from "vitest";

import { isLocaleShapedPath, legacyRedirectTarget } from "../../middleware";

const target = (path: string) => legacyRedirectTarget(new URL(path, "https://webshaped.de"));

describe("legacyRedirectTarget", () => {
  it("redirects a legacy slug and keeps the query string", () => {
    expect(target("/stockfoto-sammlung")).toBe("/de/posts/stockfoto-sammlung");
    expect(target("/stockfoto-sammlung?utm_source=x")).toBe(
      "/de/posts/stockfoto-sammlung?utm_source=x",
    );
  });

  it("matches on the first segment only and drops the rest of the path", () => {
    expect(target("/stockfoto-sammlung/")).toBe("/de/posts/stockfoto-sammlung");
    expect(target("/stockfoto-sammlung/foo?ref=legacy")).toBe(
      "/de/posts/stockfoto-sammlung?ref=legacy",
    );
  });

  it("maps the renamed pagespeed-optimierung post to its new slug", () => {
    expect(target("/pagespeed-optimierung")).toBe("/de/posts/automatische-matomo-backups");
  });

  it("ignores unknown slugs, prefixes and already-migrated paths", () => {
    expect(target("/")).toBeUndefined();
    expect(target("/stockfoto-sammlung-2")).toBeUndefined();
    expect(target("/de/posts/stockfoto-sammlung")).toBeUndefined();
    expect(target("/constructor")).toBeUndefined();
  });
});

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
    expect(isLocaleShapedPath("/_image")).toBe(false);
    expect(isLocaleShapedPath("/")).toBe(false);
  });
});
