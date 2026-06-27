import { getLangFromUrl, categoryPathBuilder, createLocalizedUrl } from "@utils/i18n/utils";
import { it, expect, describe } from "vitest";

describe("getLangFromUrl()", () => {
  it("returns 'de' for German URL", () => {
    const url = new URL("https://webshaped.de/de/posts/some-post");
    expect(getLangFromUrl(url)).toBe("de");
  });

  it("returns 'en' for English URL", () => {
    const url = new URL("https://webshaped.de/en/posts/some-post");
    expect(getLangFromUrl(url)).toBe("en");
  });

  it("returns default language 'de' when no known lang in URL", () => {
    const url = new URL("https://webshaped.de/unknown/posts");
    expect(getLangFromUrl(url)).toBe("de");
  });

  it("returns default language 'de' for root URL", () => {
    const url = new URL("https://webshaped.de/");
    expect(getLangFromUrl(url)).toBe("de");
  });
});

describe("categoryPathBuilder()", () => {
  it("builds a correct category path for German", () => {
    const result = categoryPathBuilder("javascript", "de");
    expect(result).toBe("/de/category/javascript/1");
  });

  it("builds a correct category path for English", () => {
    const result = categoryPathBuilder("javascript", "en");
    expect(result).toBe("/en/category/javascript/1");
  });

  it("removes locale suffix from slug", () => {
    const result = categoryPathBuilder("javascript-de", "de");
    expect(result).toBe("/de/category/javascript/1");
  });

  it("removes -en suffix when building English category path", () => {
    const result = categoryPathBuilder("javascript-en", "en");
    expect(result).toBe("/en/category/javascript/1");
  });
});

describe("createLocalizedUrl()", () => {
  it("replaces language segment in URL with target language", () => {
    const translations = { en: "about", de: "ueber-mich" };
    const result = createLocalizedUrl("/de/pages/ueber-mich", "en", translations);
    expect(result).toBe("/en/pages/about");
  });

  it("returns URL with same slug when no translation available", () => {
    const translations = { en: undefined, de: "ueber-mich" } as Record<string, string | undefined>;
    const result = createLocalizedUrl("/de/pages/ueber-mich", "en", translations as Record<string, string>);
    expect(result).toContain("/en/pages/");
  });

  it("handles URL without translation routes", () => {
    const translations = {} as Record<string, string>;
    const result = createLocalizedUrl("/de/posts/my-post", "en", translations);
    expect(result).toBe("/en/posts/my-post");
  });

  it("replaces de with en in path segments", () => {
    const translations = { en: "my-post" };
    const result = createLocalizedUrl("/de/posts/my-post", "en", translations);
    expect(result).toBe("/en/posts/my-post");
  });
});
