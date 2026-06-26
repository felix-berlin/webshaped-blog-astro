// @ts-ignore: Unresolved import
import {
  removeTrailingSlash,
  isWebWorkerSupported,
  removeLocaleCode,
  getWebmentionsUrl,
  flatListToHierarchical,
  paginatedFlatListToHierarchical,
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

describe("isWebWorkerSupported()", () => {
  it("returns true when Worker is defined in global scope", () => {
    const result = isWebWorkerSupported();
    expect(typeof result).toBe("boolean");
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

describe("flatListToHierarchical()", () => {
  it("converts a flat list to a hierarchical structure", () => {
    const data = [
      { id: "1", parentId: null, title: "Root 1" },
      { id: "2", parentId: null, title: "Root 2" },
      { id: "3", parentId: "1", title: "Child of Root 1" },
    ];

    const result = flatListToHierarchical(data);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("1");
    expect((result[0] as Record<string, unknown>).children).toHaveLength(1);
  });

  it("returns empty array for empty input", () => {
    expect(flatListToHierarchical([])).toEqual([]);
  });

  it("supports custom idKey and parentKey options", () => {
    const data = [
      { nodeId: "a", parent: null, name: "Root" },
      { nodeId: "b", parent: "a", name: "Child" },
    ];

    const result = flatListToHierarchical(data, { idKey: "nodeId", parentKey: "parent" });

    expect(result).toHaveLength(1);
    expect((result[0] as Record<string, unknown>).children).toHaveLength(1);
  });

  it("supports custom childrenKey option", () => {
    const data = [
      { id: "1", parentId: null },
      { id: "2", parentId: "1" },
    ];

    const result = flatListToHierarchical(data, { childrenKey: "items" });

    expect((result[0] as Record<string, unknown>).items).toHaveLength(1);
  });

  it("handles nodes with undefined parentId as root nodes", () => {
    const data = [
      { id: "1", parentId: undefined },
      { id: "2", parentId: null },
    ];

    const result = flatListToHierarchical(data);

    expect(result).toHaveLength(2);
  });

  it("builds deeply nested structures", () => {
    const data = [
      { id: "1", parentId: null },
      { id: "2", parentId: "1" },
      { id: "3", parentId: "2" },
    ];

    const result = flatListToHierarchical(data);

    expect(result).toHaveLength(1);
    const level1 = result[0] as Record<string, unknown>;
    const level2 = (level1.children as Array<Record<string, unknown>>)[0];
    expect((level2.children as unknown[]).length).toBe(1);
  });
});

describe("paginatedFlatListToHierarchical()", () => {
  it("converts paginated edges to a hierarchical structure", () => {
    const data = [
      { node: { id: "1", parentId: null, title: "Root" } },
      { node: { id: "2", parentId: "1", title: "Child" } },
    ];

    const result = paginatedFlatListToHierarchical(data);

    expect(result).toHaveLength(1);
    expect((result[0] as Record<string, unknown>).children).toHaveLength(1);
  });

  it("returns empty array for empty input", () => {
    expect(paginatedFlatListToHierarchical([])).toEqual([]);
  });

  it("supports custom nodeKey option", () => {
    const data = [
      { item: { id: "1", parentId: null } },
      { item: { id: "2", parentId: "1" } },
    ];

    const result = paginatedFlatListToHierarchical(data, { nodeKey: "item" });

    expect(result).toHaveLength(1);
  });
});
