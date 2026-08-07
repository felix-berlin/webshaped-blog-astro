// @ts-ignore: Unresolved import
import { filterPostsByLanguage } from "@utils/helpers";
import { it, expect, describe } from "vitest";

describe("filterPostsByLanguage()", () => {
  it("returns an empty array instead of throwing when posts is null", () => {
    expect(filterPostsByLanguage({ posts: null }, "de")).toEqual([]);
  });

  it("returns an empty array instead of throwing when the response itself is null", () => {
    expect(filterPostsByLanguage(null, "de")).toEqual([]);
  });

  it("skips posts with no language relation instead of throwing", () => {
    const posts = [{ language: null, title: "No Lang" }, { language: { slug: "de" }, title: "Hallo" }];

    expect(filterPostsByLanguage({ posts: { nodes: posts } }, "de")).toEqual([
      { language: { slug: "de" }, title: "Hallo" },
    ]);
  });

  it("filters posts down to the requested language", () => {
    const posts = [
      { language: { slug: "en" }, title: "Hello" },
      { language: { slug: "de" }, title: "Hallo" },
    ];

    expect(filterPostsByLanguage({ posts: { nodes: posts } }, "de")).toEqual([
      { language: { slug: "de" }, title: "Hallo" },
    ]);
  });
});
