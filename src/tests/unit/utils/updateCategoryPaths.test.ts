// @ts-ignore: Unresolved import
import { updateCategoryPaths } from "@utils/helpers";
import { it, expect, describe } from "vitest";

describe("updateCategoryPaths", () => {
  it("updates category paths in the main menu", () => {
    const mainMenuItems = {
      nodes: [
        {
          label: "Test Menu",
          order: 7,
          path: "/de/test-menu",
          childItems: {
            nodes: [
              {
                path: "/category1",
              },
              {
                path: "/category2",
              },
            ],
          },
        },
      ],
    };

    const updatedMenuItems = updateCategoryPaths(mainMenuItems, "de");

    expect(updatedMenuItems.nodes[0].childItems.nodes[0].path).toBe("/de/category1/1");
    expect(updatedMenuItems.nodes[0].childItems.nodes[1].path).toBe("/de/category2/1");
  });

  it("does not update paths that are not category paths", () => {
    const mainMenuItems = {
      nodes: [
        {
          label: "Test Menu",
          order: 7,
          path: "/de/test-menu",
          childItems: {
            nodes: [
              {
                path: "/category1",
              },
              {
                path: "/product2",
              },
            ],
          },
        },
      ],
    };

    const updatedMenuItems = updateCategoryPaths(mainMenuItems, "de");

    expect(updatedMenuItems.nodes[0].childItems.nodes[0].path).toBe("/de/category1/1");
    expect(updatedMenuItems.nodes[0].childItems.nodes[1].path).toBe("/product2");
  });

  it("returns null if mainMenuItems is null", () => {
    const mainMenuItems = null;

    const updatedMenuItems = updateCategoryPaths(mainMenuItems, "de");

    expect(updatedMenuItems).toBeNull();
  });

  it("removes -en locale suffix from path when lang is en", () => {
    const mainMenuItems = {
      nodes: [
        {
          label: "Categories",
          order: 1,
          path: "/en/categories",
          childItems: {
            nodes: [
              {
                // No trailing slash — removeLocaleCode regex matches -(de|en)$ at end of string
                path: "/category/javascript-en",
              },
            ],
          },
        },
      ],
    };

    const updatedMenuItems = updateCategoryPaths(mainMenuItems, "en");

    expect(updatedMenuItems.nodes[0].childItems.nodes[0].path).toContain("javascript");
    expect(updatedMenuItems.nodes[0].childItems.nodes[0].path).not.toContain("-en");
  });

  it("skips menu item without childItems (covers line 127 return branch)", () => {
    const mainMenuItems = {
      nodes: [
        { label: "No Children", path: "/", childItems: null },
        {
          label: "Has Children",
          childItems: { nodes: [{ path: "/category/javascript" }] },
        },
      ],
    };

    const result = updateCategoryPaths(mainMenuItems as any, "de");

    expect(result).toBeTruthy();
    expect(result.nodes[1].childItems.nodes[0].path).toContain("/de");
  });

  it("skips child item with null path (covers line 131 || null branch)", () => {
    const mainMenuItems = {
      nodes: [
        {
          label: "Menu",
          childItems: {
            nodes: [
              { path: null },
              { path: "/category/javascript" },
            ],
          },
        },
      ],
    };

    const updatedMenuItems = updateCategoryPaths(mainMenuItems as any, "de");

    // Null path item should remain unchanged
    expect(updatedMenuItems.nodes[0].childItems.nodes[0].path).toBeNull();
    // Category path item should be updated
    expect(updatedMenuItems.nodes[0].childItems.nodes[1].path).toContain("/de");
  });
});
