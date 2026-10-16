import {
  removeTrailingSlash,
  removeLocaleCode,
  getWebmentionsUrl,
  toSiteOrigin,
} from "@utils/helpers";
import { it, expect, describe } from "vitest";

describe("removeTrailingSlash()", () => {
  it("removes trailing slash from string", () => {
    expect(removeTrailingSlash("/category/javascript/")).toBe("/category/javascript");
  });

  it("returns string unchanged when no trailing slash", () => {
    expect(removeTrailingSlash("/category/javascript")).toBe("/category/javascript");
  });

  it("returns empty string when input is empty", () => {
    expect(removeTrailingSlash("")).toBe("");
  });

  it("returns empty string for falsy input", () => {
    expect(removeTrailingSlash(null as unknown as string)).toBe("");
    expect(removeTrailingSlash(undefined as unknown as string)).toBe("");
  });

  it("handles single slash", () => {
    expect(removeTrailingSlash("/")).toBe("");
  });
});

describe("removeLocaleCode()", () => {
  it("removes -de locale suffix from category slug", () => {
    expect(removeLocaleCode("javascript-de")).toBe("javascript");
  });

  it("removes -en locale suffix from category slug", () => {
    expect(removeLocaleCode("javascript-en")).toBe("javascript");
  });

  it("returns string unchanged when no locale suffix", () => {
    expect(removeLocaleCode("javascript")).toBe("javascript");
  });

  it("returns empty string for null input", () => {
    expect(removeLocaleCode(null)).toBe("");
  });

  it("does not remove locale code from middle of string", () => {
    expect(removeLocaleCode("java-de-script")).toBe("java-de-script");
  });
});

describe("getWebmentionsUrl()", () => {
  it("returns correct webmention URL for a given site URL", () => {
    const url = new URL("https://webshaped.de");
    expect(getWebmentionsUrl(url)).toBe("https://webmention.io/webshaped.de");
  });

  it("strips path from URL and uses only hostname", () => {
    const url = new URL("https://example.com/some/path");
    expect(getWebmentionsUrl(url)).toBe("https://webmention.io/example.com");
  });
});

describe("toSiteOrigin()", () => {
  it("rewrites scheme and host to the site origin, keeping the path", () => {
    expect(toSiteOrigin("http://cms.webshaped.de/de/posts/foo", "https://webshaped.de")).toBe(
      "https://webshaped.de/de/posts/foo",
    );
  });

  it("preserves query string and hash", () => {
    expect(
      toSiteOrigin("https://cms.webshaped.de/de?foo=bar#section", "https://webshaped.de"),
    ).toBe("https://webshaped.de/de?foo=bar#section");
  });

  it("returns the input unchanged when it is not a valid URL", () => {
    expect(toSiteOrigin("not-a-url", "https://webshaped.de")).toBe("not-a-url");
  });

  it("returns an empty string unchanged", () => {
    expect(toSiteOrigin("", "https://webshaped.de")).toBe("");
  });

  it("returns a schemeless URL unchanged (not parseable by URL())", () => {
    expect(toSiteOrigin("cms.webshaped.de/de/posts/foo", "https://webshaped.de")).toBe(
      "cms.webshaped.de/de/posts/foo",
    );
  });

  it("rewrites an origin-only URL to the site root", () => {
    expect(toSiteOrigin("https://cms.webshaped.de", "https://webshaped.de")).toBe(
      "https://webshaped.de/",
    );
  });
});
