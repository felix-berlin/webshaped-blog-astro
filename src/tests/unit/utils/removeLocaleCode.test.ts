// @ts-ignore: Unresolved import
import { removeLocaleCode } from "@utils/helpers";
import { it, expect, describe } from "vitest";

describe("removeLocaleCode()", () => {
  it("removes a trailing locale suffix from a category slug", () => {
    expect(removeLocaleCode("vs-code-en")).toBe("vs-code");
  });

  it("leaves normal slugs untouched", () => {
    expect(removeLocaleCode("matomo")).toBe("matomo");
  });

  it("returns an empty string for null", () => {
    expect(removeLocaleCode(null)).toBe("");
  });
});