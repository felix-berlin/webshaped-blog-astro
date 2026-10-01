import { toIsoUtc } from "@utils/helpers";
import { categoryPathBuilder, getLang, postPathBuilder, toLanguageCode } from "@utils/i18n/utils";
import { describe, expect, it } from "vitest";

describe("path & locale helpers", () => {
  it("getLang falls back to the default language for unknown locales", () => {
    expect(getLang("en")).toBe("en");
    expect(getLang("fr")).toBe("de");
    expect(getLang(undefined)).toBe("de");
  });

  it("toLanguageCode maps slugs to the WPGraphQL enum", () => {
    expect(toLanguageCode("en")).toBe("EN");
  });

  it("builds post and paginated category paths", () => {
    expect(postPathBuilder("hello", "en")).toBe("/en/posts/hello");
    expect(categoryPathBuilder("css-en", "en")).toBe("/en/category/css/1");
    expect(categoryPathBuilder("css", "de", "3")).toBe("/de/category/css/3");
  });

  it("toIsoUtc appends Z only when missing", () => {
    expect(toIsoUtc("2024-01-01T00:00:00")).toBe("2024-01-01T00:00:00Z");
    expect(toIsoUtc("2024-01-01T00:00:00Z")).toBe("2024-01-01T00:00:00Z");
    expect(toIsoUtc(null)).toBeUndefined();
  });
});
