import { categoryPathBuilder } from "@utils/i18n/utils";
import { it, expect, describe } from "vitest";

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
